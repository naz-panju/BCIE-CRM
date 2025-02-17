import { ApplicationApi } from '@/data/Endpoints/Application';
import { LeadApi } from '@/data/Endpoints/Lead';
import { DownloadOutlined, UploadOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { blue } from '@mui/material/colors';
import FileSaver from 'file-saver';
import moment from 'moment';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Grid } from 'rsuite';
import XLSX from 'sheetjs-style';

function ExportExcel({ from, fileName, params, data, tableLoading, duplicate }) {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileExtension = '.xlsx';

    const [loading, setLoading] = useState(false)

    const handleExport = () => {
        setLoading(true)
        let action;
        let Datas = []
        if (from == 'lead') {
            action = LeadApi.list(params)
        } else if (from == 'app') {
            params['full_lead'] = 1
            action = ApplicationApi.list(params)
        }
        action.then((response) => {
            // console.log(response);
            // setcsvData(response?.data?.data)
            console.log(response?.data?.data);
            
            filterArray(response?.data?.data, Datas)
            ExportFunction(Datas)
            setLoading(false)
        }).catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message || error)
            setLoading(false)
        })
    }

    const ExportFunction = async (Datas) => {
        const ws = XLSX.utils.json_to_sheet(Datas);
        const wb = {
            Sheets: { 'data': ws },
            SheetNames: ['data']
        };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    const filterArray = (array, Datas) => {
        if (from == 'lead') {
            array?.map((obj) => (
                Datas.push({
                    // Identification and Registration Details
                    "Lead Id": obj?.lead_unique_id || 'NA',
                    "Registered Name": obj?.name || 'NA',

                    // Dates and Status Information
                    ...(duplicate ? { 'Duplicated Date': moment(obj?.duplicate_last_got_on).format('DD-MM-YYYY') } : { 'Created Date': moment(obj?.created_at).format('DD-MM-YYYY') }),
                    "Stage": obj?.stage?.name || 'NA',
                    "Created Date": moment(obj?.created_at).format('DD-MM-YYYY'),
                    ...(obj?.date_of_birth ? { "Date of Birth": moment(obj?.date_of_birth).format('DD-MM-YYYY') } : { "Date of Birth": "NA" }),

                    // Location and Residence Information
                    "Country of Residence": obj?.country_of_residence?.name || 'NA',
                    "City of Student": obj?.city || 'NA',
                    "Country of Birth": obj?.country_of_birth?.name || 'NA',
                    "Address": obj?.address || "NA",

                    // Assigned Details
                    "Assigned To": obj?.assignedToCounsellor?.name || 'NA',
                    "Office": obj?.assignedToOffice?.name || 'NA',

                    // Contact Information
                    "Email Address": obj?.email || 'NA',
                    ...(obj?.phone_number ? { 'Mobile Number': "+" + obj?.phone_number } : { 'Mobile Number': 'NA' }),
                    ...(obj?.alternate_phone_number ? { 'Alternate Mobile Number': "+" + obj?.alternate_phone_number } : { 'Alternate Mobile Number': 'NA' }),
                    ...(obj?.whatsapp_number ? { 'WhatsApp Number': "+" + obj?.whatsapp_number } : { 'WhatsApp Number': 'NA' }),

                    // Passport Details
                    "Passport Number": obj?.passport || "NA",
                    ...(obj?.passport_exp_date ? { "Passport Expiry Date": moment(obj?.passport_exp_date).format('DD-MM-YYYY') } : { "Passport Expiry Date": "NA" }),

                    // Preferences and Campaigns
                    "Preferred Country": obj?.preferred_countries || 'NA',
                    "Here About Us From": obj?.referrance_from || "NA",
                    "Lead Source": obj?.lead_source?.name || 'NA',

                    // Referral Details (based on lead source ID)
                    ...((obj?.lead_source?.id == 1 || obj?.lead_source?.id == 2) ? { "Campaign": obj?.campaign?.name || "NA" } : { "Campaign": "" }),
                    ...(obj?.lead_source?.id == 5 ? { "Referred Student": obj?.referredStudent?.name || "NA" } : { "Referred Student": "" }),
                    ...(obj?.lead_source?.id == 6 ? { "Referred Agency": obj?.agency?.name || "NA" } : { "Referred Agency": "" }),
                    ...(obj?.lead_source?.id == 7 ? { "Referred University": obj?.referred_university?.name || "NA" } : { "Referred University": "" }),
                    ...(obj?.lead_source?.id == 11 ? { "Event": obj?.event?.name || "NA" } : { "Event": "" }),

                    // Sponsorship and External Sign-Up Information
                    "Sponsorship Detail": obj?.sponser_details || "NA",
                    "Sign Up for External Parties": obj?.sign_up_for_external_parties ? 'Yes' : 'No',

                    // Notes and Additional Information
                    "Note": obj?.note || "NA",
                    ...(obj?.closed == 1 && obj?.archive_reason ? { "Archive Reason": obj?.archive_reason } : {}),
                    ...(obj?.closed == 1 && obj?.archive_note ? { "Archive Note": obj?.archive_note } : {}),
                    ...(obj?.withdrawn == 1 && obj?.withdraw_reason ? { "Withdrawn Reason": obj?.withdraw_reason } : {}),
                })
            ))
        } else if (from == 'app') {
            array?.map((obj) => (
                Datas.push({
                    "Student Id": obj?.lead?.student_code || 'NA',
                    "University Id": obj?.application_number || 'NA',
                    "Student": obj?.lead?.name || 'NA',
                    ...(obj?.lead?.date_of_birth ? { "Student DOB": moment(obj?.lead?.date_of_birth).format('DD-MM-YYYY') } : { "tudent DOB": 'NA' }),
                    // "Student DOB": moment(obj?.lead?.date_of_birth).format('DD-MM-YYYY'),
                    "Application Country": obj?.country?.name || 'NA',
                    "University": obj?.university?.name || 'NA',
                    "Course Level": obj?.course_level?.name || 'NA',
                    "Course": obj?.course || 'NA',
                    "Intake": obj?.intake?.name || 'NA',
                    "Application Stage": obj?.stage?.name || 'NA',
                    "Submited to University": obj?.submitted_to_university_on ? moment(obj?.submitted_to_university_on).format('DD-MM-YYYY') : 'NA',
                    "Counsellor": obj?.lead?.assignedToCounsellor?.name || 'NA',
                    "University Deposit": obj?.deposit_amount_paid || 'NA',

                    // Lead details 

                    "Lead Id": obj?.lead?.lead_unique_id || 'NA',
                    // Dates and Status Information
                    ...(duplicate ? { 'Lead Duplicated Date': moment(obj?.lead?.duplicate_last_got_on).format('DD-MM-YYYY') } : { 'Created Date': moment(obj?.lead?.created_at).format('DD-MM-YYYY') }),
                    "Lead Stage": obj?.lead?.stage?.name || 'NA',
                    "Lead Created Date": moment(obj?.lead?.created_at).format('DD-MM-YYYY'),

                    // Location and Residence Information
                    "Country of Residence": obj?.lead?.country_of_residence?.name || 'NA',
                    "City of Student": obj?.lead?.city || 'NA',
                    "Country of Birth": obj?.lead?.country_of_birth?.name || 'NA',
                    "Lead Address": obj?.lead?.address || "NA",

                    // Assigned Details
                    "Office": obj?.lead?.assignedToOffice?.name || 'NA',

                    // Contact Information
                    "Email Address": obj?.lead?.email || 'NA',
                    ...(obj?.lead?.phone_number ? { 'Mobile Number': "+" + obj?.lead?.phone_number } : { 'Mobile Number': 'NA' }),
                    ...(obj?.lead?.alternate_phone_number ? { 'Alternate Mobile Number': "+" + obj?.lead?.alternate_phone_number } : { 'Alternate Mobile Number': 'NA' }),
                    ...(obj?.lead?.whatsapp_number ? { 'WhatsApp Number': "+" + obj?.lead?.whatsapp_number } : { 'WhatsApp Number': 'NA' }),

                    // Passport Details
                    "Passport Number": obj?.lead?.passport || "NA",
                    ...(obj?.lead?.passport_exp_date ? { "Passport Expiry Date": moment(obj?.lead?.passport_exp_date).format('DD-MM-YYYY') } : { "Passport Expiry Date": "NA" }),

                    // Preferences and Campaigns
                    "Preferred Country": obj?.lead?.preferred_countries || 'NA',
                    "Here About Us From": obj?.lead?.referrance_from || "NA",
                    "Lead Source": obj?.lead?.lead_source?.name || 'NA',

                    // Referral Details (based on lead source ID)
                    ...((obj?.lead?.lead_source?.id == 1 || obj?.lead?.lead_source?.id == 2) ? { "Campaign": obj?.lead?.campaign?.name || "NA" } : { "Campaign": "" }),
                    ...(obj?.lead?.lead_source?.id == 5 ? { "Referred Student": obj?.lead?.referredStudent?.name || "NA" } : { "Referred Student": "" }),
                    ...(obj?.lead?.lead_source?.id == 6 ? { "Referred Agency": obj?.lead?.agency?.name || "NA" } : { "Referred Agency": "" }),
                    ...(obj?.lead?.lead_source?.id == 7 ? { "Referred University": obj?.lead?.referred_university?.name || "NA" } : { "Referred University": "" }),
                    ...(obj?.lead?.lead_source?.id == 11 ? { "Event": obj?.lead?.event?.name || "NA" } : { "Event": "" }),

                    // Sponsorship and External Sign-Up Information
                    "Sponsorship Detail": obj?.lead?.sponser_details || "NA",
                    "Sign Up for External Parties": obj?.lead?.sign_up_for_external_parties ? 'Yes' : 'No',

                    //   Notes and Additional Information
                    "Note": obj?.lead?.note || "NA",
                    ...(obj?.lead?.closed == 1 && obj?.lead?.archive_reason ? { "Archive Reason": obj?.lead?.archive_reason } : {}),
                    ...(obj?.lead?.closed == 1 && obj?.lead?.archive_note ? { "Archive Note": obj?.lead?.archive_note } : {}),
                    ...(obj?.lead?.withdrawn == 1 && obj?.lead?.withdraw_reason ? { "Withdrawn Reason": obj?.lead?.withdraw_reason } : {}),
                })
            ))
        }
    }

    return (
        <div className='flex justify-end mb-3'>
            <Button disabled={loading || tableLoading || data?.length == 0} style={{ backgroundColor: blue[500], color: 'white', textTransform: 'none', width: 90 }} onClick={handleExport}>
                {
                    loading ?
                        <div className="spinner"></div>
                        : <><UploadOutlined fontSize='small' sx={{ mr: 1 }} />Export</>
                }
            </Button>
        </div>
    )
}

export default ExportExcel
