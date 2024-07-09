import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, Tooltip, } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import { LeadApi } from '@/data/Endpoints/Lead';
import Doc from '@/img/doc.png';
import Image from 'next/image';
import { Delete } from '@mui/icons-material';








const scheme = yup.object().shape({

    // default_cc: yup.array().required("Mail CC is Required"),
    // dob: yup.string().required("Date Of Birth is Required"),
    // zip: yup.string().required("Zip Code is Required"),
    // country: yup.object().required("Please Choose a Country").typeError("Please choose a Country"),
    // state: yup.string().required("State is Required"),
})

export default function BulkUpload({ editId, setEditId }) {

    const [state, setState] = React.useState({
        right: false,
    });
    const [open, setOpen] = useState(false)


    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)


    const [attachmentFiles, setattachmentFiles] = useState([])




    const [file, setFile] = useState([])



    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }

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



    const onSubmit = async (data) => {

        setLoading(true)
        const formData = new FormData()

        formData.append('file', selectedFile)


        // console.log(dataToSubmit);

        let action;

        if (editId > 0) {
            // dataToSubmit['id'] = editId
            action = LeadApi.import(formData)
        } else {
            action = LeadApi.import(formData)
        }

        action.then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response?.data?.message)
                // setRefresh()
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
        setOpen(false)
        setSelectedFile(null)
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


    const [selectedFile, setSelectedFile] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(0);

    const handleFileChange = (event) => {
        setFileInputKey(prevKey => prevKey + 1);
        setSelectedFile(event.target.files[0]);
    };


    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setSelectedFile(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDeleteFile = () => {
        setSelectedFile(null); // Clear selected file
    };

    const downloadExcel = () => {
        const url = `${process.env.NEXT_PUBLIC_DOC_PATH}lead_upload.xlsx`;
        const link = document.createElement('a');
        link.href = url;
        link.download = 'lead_upload.xlsx'; // This attribute prompts the browser to download the file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    


    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
        } else if (editId == 0) {
            setOpen(true)
        }
    }, [editId])


    return (
        <div>

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
                        <a className='back_modal_head'> Import Leads </a>




                    </Grid>
                    <div className='form-data-cntr'>
                        <Button onClick={downloadExcel} variant='outlined' style={{ textTransform: 'none' }} >Download Excel File</Button>

                        <form onSubmit={handleSubmit(onSubmit)}>


                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >



                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                    key={fileInputKey}
                                />
                                <label htmlFor="file-upload" style={{ cursor: 'pointer' }} className='add-document-block'>
                                    <Image src={Doc} alt='Doc' width={200} height={200} />

                                    <h3>Browse<span>Document</span> or Drag and Drop</h3>
                                </label>



                                {(selectedFile) && (
                                    <Grid display={'flex'} justifyContent={'space-between'} className="mt-4">
                                        <Grid mr={1}>
                                            {
                                                selectedFile &&
                                                <Tooltip title={selectedFile?.name}>
                                                    <p className="text-gray-700">
                                                        {
                                                            selectedFile?.name?.length > 60
                                                                ? selectedFile?.name?.slice(0, 60) + '....'
                                                                : selectedFile?.name
                                                        }
                                                    </p>
                                                </Tooltip>
                                            }

                                        </Grid>
                                        {
                                            selectedFile &&
                                            <Grid>
                                                <Delete sx={{ cursor: 'pointer' }} color='error' fontSize='small' onClick={handleDeleteFile} />
                                            </Grid>
                                        }
                                    </Grid>
                                )}
                            </div>

                            <Grid mt={2} pb={3} display={'flex'} >
                                <LoadingButton className='save-btn' loading={loading} disabled={loading || dataLoading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>
                                    {
                                        loading ?
                                            <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                            :
                                            <>
                                                Save  <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
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
