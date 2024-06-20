import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, ListItem, ListItemButton, ListItemText, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Delete, Refresh } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import DateInput from '@/Form/DateInput';
import SelectX from '@/Form/SelectX';
import TextInput from '@/Form/TextInput';
import { useState } from 'react';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import AsyncSelect from "react-select/async";
import moment from 'moment';
import { StudentApi } from '@/data/Endpoints/Student';
import toast from 'react-hot-toast';
import { TemplateApi } from '@/data/Endpoints/Template';
import dynamic from 'next/dynamic';
import { LeadApi } from '@/data/Endpoints/Lead';
import Editor from '@/Form/Editor';
import { List } from 'rsuite';
import DocumentSelectModal from '../Tabs/application/modals/documentSelect';



const MyEditor = dynamic(() => import("../../../Form/MyEditor"), {
    ssr: false,
});





const scheme = yup.object().shape({
    subject: yup.string().required("Subject is Required"),
    body: yup.string().required("Body is Required"),
    // default_cc: yup.array().required("Mail CC is Required"),
    // dob: yup.string().required("Date Of Birth is Required"),
    // zip: yup.string().required("Zip Code is Required"),
    // country: yup.object().required("Please Choose a Country").typeError("Please choose a Country"),
    // state: yup.string().required("State is Required"),
})

export default function SendMail({ details, editId, setEditId, lead_id, refresh, setRefresh, from, app_id }) {

    const [state, setState] = React.useState({
        right: false,
    });
    const [selectedPriority, setSelectedPriority] = useState('Medium');
    const [open, setOpen] = useState(false)

    const [altPhone, setAltPhone] = useState()
    const [altCode, setAltCode] = useState()

    const [whatsapp, setWhatsapp] = useState()
    const [whatsappCode, setWhatsappCode] = useState()

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)


    const [attachment, setAttachment] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [attachmentFiles, setattachmentFiles] = useState([])

    const [textBoxLoading, setTextBoxLoading] = useState(false)

    const [editorKey, seteditorKey] = useState(1)


    const [file, setFile] = useState([])


    const handleFileUpload = (event) => {
        setFileInputKey(prevKey => prevKey + 1);
        const file = event.target.files[0];
        if (file) {
            setAttachment(file);
        }
    };

    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }

    const handleDeleteAttachment = (index) => {
        const updatedAttachments = [...file];
        updatedAttachments.splice(index, 1);
        setFile(updatedAttachments);
    };

    const items = [
        { label: 'Title' },
        { label: 'Due Date' },
        { label: 'Assigned To' },
        { label: 'Reviewer' },
        { label: 'Priority' },
        { label: 'Description', multi: true },

    ]

    const anchor = 'right'; // Set anchor to 'right'

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const handleFileChange = (e) => {
        const newFile = e?.target?.files[0];
        setFile([...file, newFile]); // Add the new file to the state
    };



    const fetchTemplates = (e) => {
        return ListingApi.emailTemplate({ keyword: e }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }




    const onSubmit = async (data) => {

        setLoading(true)
        const formData = new FormData()

        formData.append('to', data?.to)
        formData.append('cc', data?.default_cc)
        formData.append('subject', data?.subject || '')
        formData.append('message', data?.body || '')
        formData.append('lead_id', lead_id || '')

        if (from == 'app') {
            formData.append('application_id', app_id || '')
        }


        if (attachmentFiles?.length > 0) {
            attachmentFiles?.map(obj => {
                // console.log(obj?.file_path);
                formData.append('attachment_files[]', obj?.file_path)
            })
        }

        if (file?.length > 0) {
            file?.map(obj => {
                formData.append('attachments[]', obj)
            })
        }

        // console.log(dataToSubmit);

        let action;

        if (editId > 0) {
            // dataToSubmit['id'] = editId
            action = LeadApi.sendMail(formData)
        } else {
            action = LeadApi.sendMail(formData)
        }

        action.then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success('Email Sent Successfully');
                setRefresh()
                reset()
                handleClose()
                // setRefresh(!refresh)
                setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
                setLoading(false)
            }

            setLoading(false)
        }).catch((error) => {
            console.log(error);
            toast.error(error?.message)
            setLoading(false)
        })
    }


    const handleClose = () => {
        setEditId()
        // reset()
        setValue('template', '')
        setValue('default_cc', '')
        setValue('subject', '')
        setValue('to', '')
        setValue('body', '')
        setOpen(false)
        setFile()
        setattachmentFiles([])
    }

    const handleDrawerClose = (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        // Check if the close icon was clicked
        if (event.target.tagName === 'svg') {
            setOpen(false);
        }
    };


    const handleTemplateChange = (data) => {
        // console.log(data);.
        setTextBoxLoading(true)
        setValue('template', data || '')

        TemplateApi.mailTemplate({ template_id: data?.id, lead_id: lead_id }).then((response) => {

            console.log(response);

            if (response?.status == 200 || response?.status == 201) {
                // let cc = 
                // cc = response?.data?.data?.template?.default_cc?.map((obj) => {
                //     cc.
                // })
                let cc = response?.data?.data?.template?.default_cc?.join(',');


                // setValue('default_cc', cc)

                setValue('default_cc', response?.data?.data?.template?.default_cc || '')
                // setValue('to', details?.email || '')
                setValue('subject', response?.data?.data?.template?.subject || '')
                setValue('body', response?.data?.data?.template?.body || '')
                setattachmentFiles(response?.data?.data?.attchments)

                seteditorKey(Math.random() * 0.23)
                setTextBoxLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
                setTextBoxLoading(false)
            }

        })


    }


    const getInitialValue = () => {
        if (from == 'app') {
            setValue('to', details?.student?.email)
        } else if (from == 'lead') {
            setValue('to', details?.email)
        }

    }

    const handleClick = () => {
        // This will trigger a click event on the input element, opening the file dialog
        document.getElementById('upload-button').click();
    };

    const [docOpenId, setdocOpenId] = useState()
    const handleDocumentSelectOpen = () => {
        setdocOpenId(editId)
    }
    const [SelectedDocuments, setSelectedDocuments] = useState([])
    const [SelectedFile, setSelectedFile] = useState([])

    const handleDocumentOpen = (url) => {
        window.open(url, '_blank');
    };

    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
        } else if (editId == 0) {
            setOpen(true)
        }
        getInitialValue()
    }, [editId])


    return (
        <div>
            <DocumentSelectModal from={'lead'} editId={docOpenId} setEditId={setdocOpenId} SelectedDocuments={attachmentFiles} setSelectedDocuments={setattachmentFiles} SelectedAttachments={file} setSelectedAttachments={setFile} />

            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleClose}
            >
                <Grid width={650}>
                    <Grid className='modal_title d-flex align-items-center  '>

                        <a className='back_modal' onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                            </svg>
                        </a>
                        <a className='back_modal_head'> Send Mail </a>




                    </Grid>
                    <div className='form-data-cntr'>

                        <form onSubmit={handleSubmit(onSubmit)}>

                            {
                                dataLoading ?
                                    <LoadingEdit item={items} />
                                    :
                                    <div>

                                        <div className='application-input'>
                                            <a className='form-text' > Select Template</a>
                                            <Grid className='mb-5 forms-data'>
                                                <AsyncSelect
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                                    }}
                                                    // placeholder='Select Template'
                                                    // isDisabled={!selectedUniversityId}
                                                    // key={selectedUniversityId}
                                                    name={'template'}
                                                    defaultValue={watch('template')}
                                                    // isClearable
                                                    defaultOptions
                                                    loadOptions={fetchTemplates}
                                                    getOptionLabel={(e) => e.name}
                                                    getOptionValue={(e) => e.id}
                                                    onChange={handleTemplateChange}
                                                />
                                                {/* <SelectX
                                                    // menuPlacement='top'
                                                    loadOptions={fetchTemplates}
                                                    control={control}
                                                    name={'template'}
                                                    defaultValue={watch('template')}
                                                /> */}
                                                {errors.template && <span className='form-validation'>{errors.template.message}</span>}
                                            </Grid>
                                        </div>



                                        <div className='application-input'>
                                            <a className='form-text' > To</a>
                                            <Grid className='mb-5 forms-data  '>
                                                <TextInput disabled control={control} name="to"
                                                    value={watch('to')} />
                                                {errors.to && <span className='form-validation'>{errors.to.message}</span>}
                                            </Grid>
                                        </div>



                                        <div className='application-input'>
                                            <a className='form-text' > CC</a>
                                            <Grid className='mb-5 forms-data  '>
                                                {
                                                    textBoxLoading ?
                                                        <Skeleton variant='rounded' width={'100%'} height={40} />
                                                        :
                                                        <TextInput control={control} name="default_cc"
                                                            value={watch('default_cc')} />
                                                }
                                                {errors.default_cc && <span className='form-validation'>{errors.default_cc.message}</span>}
                                            </Grid>
                                        </div>


                                        <div className='application-input'>
                                            <a className='form-text' > Subject</a>

                                            <Grid className='mb-5 forms-data  '>
                                                {
                                                    textBoxLoading ?
                                                        <Skeleton variant='rounded' width={'100%'} height={40} />
                                                        :
                                                        <TextInput control={control} name="subject"
                                                            value={watch('subject')} />
                                                }
                                                {errors.subject && <span className='form-validation'>{errors.subject.message}</span>}
                                            </Grid>
                                        </div>


                                        <div className='application-input'>
                                            <a className='form-text' > Body</a>
                                            <Grid className='mb-5 forms-data  '>
                                                {
                                                    textBoxLoading ?
                                                        <Skeleton variant='rounded' width={'100%'} height={400} />
                                                        :
                                                        <Editor key={editorKey} emoji={false} val={watch('body')}
                                                            onValueChange={e => setValue('body', e)} />
                                                }
                                                {/* <MyEditor name={'body'} onValueChange={e => setValue('body', e)} value={watch('body')} /> */}
                                            </Grid>
                                        </div>


                                        {/* {
                                            attachmentFiles?.length > 0 &&
                                            <Grid display={'flex'} container p={1.5} item xs={12}>
                                                <Grid item display={'flex'} xs={3} md={3}>
                                                    <Typography sx={{ fontWeight: '500' }}>Attachments</Typography>
                                                </Grid>
                                                <Grid item xs={9} md={9}>
                                                    {
                                                        attachmentFiles?.map((obj, index) => (
                                                            <p style={{ textDecoration: 'underLine', color: 'blue', cursor: 'pointer' }} key={index} className="text-gray-700">
                                                                <a target='_blank' href={obj?.attachment}>{trimUrlAndNumbers(obj?.attachment)}</a>
                                                            </p>
                                                        ))
                                                    }
                                                </Grid>
                                            </Grid>
                                        } */}
                                        <div className='application-input'>

                                            <Grid p={1} mt={1} mb={1} display={'flex'} alignItems={'center'} container >
                                                <Grid item pr={1} alignItems={'center'} xs={4} md={4}>
                                                    {/* <label htmlFor="file-input"> */}
                                                    {/* <input
                                                        type="file"
                                                        id="file-input"
                                                        style={{ display: 'none' }}
                                                        onChange={handleFileChange}
                                                    /> */}
                                                    <Button onClick={handleDocumentSelectOpen} sx={{ textTransform: 'none', height: 30 }}
                                                        variant='contained'
                                                        className='bg-sky-800' size='small' component="span">
                                                        Add Documents
                                                    </Button>
                                                    {/* </label> */}
                                                    {/* <input
                                                    type="file"
                                                    id="upload-button"
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileUpload}
                                                    key={fileInputKey}
                                                /> */}
                                                </Grid>



                                                {/* {
                                                file &&
                                                <Grid display={'flex'} flexDirection={'column'} justifyContent={'space-between'} item pr={1} xs={8} md={8}>

                                                    {file?.map((obj, index) => (
                                                        <Grid display={'flex'} xs={12} md={12} justifyContent={'space-between'} key={index} sx={{ pl: 1, mt: 0.5 }} item >
                                                            <a style={{ color: 'grey', fontSize: '14px' }}>{obj?.name}</a>
                                                            <a style={{ cursor: 'pointer' }} onClick={() => handleDeleteAttachment(index)}>
                                                                <Delete fontSize='small' style={{ color: 'red' }} />
                                                            </a>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            } */}
                                            </Grid>
                                        </div>
                                        {
                                            attachmentFiles?.length > 0 &&
                                            <Grid>
                                                <span style={{ fontSize: '16px' }}>Student Documents</span>
                                                <List>
                                                    {attachmentFiles?.map((document, index) => (

                                                        <ListItem key={index} className='list-item-mail ' >
                                                            {/* <ListItemButton > */}
                                                            <ListItemText sx={{ cursor: 'pointer' }} onClick={() => handleDocumentOpen(document?.file || document?.attachment)} primary={document?.title || document?.document_template?.name || trimUrlAndNumbers(document?.file_path)} />
                                                            {/* </ListItemButton> */}
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Grid>
                                        }

                                        {
                                            file?.length > 0 &&
                                            <Grid mt={3}>
                                                <span style={{ fontSize: '16px' }}>Uploaded Files</span>
                                                <List >
                                                    {file?.map((document, index) => (
                                                        <ListItem key={index} className='list-item-mail '>
                                                            <ListItemText primary={document?.name} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Grid>
                                        }




                                    </div>
                            }

                            <Grid p={1} pb={3} display={'flex'} >
                                <LoadingButton className='save-btn' loading={loading} disabled={loading || dataLoading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>
                                    {
                                        loading ?
                                            <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                            :
                                            <>
                                                Send  <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                    <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                                </svg>
                                            </>
                                    }
                                </LoadingButton>

                                <Button className='cancel-btn' onClick={handleClose} size='small' sx={{ textTransform: 'none', mr: 2 }} variant='outlined'>Cancel <svg svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                </svg> </Button>

                            </Grid>

                        </form>
                    </div>
                </Grid>
            </Drawer>
        </div >
    );
}
