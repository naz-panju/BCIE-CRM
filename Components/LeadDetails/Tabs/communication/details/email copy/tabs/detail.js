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
            <div style={{ padding: '15px' }} className='lead-tabpanel-content-item'>
                <div className="grid grid-cols-1 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Call Summary:</label>
                        <span>{data?.call_summary}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Call Type:</label>
                        <span>{data?.type}</span>
                    </div>
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Date and Time Of Call:</label>
                        <span>
                            {data?.date_time_of_call && moment(data?.date_time_of_call).format("DD-MM-YYYY HH:mm:ss")}
                        </span>
                    </div>
                </div>

                {data?.attachments?.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="lead-details-list">
                                <label style={{ fontWeight: 'bold' }}>Attachments:</label>
                                {data?.attachments?.map((obj, index) => (
                                    <span key={index} style={{ color: 'blue', display: 'block' }}>
                                        <a href={obj?.attachment} target='_blank' style={{ cursor: 'pointer' }}>
                                            {trimUrlAndNumbers(obj?.attachment)}
                                        </a>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Created By:</label>
                        <span>{data?.created_by?.name}</span>
                    </div>
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Created At:</label>
                        <span>
                            {data?.updated_at && moment(data?.updated_at).format("DD-MM-YYYY")}
                        </span>
                    </div>
                </div>
            </div>

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

    </Grid>
)
