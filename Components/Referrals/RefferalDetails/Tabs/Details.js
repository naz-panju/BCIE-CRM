import { Check, Link } from '@mui/icons-material';
import { Divider, Grid, Skeleton, Typography } from '@mui/material';
import moment from 'moment';
import Image from 'next/image';
import React, { useState } from 'react'


function Details({ data, loading }) {

    console.log(data);

    const [copied, setcopied] = useState(false)


    const myLoader = ({ src, width }) => {
        return `${src}?w=${width}`;
    }

    const currentURL = window?.location?.origin;


    const handleCopy = async () => {
        setcopied(true)
        await navigator.clipboard.writeText(`${currentURL}/forms/event/${data?.token}`);
        setTimeout(() => {
            setcopied(false)
        }, 1000);
    }


    return (
        loading ?
            // for loading
            loadingDetail()
            :
            <Grid p={3}>
                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Title:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.title}
                        </Typography>
                    </Grid>
                </Grid >
                <Divider sx={{ mb: 1 }} />

                <Grid container style={{ marginBottom: '10px' }}>
                    <Grid item xs={6} sm={6}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Lead Source:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.lead_source?.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Last Date of Validity:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {
                                data?.created_at &&
                                moment(data?.last_date_of_validity).format("DD-MM-YYYY")
                            }
                        </Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ mb: 1 }} />

                {
                    data?.lead_source?.name == 'Agency' || data?.lead_source?.name == 'Event' &&
                    <>
                        <Grid container style={{ marginBottom: '10px' }}>
                            {
                                data?.lead_source?.name == 'Agency' &&
                                <Grid item xs={6} sm={6}>
                                    <Typography variant="" style={{ fontWeight: 'bold' }}>
                                        Agency:
                                    </Typography>
                                    <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                        {data?.agency?.name}
                                    </Typography>
                                </Grid>
                            }
                            {
                                data?.lead_source?.name == 'Event' &&
                                <Grid item xs={6} sm={6}>
                                    <Typography variant="" style={{ fontWeight: 'bold' }}>
                                        Event:
                                    </Typography>
                                    <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                        {data?.event?.name}
                                    </Typography>
                                </Grid>
                            }
                        </Grid>
                        <Divider sx={{ mb: 1 }} />
                    </>
                }


                {
                    data?.banner_image &&
                    <>
                        <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="" style={{ fontWeight: 'bold' }}>
                                    Banner Image:
                                </Typography>
                                <Image loader={myLoader} src={data?.banner_image || ''} width={250} height={250} />
                                {/* <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                    {data?.top_description}
                                </Typography> */}
                            </Grid>
                        </Grid >
                        <Divider sx={{ mb: 1 }} />
                    </>
                }

                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Top Description:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.top_description}
                        </Typography>
                    </Grid>
                </Grid >
                <Divider sx={{ mb: 1 }} />

                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Bootom Description:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.bottom_description}
                        </Typography>
                    </Grid>
                </Grid >
                <Divider sx={{ mb: 1 }} />

                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Private Remarks:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.private_remarks}
                        </Typography>
                    </Grid>
                </Grid >
                <Divider sx={{ mb: 1 }} />

                <Grid container style={{ marginBottom: '10px' }}>
                    <Grid item xs={6} sm={6}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Created By:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.created_by?.name}
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
                            Referral Link:
                        </Typography>
                        <Grid item width={50} xs={12} sm={12} md={12}>
                            <a href={`${currentURL}/forms/lead/${data?.token}`} target='_blank' style={{ fontSize: '16px', color: 'blue' }}>
                                {`${currentURL}/forms/lead/${data?.token}`}
                            </a>
                        </Grid>
                        <Grid display={'flex'} alignItems={'center'} justifyContent={'end'} item xs={12} sm={12} md={12}>
                            {/* <IconButton> */}
                            {
                                copied ?
                                    <a style={{ fontSize: '13px', marginRight: 5, cursor: 'pointer' }} onClick={handleCopy}>
                                        copied <Check fontSize='small' />
                                    </a> :
                                    <a style={{ fontSize: '13px', marginRight: 5, cursor: 'pointer' }} onClick={handleCopy}>
                                        copy <Link fontSize='small' />
                                    </a>
                            }
                        </Grid>
                    </Grid>
                </Grid >
                <Divider sx={{ mb: 1 }} />

            </Grid>
    )
}

export default Details

const loadingDetail = () => (
    <Grid p={3}>
        <Grid container spacing={2} style={{ marginBottom: '10px' }}>
            <Grid item xs={12} sm={12}>
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
        <Grid container spacing={2} style={{ marginBottom: '10px' }}>
            <Grid item xs={12} sm={12}>
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

        <Grid item xs={12} sm={12}>
            <Skeleton variant="rounded" width={100} height={20} />
            <Skeleton sx={{ mt: 1 }} variant="rounded" width={200} height={20} />
        </Grid>
        <Divider sx={{ mb: 1 }} />

    </Grid>
)
