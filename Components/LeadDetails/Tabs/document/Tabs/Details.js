import { Check, Link } from '@mui/icons-material';
import { Divider, Grid, Skeleton, Typography } from '@mui/material';
import moment from 'moment';
import Image from 'next/image';
import React, { useState } from 'react'


function Details({ data, loading }) {

    // console.log(data);

    const [copied, setcopied] = useState(false)


    const myLoader = ({ src, width }) => {
        return `${src}?w=${width}`;
    }

    const currentURL = window?.location?.origin;

    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }

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
                            Document Template:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.document_template?.name}
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

                <Grid container style={{ marginBottom: '10px' }}>
                    {
                        data?.uploaded_by?.name &&
                        <Grid item xs={6} sm={6}>
                            <Typography variant="" style={{ fontWeight: 'bold' }}>
                                Uploaded By:
                            </Typography>
                            <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                {data?.uploaded_by?.name}
                            </Typography>
                        </Grid>
                    }
                    <Grid item xs={6} sm={6}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Uploaded At:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {
                                data?.created_at &&
                                moment(data?.uploaded_at).format("DD-MM-YYYY")
                            }
                        </Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ mb: 1 }} />

                {
                    data?.note &&
                    <>
                        <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="" style={{ fontWeight: 'bold' }}>
                                    Remarks:
                                </Typography>
                                <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                                    {data?.note}
                                </Typography>
                            </Grid>
                        </Grid >
                        <Divider sx={{ mb: 1 }} />
                    </>
                }

                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            File:
                        </Typography>
                        <Grid item xs={12} sm={12} md={12}>
                            <a href={data?.file} target='_blank' style={{ fontSize: '16px', color: 'blue' }}>
                                {trimUrlAndNumbers(data?.file)}
                            </a>
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

        <Grid item xs={12} sm={12}>
            <Skeleton variant="rounded" width={100} height={20} />
            <Skeleton sx={{ mt: 1 }} variant="rounded" width={200} height={20} />
        </Grid>
        <Divider sx={{ mb: 1 }} />

    </Grid>
)
