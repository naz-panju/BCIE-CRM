import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Checkbox, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Archive, AttachFile, Close, Delete, Refresh } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import DateInput from '@/Form/DateInput';
import SelectX from '@/Form/SelectX';
import TextInput from '@/Form/TextInput';
import DynamicChip from '@/utils/DynamicChip';
import { useState } from 'react';
import moment from 'moment';
import { TaskApi } from '@/data/Endpoints/Task';
import toast from 'react-hot-toast';
import { LeadApi } from '@/data/Endpoints/Lead';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import ConfirmPopup from '@/Components/Common/Popup/confirm';
import { TemplateApi } from '@/data/Endpoints/Template';
import Editor from '@/Form/Editor';
import dynamic from 'next/dynamic';
import { WhatsAppTemplateApi } from '@/data/Endpoints/WhatsAppTemplate';
import TemplateData from '@/Components/EmailTemplates/TemplateData';
import WhatsAppTemplateData from '../TemplateData';

// import MyEditor from '@/Form/MyEditor';

const MyEditor = dynamic(() => import("../../../Form/MyEditor"), {
    ssr: false,
});

const scheme = yup.object().shape({
    template_name: yup.string().required('This field is required')
})

export default function CreateWhatsAppTemplate({ editId, setEditId, refresh, setRefresh, lead_id, handleRefresh }) {
    const [state, setState] = React.useState({
        right: false,
    });
    const [selectedPriority, setSelectedPriority] = useState('Medium');
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)

    const [isChecked, setIsChecked] = useState(false);

    const [file, setFile] = useState([])

    const [attachmentFiles, setattachmentFiles] = useState([])

    const [confirmId, setconfirmId] = useState()
    const [confirmLoading, setconfirmLoading] = useState(false)

    const [isSysytemTemplate, setIsSysytemTemplate] = useState(false)


    const handleDeleteAttachment = (index) => {
        const updatedAttachments = [...file];
        updatedAttachments.splice(index, 1);
        setFile(updatedAttachments);
    };


    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
        // Add any additional logic here if needed
    };

    const items = [
        { label: 'Template Name' },
        { label: 'Template Name' },
        { label: 'Body', multi: true },
        { label: 'Body Footer' },
        // { label: 'Description' },

    ]

    const anchor = 'right'; // Set anchor to 'right'

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const handleFileChange = (e) => {
        const newFile = e?.target?.files[0];
        setFile([...file, newFile]); // Add the new file to the state
    };

    const [toggleTable, settoggleTable] = useState(false)
    const handleToggleTable = () => {
        settoggleTable(!toggleTable)
    }

    const onSubmit = async (data) => {

        setLoading(true)

        let dataToSubmit = {
            title: data?.title,
            template_name: data?.template_name,
            content: data?.content,
            approved: isChecked
        }


        let action;

        if (editId > 0) {
            dataToSubmit['id'] = editId
            action = WhatsAppTemplateApi.update(dataToSubmit)
        } else {
            action = WhatsAppTemplateApi.add(dataToSubmit)
        }

        action.then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(editId > 0 ? 'WhatsApp Template Has Been Successfully Updated' : 'WhatsApp Template Has Been Successfully Created')
                reset()
                handleClose()
                handleRefresh()
                setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
                setLoading(false)
            }

            setLoading(false)
        }).catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message)
            setLoading(false)
        })
    }


    const handleClose = () => {
        setEditId()
        reset()
        setattachmentFiles([])
        setIsChecked(false)
        setValue('title', '')
        setValue('content', '')
        setValue('template_name', '')
        setOpen(false)
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

    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }

    const handleDeleteConfirm = (obj) => {
        setconfirmId(obj?.id)
    }

    const handleDeleteFiles = () => {
        setconfirmLoading(true)

        const index = attachmentFiles.findIndex(obj => obj.id === confirmId);
        if (index !== -1) {
            attachmentFiles.splice(index, 1);
        }

        setconfirmId()
        setconfirmLoading(false)
    }

    const getDetails = async () => {
        setDataLoading(true)
        try {
            const response = await WhatsAppTemplateApi.view({ id: editId })
            if (response?.data?.data) {
                let data = response?.data?.data
                // console.log(data);

                setValue('title', data?.title)
                setValue('content', data?.content)
                setValue('template_name', data?.template_name)
                setIsChecked(data?.approved == 1 ? true : false)

                setDataLoading(false)
            }
            setDataLoading(false)
        } catch (error) {
            setDataLoading(false)
        }
    }


    const contentRef = React.useRef(null);
    const [cursorPosition, setCursorPosition] = useState(null);
    const handleCursorPosition = (e) => {
        setCursorPosition(e.target.selectionStart);
    };
    const setTemplateValue = (data, event) => {
        const currentContent = watch('content') || '';
        const newValue =
            currentContent.slice(0, cursorPosition) +
            data +
            currentContent.slice(cursorPosition);

        setValue('content', newValue);
        setCursorPosition(cursorPosition + data.length);
    }



    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            getDetails()
        } else if (editId == 0) {
            setOpen(true)
        }
    }, [editId])

    // console.log(watch('body'));


    return (
        <div>

            <ConfirmPopup loading={confirmLoading} ID={confirmId} setID={setconfirmId} clickFunc={handleDeleteFiles} title={`Do you want to Delete this Attachment?`} />


            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleClose}
            >
                <div className='flex' style={{ width: toggleTable ? 1050 : 650 }}>
                    {
                        toggleTable &&
                        <Grid width={500} >
                            {/* setValue={setcopied} isFocused={isFocused} setSubject={setSubject} */}
                            <WhatsAppTemplateData handleToggleTable={handleToggleTable} setValue={setTemplateValue} />
                        </Grid>
                    }
                    <Grid width={650} sx={{ borderLeft: toggleTable ? '1px solid' : '' }}>
                        <Grid className='modal_title d-flex align-items-center  '>

                            <a className='back_modal' onClick={handleClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                    <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                            <a className='back_modal_head'> {editId > 0 ? "Edit Whatsapp Template" : 'Add Whatsapp Template'} </a>

                        </Grid>
                        <div className='form-data-cntr'>

                            <Button sx={{ mb: 1, textTransform: 'none' }} variant='outlined' onClick={handleToggleTable}>
                                Open Template Data
                            </Button>

                            <form onSubmit={handleSubmit(onSubmit)}>

                                {/* <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                    <Grid item md={4}>
                                        <Typography sx={{ fontWeight: '500' }}>Select Lead</Typography>
                                    </Grid>
                                    <Grid item md={8}>
                                        <SelectX
                                            options={fetchLead}
                                            control={control}
                                            // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
                                            // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
                                            name={'lead'}
                                            defaultValue={watch('lead')}
                                        />
                                    </Grid>
                                </Grid> */}

                                {
                                    dataLoading ?
                                        <LoadingEdit item={items} />
                                        :
                                        <>

                                            {/* <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                                <Grid item xs={12} md={2.5}>
                                                    <Typography sx={{ fontWeight: '500' }}>System Template</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={9.5}>
                                                    <Checkbox checked={isSysytemTemplate} disabled />
                                                </Grid>
                                            </Grid> */}

                                            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                                <div className='application-input'>
                                                    <a className='form-text'>Title</a>
                                                    <Grid className='mb-5 forms-data'>
                                                        <TextInput disabled={isSysytemTemplate} control={control} name="title"
                                                            value={watch('title')} />
                                                        {errors.title && <span className='form-validation'>{errors.title.message}</span>}
                                                    </Grid>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                                <div className='application-input'>
                                                    <a className='form-text'>Template Name</a>
                                                    <Grid className='mb-5 forms-data'>
                                                        <TextInput disabled={isSysytemTemplate} control={control} name="template_name"
                                                            value={watch('template_name')} />
                                                        {errors.template_name && <span className='form-validation'>{errors.template_name.message}</span>}
                                                    </Grid>
                                                </div>
                                            </div>


                                            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                                <div className='application-input'>
                                                    <a className='form-text'>Template Content</a>
                                                    <Grid className='mb-5 forms-data'>
                                                        <TextField onClick={handleCursorPosition} ref={contentRef} placeholder='' multiline rows={8} fullWidth control={control}  {...register('content')}
                                                            value={watch('content') || ''} />
                                                    </Grid>
                                                </div>
                                            </div>


                                            {/* {
                                                attachmentFiles?.length > 0 &&
                                                <Grid display={'flex'} container p={1.5} item xs={12}>
                                                    <Grid item display={'flex'} xs={12} md={2.5}>
                                                        <Typography sx={{ fontWeight: '500' }}>Attachments</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} md={9.5}>
                                                        {
                                                            attachmentFiles?.map((obj, index) => (
                                                                <Grid key={index} display={'flex'} justifyContent={'space-between'}>
                                                                    <p style={{ textDecoration: 'underLine', color: 'blue', cursor: 'pointer' }} className="text-gray-700">
                                                                        <a target='_blank' href={obj?.attachment}>{trimUrlAndNumbers(obj?.attachment)}</a>
                                                                    </p>
                                                                    <Delete onClick={() => handleDeleteConfirm(obj)} fontSize='small' style={{ color: 'red', cursor: 'pointer' }} />
                                                                </Grid>
                                                            ))
                                                        }
                                                    </Grid>
                                                </Grid>
                                            }
    
                                            <Grid display={'flex'} container p={1.5} item xs={12}>
                                                <Grid item xs={12} md={2.5}>
                                                    <label htmlFor="file-input">
                                                        <input
                                                            type="file"
                                                            id="file-input"
                                                            style={{ display: 'none' }}
                                                            onChange={handleFileChange}
                                                        />
                                                        <Button sx={{ textTransform: 'none', height: 30 }}
                                                            variant='contained'
                                                            className='bg-sky-800' size='small' component="span">
                                                            Attachments<AttachFile />
                                                        </Button>
                                                    </label>
                                                </Grid>
                                                <Grid item xs={12} md={9.5}>
                                                    {file?.map((obj, index) => (
                                                        <Grid display={'flex'} justifyContent={'space-between'} key={index} sx={{ pl: 1, mt: 0.5 }} item xs={12}>
                                                            <a style={{ color: 'grey', fontSize: '14px' }}>{obj?.name}</a>
                                                            <a style={{ cursor: 'pointer' }} onClick={() => handleDeleteAttachment(index)}>
                                                                <Delete fontSize='small' style={{ color: 'grey' }} />
                                                            </a>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Grid> */}

                                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                                <Grid item xs={12} md={2}>
                                                    <Typography sx={{ fontWeight: '500' }}>Approved</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={10}>
                                                    <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
                                                </Grid>
                                            </Grid>
                                        </>
                                }

                                <Grid pb={3} display={'flex'} >
                                    <LoadingButton className='save-btn' loading={loading} disabled={loading || dataLoading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>  {
                                        loading ?
                                            <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                            :
                                            <>
                                                Save  <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                    <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </>
                                    }</LoadingButton>
                                    <Button className='cancel-btn' onClick={handleClose} size='small' sx={{ textTransform: 'none', mr: 2 }} variant='outlined'>Cancel <svg svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg></Button>
                                </Grid>

                                {/* <Grid p={1} pb={3} display={'flex'} justifyContent={'end'}>
                                    <Button onClick={handleClose} size='small' sx={{ textTransform: 'none', mr: 2 }} variant='outlined'>Cancel</Button>
                                    <LoadingButton loading={loading} disabled={loading || dataLoading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>Save</LoadingButton>
                                </Grid> */}

                            </form>
                        </div>
                    </Grid>
                </div>
            </Drawer>
        </div>
    );
}
