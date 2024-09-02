import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Avatar, Box, Button, CircularProgress, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Attachment, Close, Description, Refresh, Send } from '@mui/icons-material';
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
import { CommunicationLogApi } from '@/data/Endpoints/CommunicationLog';
import WhatsappBG from '@/img/WhatsappBG.png';
import Doc from '@/img/AllDoc.png';
import DocumentSelectModal from '../../application/modals/documentSelect';
import Pusher from "pusher-js";
import { useSession } from 'next-auth/react';
import { useBoolean } from '@/Context/MessageModalContext';



const scheme = yup.object().shape({
    // summary: yup.string().required("Call Summary is Required"),
    // date_and_time: yup.string().required("Date and Time is Required"),
})

export default function WhatsappMessageModal({ lead_id, editId, setEditId, handleRefresh, leadData }) {

    const { isTrue, toggleBoolean } = useBoolean();

    const session = useSession()

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

    const [messaging, setmessaging] = useState(false)
    const onSubmit = async (data) => {

        setmessaging(true)

        const formData = new FormData()

        formData.append('id', editId)
        formData.append('message', data?.message || 'Document Send')

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // console.log(dataToSubmit);

        WhatsAppTemplateApi.reply(formData).then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                getDetails()
                setValue('message', '')
                setmessaging(false)
                setattachmentFiles([])
                setFile([])

                // reset()
                // handleClose()
                // setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)

                setmessaging(false)
            }

            // setLoading(false)
        }).catch((error) => {
            toast.error(error?.message)
            setmessaging(false)
        })
    }

    const onDocSubmit = async (data, callBack, docsSelected, docFiles, setDocLoadind) => {

        setmessaging(true)

        const formData = new FormData()

        formData.append('id', editId)
        formData.append('message', data?.message || 'Document Send')

        if (docsSelected?.length > 0) {
            docsSelected?.map(obj => {
                // console.log(obj?.file_path);
                formData.append('attachment_files[]', obj?.file_path)
            })
        }

        if (docFiles?.length > 0) {
            docFiles?.map(obj => {
                formData.append('attachments[]', obj)
            })
        }

        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }


        // console.log(dataToSubmit);

        WhatsAppTemplateApi.reply(formData).then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                getDetails()
                setValue('message', '')
                setmessaging(false)
                setattachmentFiles([])
                setFile([])
                if (callBack) {
                    callBack()
                }
                // reset()
                // handleClose()
                // setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
                if (setDocLoadind) {
                    setDocLoadind(false)
                }
                setmessaging(false)
            }

            // setLoading(false)
        }).catch((error) => {
            toast.error(error?.message)
            setmessaging(false)
            if (setDocLoadind) {
                setDocLoadind(false)
            }
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


    const [startingLoading, setstartingLoading] = useState(true)
    const [detailKey, setdetailKey] = useState(1)
    const getDetails = async (first) => {
        if (first) {
            setDataLoading(true)
        }
        const response = await CommunicationLogApi.view({ id: editId })
        if (response?.status == 200 || response?.status == 201) {
            let data = response?.data?.data
            setMessages(data)
            setdetailKey(detailKey + 1)

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


    const [docOpenId, setdocOpenId] = useState()
    const handleDocumentSelectOpen = () => {
        setdocOpenId(leadData?.id)
    }

    const [attachmentFiles, setattachmentFiles] = useState([])
    const [file, setFile] = useState([])

    useEffect(() => {

        const pusher = new Pusher("eec1f38e41cbf8c3acc7", {
            cluster: "ap2",
            //   encrypted: true,
        });
        const channel = pusher.subscribe("bcie-channel");
        channel.bind("bcie-event", (data) => {
            if (data?.lead_id) {
                if (data?.lead_id == leadData?.id) {
                    getDetails()
                }
            }

        });
        return () => {
            pusher.unsubscribe("bcie-event");
            pusher.disconnect();
        };
    }, [editId]);

 


    const inputRender = () => (
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 'auto', padding: '10px', borderTop: '1px solid #ddd', backgroundColor: '#f1f2f6' }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={0.8}>
                    <Description onClick={handleDocumentSelectOpen} className='text-sky-700 hover:text-sky-800 cursor-pointer' />
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        disabled={messaging || dataLoading}
                        {...register('message')}
                        variant="outlined"
                        fullWidth
                        placeholder="Type your message..."
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '5px',
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

                        disabled={messaging || !watch('message')}
                    >
                        {messaging ? (
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '3px solid green',
                                    borderTop: '3px solid transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}
                            />
                        ) : (
                            <Send style={{ color: 'green' }} />
                        )}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )

    const messageShow = (child, key,) => (
        <React.Fragment key={key}>
            {
                child?.mime_type?.includes('image') &&
                <Image alt='img' style={{ cursor: 'pointer' }} onClick={() => handleTabOpen(child?.file)} src={child?.file} width={150} height={350} />

            }
            {
                child?.mime_type?.includes("audio") &&
                <audio controls>
                    <source src={child?.file} type={child?.mime_type} />
                    Your browser does not support the audio element.
                </audio>
            }

            {
                (!child?.mime_type?.includes('image') && !child?.mime_type?.includes('audio')) &&
                <div className='flex justify-center items-center'>
                    <Image alt='img' loader={myLoader} style={{ cursor: 'pointer' }} onClick={() => handleTabOpen(child?.file)} src={Doc} width={100} height={100} />
                    <span style={{
                        color: 'grey',
                        fontSize: '12px',
                    }}> {trimUrlAndNumbers(child?.file)}</span>
                </div>
            }

        </React.Fragment>
    )

    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            getDetails(true)
        } else if (editId == 0) {
            setOpen(true)
        }
    }, [editId])


    useEffect(() => {
        if (open) {
            toggleBoolean(true)
        } else {
            toggleBoolean(false)
        }
    }, [open])

    return (
        <>
            <DocumentSelectModal from={'lead'} editId={docOpenId} setEditId={setdocOpenId} SelectedDocuments={attachmentFiles} setSelectedDocuments={setattachmentFiles} SelectedAttachments={file} setSelectedAttachments={setFile} sendMessage={onDocSubmit} />
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


                    <div style={{ height: 'calc(100% - 131px)', overflowY: 'auto', padding: '15px', backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column-reverse' }}>


                        {
                            dataLoading ?
                                loadingBox()
                                // <Box sx={{ display: 'flex',justifyContent:'center',alignItems:'center' }}>
                                //     <CircularProgress />
                                // </Box>
                                :
                                <React.Fragment key={Messages?.children}>
                                    {
                                        messaging &&
                                        <div className={`flex justify-end mb-4`}>
                                            {/* {obj?.type !== 'Whatsapp Send' && <Avatar className='mr-2'>OP</Avatar>} */}
                                            <div
                                                className={`flex flex-col max-w-xs px-4 py-2 rounded-lg bg-blue-500 text-white`}
                                                style={{
                                                    borderTopRightRadius: '0px',
                                                    borderTopLeftRadius: '15px',
                                                    backgroundColor: '#d8fdd2',
                                                    // borderBottomRightRadius: obj?.type === 'Whatsapp Send' ? '15px' : '0px',
                                                    // borderBottomLeftRadius: obj?.type === 'Whatsapp Send' ? '15px' : '0px',
                                                    padding: '10px',
                                                    // paddingBottom: '2px'
                                                }}
                                            >
                                                {
                                                    <span style={{
                                                        color: 'black',
                                                        fontSize: '14px',
                                                    }}> <Skeleton height={30} width={150} /></span>
                                                }
                                            </div>
                                        </div>
                                    }
                                    {Messages?.children?.slice()?.reverse()?.map((obj, index) => (
                                        <React.Fragment key={index}>

                                            <div className={`flex ${obj?.type === 'Whatsapp Send' ? 'justify-end' : 'justify-start'} mb-4`}>
                                                {/* {obj?.type !== 'Whatsapp Send' && <Avatar className='mr-2'>OP</Avatar>} */}
                                                <div
                                                    className={`flex flex-col max-w-xs px-4 py-2 rounded-lg ${obj?.type === 'Whatsapp Send' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                                                    style={{
                                                        borderTopRightRadius: obj?.type === 'Whatsapp Send' ? '0px' : '15px',
                                                        borderTopLeftRadius: obj?.type === 'Whatsapp Send' ? '15px' : '0px',
                                                        backgroundColor: obj?.type === 'Whatsapp Send' ? '#d8fdd2' : 'white',
                                                        // borderBottomRightRadius: obj?.type === 'Whatsapp Send' ? '15px' : '0px',
                                                        // borderBottomLeftRadius: obj?.type === 'Whatsapp Send' ? '15px' : '0px',
                                                        padding: '10px',
                                                        paddingBottom: '2px'
                                                    }}
                                                >

                                                    {
                                                        obj?.media?.length > 0 ?
                                                            obj?.media?.map((child, childIndex) => (
                                                                messageShow(child, childIndex)
                                                            ))
                                                            :
                                                            obj?.body == 'Video received' ?
                                                                <>
                                                                    {
                                                                        "❗" + obj?.body
                                                                    }
                                                                    <br />
                                                                    <span style={{ fontSize: '11px', color: 'grey' }}> We`&apos;`ve received the video message, but it’s not supported in our system. Please ask the student to use another method to send this message.</span>

                                                                </>
                                                                :
                                                                <span style={{
                                                                    color: 'black',
                                                                    fontSize: '14px',
                                                                }}> {obj?.body}</span>
                                                    }

                                                    <span className='text-end' style={{
                                                        fontSize: '10px',
                                                        color: 'gray',
                                                    }}>
                                                        {moment.utc(obj?.message_date).format('h:mm A')}
                                                    </span>
                                                </div>
                                            </div>


                                            {
                                                moment(obj?.message_date).format('DD-MM-YYYY') == moment(Messages?.message_date).format('DD-MM-YYYY') ? ""
                                                    :
                                                    moment(obj?.message_date).format('DD-MM-YYYY') != moment(Messages?.children[Messages?.children?.length - index - 2]?.message_date).format('DD-MM-YYYY') &&
                                                    <div className={`mb-3`} style={{
                                                        textAlign: 'center', margin: '15px 0', color: '#888', fontSize: '13px',
                                                    }}>
                                                        <span className='rounded-md' style={{ backgroundColor: 'white', width: 'auto', padding: 10 }}>
                                                            {
                                                                moment(obj?.message_date).isSame(moment(), 'day') ? 'TODAY' : moment(obj?.message_date).format('DD/MM/YYYY')
                                                            }
                                                        </span>
                                                    </div>
                                            }
                                        </React.Fragment>
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

                                                {
                                                    Messages?.media?.length > 0 ?
                                                        Messages?.media?.map((child, childIndex) => (
                                                            messageShow(child, childIndex)
                                                        ))
                                                        :

                                                        <>
                                                            {/* mos */}
                                                            <span style={{
                                                                color: 'black',
                                                                fontSize: '14px',
                                                            }}>
                                                                {Messages?.body}</span>
                                                            <br />
                                                            <div className='flex justify-end'>
                                                                <span className='text-end' style={{
                                                                    fontSize: '10px',
                                                                    color: 'gray',
                                                                }}>
                                                                    {moment.utc(Messages?.message_date).format('h:mm A')}
                                                                </span>
                                                            </div>
                                                        </>
                                                }

                                            </div>
                                        </div>

                                    }

                                    {
                                        Messages &&
                                        <div className='mb-3' style={{ textAlign: 'center', margin: '15px 0', color: '#888', fontSize: '13px', }}>
                                            <span className='rounded-md' style={{ backgroundColor: 'white', width: 'auto', padding: 10 }}>
                                                {
                                                    moment(Messages?.message_date).isSame(moment(), 'day') ? 'TODAY' : moment(Messages?.message_date).format('DD/MM/YYYY')
                                                }
                                            </span>
                                        </div>
                                    }
                                </React.Fragment>
                        }



                    </div>

                    {/* Input and Send Button */}

                    {
                        Messages?.children?.length > 0  ?

                            moment.utc(Messages?.children[Messages?.children?.length - 1]?.message_date).isBefore(moment.utc().subtract(24, 'hours')) || Messages?.communication_channel_status=="Close" ?

                                noInput(Messages?.communication_channel_status)
                                :
                                inputRender()
                            :
                            moment.utc(Messages?.message_date).isBefore(moment.utc().subtract(24, 'hours')) || Messages?.communication_channel_status=="Close" ?
                                noInput(Messages?.communication_channel_status)
                                :
                                inputRender()

                    }

                </div>
            </Drawer >
        </>
    );
}

const noInput = (channelStatus) => (
    <div style={{
        marginTop: 'auto',
        padding: '5px',
        borderTop: '1px solid #ccc',
        backgroundColor: '#f8f9fa',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '0 0 10px 10px'
    }}>
        <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
           {
                channelStatus=='Close'?
                "Communication Ended":
          
                ' Your 24-hour communication window has closed.'
            }
        </p>
        <p style={{ margin: '5px 0 0', fontSize: '14px' }}>
            To start a new conversation, please use the &quot;Send Whatsapp&quot; option.
        </p>
    </div>
)

const loadingBox = () => (
    [...Array(9)]?.map((_, index) => (
        <React.Fragment key={index}>

            <div className={`flex ${index % 2 == 0 ? 'justify-end' : 'justify-start'} mb-4`}>
                {/* {obj?.type !== 'Whatsapp Send' && <Avatar className='mr-2'>OP</Avatar>} */}
                <div
                    className={`flex flex-col max-w-xs px-4 py-2 rounded-lg ${index % 2 == 0 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                    style={{
                        borderTopRightRadius: index % 2 == 0 ? '0px' : '15px',
                        borderTopLeftRadius: index % 2 == 0 ? '15px' : '0px',
                        backgroundColor: index % 2 == 0 ? '#d8fdd2' : 'white',
                        // borderBottomRightRadius: obj?.type === 'Whatsapp Send' ? '15px' : '0px',
                        // borderBottomLeftRadius: obj?.type === 'Whatsapp Send' ? '15px' : '0px',
                        padding: '10px',
                        // paddingBottom: '2px'
                    }}
                >
                    {

                        <span style={{
                            color: 'black',
                            fontSize: '14px',
                        }}> <Skeleton height={30} width={150} /></span>
                    }


                </div>
            </div>


        </React.Fragment>
    ))
)
