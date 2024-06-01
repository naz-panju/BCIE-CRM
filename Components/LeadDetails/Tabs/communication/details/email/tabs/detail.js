import { Check, Link } from '@mui/icons-material';
import { Divider, Grid, Skeleton, Typography } from '@mui/material';
import moment from 'moment';
import Image from 'next/image';
import React, { useState } from 'react'


function Details({ data, loading }) {


    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
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
                            Lead Name:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.lead?.name}
                        </Typography>
                    </Grid>
                </Grid >
                <Divider sx={{ mb: 1 }} />


                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Subject:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.subject}
                        </Typography>
                    </Grid>
                </Grid >
                <Divider sx={{ mb: 1 }} />

                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Body:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            <div dangerouslySetInnerHTML={{ __html: data?.body }} />
                            {/* {data?.body} */}
                        </Typography>
                    </Grid>
                </Grid >
                <Divider sx={{ mb: 1 }} />

                {/* <Grid container style={{ marginBottom: '10px' }}>
                    <Grid item xs={6} sm={6}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            From:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.from}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            To:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.to}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ mb: 1 }} /> */}



                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            CC:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.cc}
                        </Typography>
                    </Grid>
                </Grid >
                <Divider sx={{ mb: 1 }} />

                <Grid container style={{ marginBottom: '10px' }}>
                    <Grid item xs={6} sm={6}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Email Type:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.type}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Message Date:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {
                                data?.updated_at &&
                                moment(data?.message_date).format("DD-MM-YYYY HH:mm")
                            }
                        </Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ mb: 1 }} />



                {
                    data?.attachments?.length > 0 &&
                    <>
                        <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="" style={{ fontWeight: 'bold' }}>
                                    Attachments:
                                </Typography>
                                {
                                    data?.attachments?.map((obj, index) => (
                                        <Typography key={index} variant="body1" style={{ fontSize: '16px', color: 'blue' }}>
                                            <a href={obj?.attachment} target='_blank' style={{ cursor: 'pointer' }} > {trimUrlAndNumbers(obj?.attachment)}</a>
                                        </Typography>
                                    ))
                                }
                            </Grid>
                        </Grid >
                        <Divider sx={{ mb: 1 }} />
                    </>
                }

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
                                data?.updated_at &&
                                moment(data?.updated_at).format("DD-MM-YYYY")
                            }
                        </Typography>
                    </Grid>
                </Grid>
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
