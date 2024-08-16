import { ApplicationApi } from '@/data/Endpoints/Application';
import { LeadApi } from '@/data/Endpoints/Lead';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { blue } from '@mui/material/colors';
import FileSaver from 'file-saver';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Grid } from 'rsuite';
import XLSX from 'sheetjs-style';

function ExportExcel({ from, fileName, params, data, tableLoading }) {

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
            action = ApplicationApi.list(params)
        }
        action.then((response) => {
            // setcsvData(response?.data?.data)
            filterArray(response?.data?.data, Datas)
            ExportFunction(Datas)
            setLoading(false)
        }).catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message)
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
                    "Lead Id": obj?.lead_unique_id || 'NA',
                    "Registered Name": obj?.name || 'NA',
                    "Office": obj?.assignedToOffice?.name || 'NA',
                    "Country of Residence": obj?.country_of_residence?.name || 'NA',
                    "City of Student": obj?.city || 'NA',
                    "Preferred Country": obj?.preferred_countries || 'NA',
                    "Assigned To": obj?.assignedToCounsellor?.name || 'NA',
                    "Stage": obj?.stage?.name || 'NA',
                })
            ))
        } else if (from == 'app') {
            array?.map((obj) => (
                Datas.push({
                    "Student Id": obj?.lead?.student_code || 'NA',
                    "University Id": obj?.application_number || 'NA',
                    "Student": obj?.lead?.name || 'NA',
                    "Country": obj?.country?.name || 'NA',
                    "University": obj?.university?.name || 'NA',
                    "Course Level": obj?.course_level?.name || 'NA',
                    "Course": obj?.course || 'NA',
                    "Intake": obj?.intake?.name || 'NA',
                    "Stage": obj?.stage?.name || 'NA',
                    "Counsellor": obj?.lead?.assignedToCounsellor?.name || 'NA',
                    "University Deposit": obj?.deposit_amount_paid || 'NA',
                })
            ))
        }
    }

    return (
        <div className='flex justify-end mb-3'>
            <Button disabled={loading || tableLoading || data?.length == 0} style={{ backgroundColor: blue[500], color: 'white', textTransform: 'none' }} onClick={handleExport}>
                {
                    loading ?
                        <div className="spinner"></div>
                        : "Export"
                }
            </Button>
        </div>
    )
}

export default ExportExcel
