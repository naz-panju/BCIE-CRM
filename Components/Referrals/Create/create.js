import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { useEffect } from 'react';
import { Close, Delete, } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import TextInput from '@/Form/TextInput';
import { useState } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import dynamic from 'next/dynamic';
import AsyncSelect from "react-select/async";
import SelectX from '@/Form/SelectX';
import DateInput from '@/Form/DateInput';
import { ReferralApi } from '@/data/Endpoints/Referrals';
import Image from 'next/image';
import Doc from '@/img/doc.png';
const CKEditorBox = dynamic(() => import("../../../Components/Editor/Editor"), {
    ssr: false,
})



// import MyEditor from '@/Form/MyEditor';

const MyEditor = dynamic(() => import("../../../Form/MyEditor"), {
    ssr: false,
});

const scheme = yup.object().shape({
    country: yup.object().required('Country is Required'),
    source: yup.object().required("Lead Source is Required"),
})

export default function CreateReferral({ editId, setEditId, refresh, setRefresh, lead_id, handleRefresh }) {

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const [state, setState] = React.useState({
        right: false,
    });
    const [selectedPriority, setSelectedPriority] = useState('Medium');
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)

    const [attachment, setAttachment] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [details, setdetails] = useState()

    const handleFileUpload = (event) => {
        setFileInputKey(prevKey => prevKey + 1);
        const file = event.target.files[0];
        const maxSize = size
        if (file?.size > maxSize * 1024 * 1024) {
            toast.error(`File size exceeds ${maxSize}MB`)
        } else {
            setAttachment(event.target.files[0]);
        }

    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        const maxSize = size
        console.log(maxSize)
        if (file?.size > maxSize * 1024 * 1024) {
            toast.error(`File size exceeds ${maxSize}MB`)
        } else {
            setAttachment(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDelete = () => {
        setAttachment(null); // Clear selected file
    };



    const fetchSources = (e) => {
        return ListingApi.leadSource({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }

    const fetchCountries = (e) => {
        return ListingApi.country({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }


    const fetchAgencies = (e) => {
        return ListingApi.agencies({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }

    const fetchUniversities = (e) => {
        return ListingApi.universities({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }

    const fetchEvents = (e) => {
        return ListingApi.events({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }

    const fetchStudents = (e) => {
        return ListingApi.students({ keyword: e }).then(response => {
            console.log(response?.data?.data);

            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data?.data
            } else {
                return [];
            }

        })
    }


    const handleSourseChange = (data) => {
        // trigger('source')
        setValue('source', data || '')
        setValue('agent', '')
        // setValue('agency', '')
    }


    const items = [
        { label: 'Template Name' },
        { label: 'Subject' },
        { label: 'Body Footer' },
        { label: 'Default CC' },
        { label: 'Body', multi: true },
        { label: 'Body', multi: true },
        { label: 'Body', multi: true },
        // { label: 'Description' },

    ]

    const anchor = 'right'; // Set anchor to 'right'



    const onSubmit = async (data) => {

        setLoading(true)

        let date;
        if (data?.validity_date) {
            date = moment(data?.validity_date).format('YYYY-MM-DD')
        }

        const formData = new FormData();

        formData.append('title', data?.title)
        if (data?.source?.id) {
            formData.append('lead_source_id', data?.source?.id)
        }

        formData.append('country_id', data?.country?.id)

        if (data?.source?.id == 6) {
            if (data?.agent?.id) {
                formData.append('agency_id', data?.agent?.id || null)
            }
        } else if (data?.source?.id == 5) {
            if (data?.student?.id) {
                formData.append('referred_student_id', data?.student?.id || null)
            }
        } else if (data?.source?.id == 7) {
            if (data?.student?.id) {
                formData.append('referral_university_id', data?.referred_university?.id || null)
            }
        } else if (data?.source?.id == 11) {
            if (data?.student?.id) {
                formData.append('event_id', data?.referred_event?.id || null)
            }
        }

        // formData.append('agency_id', data?.source?.id == 6 ? data?.agent?.id : null || null)

        // formData.append('referred_student_id', data?.source?.id == 5 ? data?.student?.id : null || null)

        // formData.append('referral_university_id', data?.source?.id == 7 ? data?.referred_university?.id : null || null)

        // if (data?.events) {
        //     formData.append('events_id', data?.events?.id)
        // }
        if (data?.validity_date) {
            formData.append('last_date_of_validity', date)
        }
        formData.append('top_description', data?.top_description || '')
        formData.append('bottom_description', data?.bottom_description || '')
        formData.append('private_remarks', data?.private_remarks || '')

        if (attachment) {
            formData.append('image', attachment)
        }

        // for (var pair of formData.entries()) {
        //     console.log(pair[0] + ': ' + pair[1]); // Iterate through form data and log key-value pairs
        // }

        let action;

        if (editId > 0) {
            formData.append('id', editId)
            action = ReferralApi.update(formData)
        } else {
            action = ReferralApi.add(formData)
        }

        action.then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(editId > 0 ? 'Referral Link Has Been Successfully Updated' : 'Referral Link Has Been Successfully Created')
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
        setValue('title', '')
        setValue('country', '')
        setAttachment(null)
        setValue('validity_date', '')
        setOpen(false)
        setdetails()
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


    const getDetails = async () => {
        setDataLoading(true)
        try {
            const response = await ReferralApi.view({ id: editId })
            if (response?.data?.data) {
                let data = response?.data?.data
                // console.log(data);

                setValue('title', data?.title)
                setValue('source', data?.lead_source)
                setValue('country', data?.country)
                setValue('validity_date', data?.last_date_of_validity)
                setValue('agent', data?.agency)
                setValue('referred_event', data?.event)
                // setValue('student', data?.referredStudent)
                // setValue('referred_university', data?.referred_university)
                setValue('top_description', data?.top_description)
                setValue('bottom_description', data?.bottom_description)
                setValue('private_remarks', data?.private_remarks)
                setdetails(data)
                setDataLoading(false)
            }
            setDataLoading(false)
        } catch (error) {
            setDataLoading(false)
        }
    }


    const handleClick = () => {
        // This will trigger a click event on the input element, opening the file dialog
        document.getElementById('upload-button').click();
    };

    const getOptionLabel = (option) => {
        return option.student_code ? `${option.name} (${option.student_code})` : option.name;
    };



    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            getDetails()
        } else if (editId == 0) {
            setOpen(true)
        }
    }, [editId])

    const [size, setsize] = useState()
    useEffect(() => {
        const session = sessionStorage.getItem('size')
        if (session) {
            setsize(session)
        }
    }, [])

    return (
        open &&
        <div>

            {/* <Drawer
                anchor={anchor}
                open={open}
                onClose={handleClose}
            > */}
            <Grid style={{ position: 'fixed', top: 0, right: 0, height: '100%', width: 750, background: 'white', zIndex: 100, borderLeft: '0.5px solid' }} display={'flex'}>
                <Grid width={750} >
                    <Grid className='modal_title d-flex align-items-center'>

                        <a className='back_modal' onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>

                        <a className='back_modal_head'> {editId > 0 ? "Edit Referral Link" : 'Create Referral Link'} </a>

                    </Grid>
                    <div style={{ overflow: 'auto', height: 'calc(100% - 77px)' }} className='form-data-cntr'>

                        <form onSubmit={handleSubmit(onSubmit)}>


                            {
                                dataLoading ?
                                    <LoadingEdit item={items} />
                                    :
                                    <>


                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Title</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <TextInput control={control} name="title"
                                                        value={watch('title')} />
                                                    {errors.title && <span className='form-validation'>{errors.title.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Country</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <SelectX
                                                        // placeholder='Select...'
                                                        menuPlacement='auto'
                                                        loadOptions={fetchCountries}
                                                        control={control}
                                                        name={'country'}
                                                        defaultValue={watch('country')}
                                                    />
                                                    {errors?.country && <span className='form-validation'>{errors?.country.message}</span>}
                                                </Grid>
                                            </div>
                                            <div className='application-input'>
                                                <a className='form-text'>Lead Source</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <SelectX
                                                        // placeholder='Select...'
                                                        menuPlacement='auto'
                                                        loadOptions={fetchSources}
                                                        control={control}
                                                        name={'source'}
                                                        defaultValue={watch('source')}
                                                    />
                                                    {errors?.source && <span className='form-validation'>{errors?.source.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>

                                        {/* <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                                <div className='application-input'>
                                                    <a className='form-text'>Lead Source</a>
                                                    <Grid className='mb-5 forms-data' >
                                                    <SelectX
                                                            // placeholder='Select...'
                                                            menuPlacement='auto'
                                                            loadOptions={fetchSources}
                                                            control={control}
                                                            name={'source'}
                                                            defaultValue={watch('source')}
                                                        />
                                                        {errors?.source && <span className='form-validation'>{errors?.source.message}</span>}
                                                    </Grid>
                                                </div>
                                            </div> */}



                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Last date of Validity</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <DateInput
                                                        control={control}
                                                        name="validity_date"
                                                        value={watch('validity_date')}
                                                    // placeholder='Due Date'
                                                    />
                                                    {errors.validity_date && <span className='form-validation'>{errors.validity_date.message}</span>}
                                                </Grid>
                                            </div>

                                            {
                                                watch('source')?.id == 6 &&
                                                <div className='application-input'>
                                                    <a className='form-text'>Referred Agency</a>
                                                    <Grid className='mb-5 forms-data' >
                                                        <SelectX
                                                            // placeholder='Select...'
                                                            menuPlacement='auto'
                                                            loadOptions={fetchAgencies}
                                                            control={control}
                                                            name={'agent'}
                                                            defaultValue={watch('agent')}
                                                        />
                                                    </Grid>
                                                </div>
                                            }



                                            {
                                                watch('source')?.id == 5 &&
                                                <div className='application-input'>
                                                    <a className='form-text'>Referred Student</a>
                                                    <Grid className='mb-5 forms-data' >
                                                        <AsyncSelect
                                                            placeholder=''
                                                            name={'student'}
                                                            defaultValue={watch('student')}
                                                            isClearable
                                                            defaultOptions
                                                            loadOptions={fetchStudents}
                                                            getOptionLabel={getOptionLabel}
                                                            getOptionValue={(e) => e.id}
                                                            onChange={(e) => setValue('student', e)}
                                                        />
                                                    </Grid>
                                                </div>
                                            }

                                            {
                                                watch('source')?.id == 7 &&
                                                <div className='application-input'>
                                                    <a className='form-text'>Referred University</a>
                                                    <Grid className='mb-5 forms-data' >
                                                        <SelectX
                                                            placeholder=''
                                                            menuPlacement='top'
                                                            loadOptions={fetchUniversities}
                                                            control={control}
                                                            name={'referred_university'}
                                                            defaultValue={watch('referred_university')}
                                                        />
                                                    </Grid>
                                                </div>
                                            }

                                            {
                                                watch('source')?.id == 11 &&
                                                <div className='application-input'>
                                                    <a className='form-text'>Events</a>
                                                    <Grid className='mb-5 forms-data' >
                                                        <SelectX
                                                            placeholder=''
                                                            menuPlacement='top'
                                                            loadOptions={fetchEvents}
                                                            control={control}
                                                            name={'referred_event'}
                                                            defaultValue={watch('referred_event')}
                                                        />
                                                    </Grid>
                                                </div>

                                            }
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Top Description <span className='text-[12px] text-gray-500 ml-2'>(Preferred Image Size 600 X 151)</span></a>
                                                <Grid className='mb-5 forms-data' >

                                                    <CKEditorBox emoji={false} val={watch('top_description')}
                                                        onValueChange={e => setValue('top_description', e)}
                                                    />
                                                    {/* <TextField
                                                            {...register('top_description')}
                                                            variant="outlined"
                                                            fullWidth
                                                            multiline
                                                            rows={4}
                                                            sx={{ width: '100%', }}
                                                        /> */}
                                                    {errors.top_description && <span className='form-validation'>{errors.top_description.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Bottom Description</a>
                                                <Grid className='mb-5 forms-data'>
                                                    <CKEditorBox emoji={false} val={watch('bottom_description')}
                                                        onValueChange={e => setValue('bottom_description', e)}
                                                    />
                                                    {/* <TextField
                                                            {...register('bottom_description')}
                                                            variant="outlined"
                                                            fullWidth
                                                            multiline
                                                            rows={4}
                                                            sx={{ width: '100%', }}
                                                        /> */}
                                                    {errors.bottom_description && <span className='form-validation'>{errors.bottom_description.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Private Remarks</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <TextField
                                                        {...register('private_remarks')}
                                                        variant="outlined"
                                                        fullWidth
                                                        multiline
                                                        rows={4}
                                                        sx={{ width: '100%', }}
                                                    />
                                                    {errors.private_remarks && <span className='form-validation'>{errors.private_remarks.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>



                                        <div onDrop={handleDrop}
                                            onDragOver={handleDragOver} >
                                            <input
                                                type="file"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                id="file-upload"
                                                key={fileInputKey}
                                            />
                                            <label htmlFor="file-upload" style={{ cursor: 'pointer' }} className='add-document-block'>
                                                <Image src={Doc} alt='Doc' width={200} height={200} />

                                                <h3><span>Select File</span>  or Drag and Drop Here</h3>
                                                <h4>Max {size} MB files are allowed</h4>
                                                <h4>Preferred size 660x350</h4>
                                                {/* <span className='text-gray-500 text[10px]'>preferred size 660x125</span> */}


                                            </label>



                                            {
                                                (attachment || details?.banner_image) &&
                                                <Grid display={'flex'} justifyContent={'space-between'} item pr={1} xs={8} md={8}>

                                                    {
                                                        attachment &&
                                                            attachment?.name?.length > 30 ?
                                                            <Tooltip title={attachment?.name}>
                                                                <p>{attachment?.name?.substring(0, 30) + '...'}</p>
                                                            </Tooltip>
                                                            :
                                                            <p>{attachment?.name}</p>
                                                    }
                                                    {
                                                        !attachment &&
                                                        <Tooltip title={details?.banner_image}>
                                                            <p className="text-gray-700 text-start">
                                                                {trimUrlAndNumbers(details?.banner_image)}
                                                            </p>
                                                        </Tooltip>
                                                    }
                                                    {
                                                        attachment &&
                                                        <Delete onClick={handleDelete} fontSize='small' sx={{ color: 'red', cursor: 'pointer' }} />
                                                    }
                                                </Grid>
                                            }
                                        </div>
                                    </>
                            }

                            <Grid pt={3} pb={3}  >
                                <LoadingButton className='save-btn' loading={loading} disabled={loading || dataLoading} type='submit'  >
                                    {
                                        loading ?
                                            <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                            :
                                            <>
                                                Submit <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                    <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </>
                                    }
                                </LoadingButton>
                                <Button className='cancel-btn' onClick={handleClose}>Cancel <svg svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
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
            </Grid>
            {/* </Drawer> */}
        </div >
    );
}
