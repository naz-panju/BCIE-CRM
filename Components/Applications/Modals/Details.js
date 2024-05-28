import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Divider, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Delete, Refresh } from '@mui/icons-material';
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import toast from 'react-hot-toast';
import ReactSelector from 'react-select';
import { ApplicationStagesApi } from '@/data/Endpoints/ApplicationStages';
import TextInput from '@/Form/TextInput';
import { ApplicationApi } from '@/data/Endpoints/Application';
import moment from 'moment';



const scheme = yup.object().shape({
    // first_name: yup.string().required("First Name is Required"),
    // email: yup.string().required("Email is Required"),
    // phone: yup.string().required("Phone Number is Required"),
    // dob: yup.string().required("Date Of Birth is Required"),
    // zip: yup.string().required("Zip Code is Required"),
    // country: yup.object().required("Please Choose a Country").typeError("Please choose a Country"),
    // state: yup.string().required("State is Required"),
})

export default function ApplicationDetail({ id, setId }) {

    const [state, setState] = React.useState({
        right: false,
    });
    const [open, setOpen] = useState(false)

    const [data, setdata] = useState()

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)

    const anchor = 'right'; // Set anchor to 'right'

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })


    const handleDrawerClose = (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        // Check if the close icon was clicked
        if (event.target.tagName === 'svg') {
            handleClose()
        }
    };

    const handleClose=()=>{
        setOpen(false);
        setId()
    }

    const getDetails = () => {
        setLoading(true)
        ApplicationApi.view({ id: id }).then((response) => {
            setdata(response?.data?.data)
            setLoading(false)
        })
        setLoading(false)
    }


    useEffect(() => {
        if (id > 0) {
            setOpen(true)
            getDetails()
        } else if (id == 0) {
            setOpen(true)
        }
    }, [id])

    return (
        <div>
            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleClose}
            >
                <Grid width={550}>
                    <Grid p={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>Application Detail</a>
                        <IconButton
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                    <hr />
                    {
                        loading ?
                            // for loading
                            <Grid p={3}>
                                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12} sm={12}>
                                        <Skeleton variant="rounded" width={100} height={20} />
                                        <Skeleton sx={{ mt: 1 }} variant="rounded" width={200} height={20} />
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />

                                <Grid container style={{ marginBottom: '10px' }}>
                                    <Grid item xs={6} sm={6}>
                                        <Skeleton variant="rounded" width={100} height={20} />
                                        <Skeleton sx={{ mt: 1 }} variant="rounded" width={200} height={20} />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <Skeleton variant="rounded" width={100} height={20} />
                                        <Skeleton sx={{ mt: 1 }} variant="rounded" width={200} height={20} />
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />

                                <Grid container style={{ marginBottom: '10px' }}>
                                    <Grid item xs={6} sm={6}>
                                        <Skeleton variant="rounded" width={100} height={20} />
                                        <Skeleton sx={{ mt: 1 }} variant="rounded" width={200} height={20} />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <Skeleton variant="rounded" width={100} height={20} />
                                        <Skeleton sx={{ mt: 1 }} variant="rounded" width={200} height={20} />
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />

                                <Grid container style={{ marginBottom: '10px' }}>
                                    <Grid item xs={6} sm={6}>
                                        <Skeleton variant="rounded" width={100} height={20} />
                                        <Skeleton sx={{ mt: 1 }} variant="rounded" width={200} height={20} />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <Skeleton variant="rounded" width={100} height={20} />
                                        <Skeleton sx={{ mt: 1 }} variant="rounded" width={200} height={20} />
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />

                                <Grid container style={{ marginBottom: '10px' }}>
                                    <Grid item xs={6} sm={6}>
                                        <Skeleton variant="rounded" width={100} height={20} />
                                        <Skeleton sx={{ mt: 1 }} variant="rounded" width={200} height={20} />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <Skeleton variant="rounded" width={100} height={20} />
                                        <Skeleton sx={{ mt: 1 }} variant="rounded" width={200} height={20} />
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />

                                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12} sm={12}>
                                        <Skeleton variant="rounded" width={100} height={20} />
                                        <Skeleton sx={{ mt: 1 }} variant="rounded" width={200} height={20} />
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />
                            </Grid>
                            :
                            <Grid p={3}>
                                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                                            Lead:
                                        </Typography>
                                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                            {data?.lead?.title} {data?.lead?.name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />

                                <Grid container style={{ marginBottom: '10px' }}>
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                                            Lead:
                                        </Typography>
                                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                            {data?.lead?.name || "Null"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                                            Reviewer:
                                        </Typography>
                                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                            {data?.reviewer?.name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />

                                <Grid container style={{ marginBottom: '10px' }}>
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                                            Assigned To:
                                        </Typography>
                                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                            {data?.assignedToUser?.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                                            Assigned By:
                                        </Typography>
                                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                            {data?.assignedByUser?.name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />

                                <Grid container style={{ marginBottom: '10px' }}>
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                                            Priority:
                                        </Typography>
                                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                            {data?.priority}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                                            Status:
                                        </Typography>
                                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                            {data?.status}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />

                                <Grid container style={{ marginBottom: '10px' }}>
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                                            Due Date:
                                        </Typography>
                                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                            {
                                                data?.due_date &&
                                                moment(data?.due_date).format("DD-MM-YYYY")
                                            }
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                                            Created At:
                                        </Typography>
                                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                            {
                                                data?.created_at &&
                                                moment(data?.created_at).format("DD-MM-YYYY")
                                            }
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />

                                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                                            Description:
                                        </Typography>
                                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                            {data?.description}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />
                            </Grid>
                    }
                </Grid>
            </Drawer>
        </div >
    );
}
