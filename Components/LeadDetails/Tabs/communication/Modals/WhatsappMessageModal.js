import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Avatar, Button, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Refresh, Send } from '@mui/icons-material';
import DateInput from '@/Form/DateInput';

import { useState } from 'react';
import ReactSelector from 'react-select';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import moment from 'moment';
import { StudentApi } from '@/data/Endpoints/Student';
import toast from 'react-hot-toast';
import DateTime from '@/Form/DateTime';
import { PhoneCallApi } from '@/data/Endpoints/PhoneCall';
import Image from 'next/image';
import { WhatsAppTemplateApi } from '@/data/Endpoints/WhatsAppTemplate';
import WhatsappBg from '@/img/whatsapp-bg.png';
import { CommunicationLogApi } from '@/data/Endpoints/CommunicationLog';


const scheme = yup.object().shape({
    // summary: yup.string().required("Call Summary is Required"),
    // date_and_time: yup.string().required("Date and Time is Required"),
})

export default function WhatsappMessageModal({ lead_id, editId, setEditId, handleRefresh }) {

    const myLoader = ({ src, width }) => {
        return `${src}?w=${width}`;
    }

    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)

    const items = [
        { label: 'Title' },
        { label: 'Due Date' },
        { label: 'Description', multi: true },
    ]

    const anchor = 'right'; // Set anchor to 'right'

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const onSubmit = async (data) => {
        console.log(data);

        const formData = new FormData()

        formData.append('id', editId)
        formData.append('message', data?.message)

        // console.log(dataToSubmit);

        WhatsAppTemplateApi.reply(formData).then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                getDetails()
                setValue('message', '')
                // reset()
                // handleClose()
                // setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
                setLoading(false)
            }

            // setLoading(false)
        }).catch((error) => {
            console.log(error);
            toast.error(error?.message)
            setLoading(false)
        })
    }


    const handleClose = () => {
        setEditId()
        reset()
        setMessages()
        setValue('date_and_time', '')
        setValue('summary', '')
        setValue('type', '')
        setOpen(false)

    }

    const openTab = (url) => {
        window.open(url, '_blank');
    };

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

    const [Messages, setMessages] = useState()
    const getDetails = async () => {
        setDataLoading(true)
        const response = await CommunicationLogApi.view({ id: editId })
        if (response?.data?.data) {
            let data = response?.data?.data
            console.log(data);
            setMessages(data)

        }
        setDataLoading(false)
    }

    
    const handleTabOpen = (url) => {
        window.open(url, '_blank');
    }


    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        // trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }


    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            getDetails()
        } else if (editId == 0) {
            setOpen(true)
        }
    }, [editId])

    return (
        <Drawer
            anchor={anchor}
            open={open}
            onClose={handleClose}
        >
            <div style={{ width: 650, height: '100%' }}>
                {/* Header Section */}
                <Grid container alignItems="center" className='modal_title' style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
                    <Grid item>
                        <Button onClick={handleClose} className='back_modal' style={{ minWidth: 'auto' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </Grid>
                    <Grid item>
                        {/* <Avatar>MM</Avatar> */}
                        <span className='back_modal_head' style={{ fontWeight: 'bold', fontSize: '16px' }}>{Messages?.lead?.name}</span>
                    </Grid>
                </Grid>

                {/* Chat Messages */}

                <div style={{ height: '640px', overflowY: 'auto', padding: '15px', backgroundImage: `url(${"https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png"})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column-reverse' }}>


                    {Messages?.children?.slice()?.reverse()?.map((obj, index) => (
                        <div key={index} className={`flex ${obj?.type === 'Whatsapp Send' ? 'justify-end' : 'justify-start'} mb-4`}>
                            {/* {obj?.type !== 'Whatsapp Send' && <Avatar className='mr-2'>OP</Avatar>} */}
                            <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${obj?.type === 'Whatsapp Send' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                                style={{
                                    borderTopRightRadius: obj?.type === 'Whatsapp Send' ? '0px' : '15px',
                                    borderTopLeftRadius: obj?.type === 'Whatsapp Send' ? '15px' : '0px',
                                    backgroundColor: obj?.type === 'Whatsapp Send' ? '#d8fdd2' : 'white',
                                    // borderBottomRightRadius: obj?.type === 'Whatsapp Send' ? '15px' : '0px',
                                    // borderBottomLeftRadius: obj?.type === 'Whatsapp Send' ? '15px' : '0px',
                                    padding: '10px',
                                }}
                            >
                                {
                                    obj?.media?.mime_type?.includes('image') &&
                                    <Image alt='img' style={{ cursor: 'pointer' }} onClick={() => handleTabOpen(obj?.media?.file)} src={obj?.media?.file} width={150} height={350} />
                                }
                                {
                                    obj?.media?.mime_type?.includes("audio") &&
                                    <audio controls>
                                        <source src={obj?.media?.file} type={obj?.media?.mime_type} />
                                        Your browser does not support the audio element.
                                    </audio>
                                }
                                {
                                   !obj?.media || (!obj?.media?.mime_type?.includes('image') && !obj?.media?.mime_type?.includes('audio')) &&
                                    <>
                                        <Image alt='img' loader={myLoader} style={{ cursor: 'pointer' }} onClick={() => handleTabOpen(obj?.media?.file)} src={"https://e7.pngegg.com/pngimages/559/974/png-clipart-file-folders-computer-file-directory-computer-icons-filing-cabinet-angle-rectangle.png"} width={150} height={350} />
                                        <span style={{
                                            color: 'black',
                                            fontSize: '14px',
                                        }}> {trimUrlAndNumbers(obj?.media?.file)}</span>
                                    </>
                                }
                                {
                                    !obj?.media &&
                                    <span style={{
                                        color: 'black',
                                        fontSize: '14px',
                                    }}> {obj?.body}</span>
                                }
                            </div>
                        </div>
                    ))}

                    {
                        Messages &&
                        <div className={`flex ${Messages?.type === 'Whatsapp Send' ? 'justify-end' : 'justify-start'} mb-4`}>
                            {/* {obj?.type !== 'Whatsapp Send' && <Avatar className='mr-2'>OP</Avatar>} */}
                            <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${Messages?.type === 'Whatsapp Send' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                                style={{
                                    borderTopRightRadius: Messages?.type === 'Whatsapp Send' ? '0px' : '15px',
                                    borderTopLeftRadius: Messages?.type === 'Whatsapp Send' ? '15px' : '0px',
                                    backgroundColor: Messages?.type === 'Whatsapp Send' ? '#d8fdd2' : 'white',

                                    // borderBottomRightRadius: obj?.type === 'Whatsapp Send' ? '15px' : '0px',
                                    // borderBottomLeftRadius: obj?.type === 'Whatsapp Send' ? '15px' : '0px',
                                    padding: '10px',
                                }}
                            >
                                <span style={{
                                    color: 'black',
                                    fontSize: '14px',
                                }}> {Messages?.body}</span>
                            </div>
                        </div>

                    }

                    {
                        Messages &&
                        <div className='mb-3' style={{ textAlign: 'center', margin: '15px 0', color: '#888', fontSize: '13px', }}>
                            <span className='rounded-md' style={{ backgroundColor: 'white', width: 'auto', padding: 10 }}>
                                {
                                    moment(Messages?.created_at).isSame(moment(), 'day') ? 'TODAY' : moment(Messages?.created_at).format('DD/MM/YYYY')
                                }
                            </span>
                        </div>
                    }
                </div>

                {/* Input and Send Button */}
                <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 'auto', padding: '10px', borderTop: '1px solid #ddd', backgroundColor: '#f1f2f6' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={11}>
                            <TextField
                                {...register('message')}
                                variant="outlined"
                                fullWidth
                                placeholder="Type your message..."
                                sx={{
                                    backgroundColor: '#fff',
                                    borderRadius: '20px',
                                    border: '1px solid #ccc',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'transparent',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'transparent',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'transparent',
                                        },
                                    },
                                    '& .MuiInputBase-input': {
                                        fontSize: '14px',
                                        color: '#333',
                                        padding: '10px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Button
                                type='submit'
                                // onClick={onSubmit}
                                className='bg-green-500 hover:bg-green-600 text-white'
                                variant="contained"
                                style={{
                                    borderRadius: '50%',
                                    minWidth: 'auto',
                                    padding: '8px',
                                    height: '100%',
                                    backgroundColor: 'transparent'
                                }}
                            >
                                <Send style={{ color: 'green' }} />
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Drawer>
    );
}
