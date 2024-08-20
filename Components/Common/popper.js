import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IconButton } from 'rsuite';
import { Close, DeleteOutline, Mail, NotificationsActiveOutlined } from '@mui/icons-material';
import { Badge, Grid } from '@mui/material';
import { red } from '@mui/material/colors';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { NotificationApi } from '@/data/Endpoints/Notification';
import { useEffect } from 'react';
import Pusher from "pusher-js";
import { useSession } from 'next-auth/react';

export default function SimplePopper() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const session = useSession()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // build

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [list, setlist] = useState([])
    const fetchList = () => {
        setloading(true)
        NotificationApi.list().then((response) => {
            if (response?.status == 200 || response?.status == 200) {
                setlist(response?.data)
                setloading(false)
                if (open == true) {
                    NotificationApi.read().then((Res) => {
                        setcount(0)
                        // console.log(Res);
                    })
                }
            }
        }).catch((error) => {
            setloading(false)
        })
    }

    const noFetchList = () => {
        NotificationApi.list().then((response) => {
            if (response?.status == 200 || response?.status == 200) {
                setlist(response?.data)
                if (open == true) {
                    NotificationApi.read().then((Res) => {
                        setcount(0)
                    })
                }
                setloading(false)
            }
        }).catch((error) => {

        })
    }



    const fetchCount = () => {
        NotificationApi.count().then((response) => {
            // console.log(response?.data?.data);
            if (open == false) {
                setcount(response?.data?.data)
            }
        })
    }

    const [deletingId, setDeletingId] = useState(null);
    const handleDelete = (id) => {
        setDeletingId(id);
        setTimeout(() => {
            const index = list?.data?.findIndex(obj => obj?.id === id);
            if (index !== -1) {
                const newList = {
                    ...list,
                    data: [
                        ...list.data.slice(0, index),
                        ...list.data.slice(index + 1)
                    ]
                };

                // console.log(newList);
                setlist(newList);
            }
        }, 500); // Wait for the fade-out transition to complete
        // Optionally make an API call to update the server-side data
        NotificationApi.delete({ id: id }).then((response) => {
            if (response?.status == 200 || response?.status == 201) {
                fetchList()
                // setlist(response?.data);
            } else {
                toast.error(response?.response?.data?.message || 'Invalid Request')
            }
        });
    };

    const [loading, setloading] = useState(false)
    const [count, setcount] = useState(0)
    useEffect(() => {

        const pusher = new Pusher("eec1f38e41cbf8c3acc7", {
            cluster: "ap2",
            //   encrypted: true,
        });
        const channel = pusher.subscribe("bcie-channel");
        channel.bind("bcie-event", (data) => {
            console.log(data);

            if (data?.user_id == session?.data?.user?.id) {
                if (open == true) {
                    noFetchList()
                } else if (open == false) {
                    fetchCount()
                    fetchList()
                }
            }

        });
        return () => {
            pusher.unsubscribe("bcie-channel");
            pusher.disconnect();
        };
    }, []);

    useEffect(() => {
        fetchList()
        if (open) {
            setcount(0)
        }
    }, [open])

    useEffect(() => {
        // console.log(open);
        if (open == false) {
            fetchCount()
        }
    }, [])

    return (
        <div>


            {/* {
                count > 0 ? */}
            <Badge style={{ marginTop: 10, marginRight: 10 }} badgeContent={count} color="secondary">
                <NotificationsActiveOutlined color="action" style={{ cursor: 'pointer' }} onClick={handleClick} />
            </Badge>
            {/* :
                    <NotificationsActiveOutlined color="action" style={{ cursor: 'pointer' }} onClick={handleClick} />
            } */}


            {/* <div className='flex items-center'>
                <NotificationsActiveOutlined style={{ cursor: 'pointer' }} aria-describedby={id} variant="contained" onClick={handleClick} />

            </div> */}

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <div style={{ maxHeight: '85vh', overflowY: 'auto', width: 500 }} className=''>

                    {
                        list?.data?.length > 0 ?
                            list?.data?.map((obj, index) => (

                                <Grid key={index} container className={`p-5 border border-3 fade ${deletingId === obj.id ? 'out' : ''}`}>
                                    <Grid item md={11} style={{ fontWeight: obj?.status == 'not read' ? 'bold' : '' }}> {obj?.description}</Grid>
                                    <Grid item md={1} className='flex justify-end '><DeleteOutline onClick={() => handleDelete(obj?.id)} sx={{ color: red[400], cursor: 'pointer' }} fontSize='small' /> </Grid>
                                </Grid>
                            ))
                            :
                            <Grid style={{ height: '400px' }} className=' flex items-center justify-center'>
                                No Notification Found
                            </Grid>
                    }


                </div>
            </Popover>
        </div>
    );
}