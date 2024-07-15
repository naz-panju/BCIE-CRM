import { Divider, Grid, Skeleton, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react'


function Details({ data, loading }) {

    // console.log(data);


    return (
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
            <div style={{ padding: '15px' }} className='lead-tabpanel-content-item'>

                <div className="grid grid-cols-1 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Title:</label>
                        <span>{data?.title}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Lead:</label>
                        <span>{data?.lead?.name || "Null"}</span>
                    </div>
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Status:</label>
                        <span>{data?.status}</span>
                    </div>
                </div>

                {data?.status_note && (
                    <div className="grid grid-cols-1 gap-4">
                        <div className="lead-details-list">
                            <label style={{ fontWeight: 'bold' }}>Status Note:</label>
                            <span>{data?.status_note}</span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Assigned To:</label>
                        <span>{data?.assignedToUser?.name}</span>
                    </div>
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Assigned By:</label>
                        <span>{data?.assignedByUser?.name}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Student:</label>
                        <span>{data?.applicaion?.lead?.name || 'NA'}</span>
                    </div>
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>University:</label>
                        <span>{data?.applicaion?.university?.name || 'NA'}</span>
                    </div>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Created By:</label>
                        <span>{data?.createdBy?.name}</span>
                    </div>
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Created At:</label>
                        <span>{data?.created_at && moment(data?.created_at).format("DD-MM-YYYY")}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Due Date:</label>
                        <span>{data?.due_date ? moment(data?.due_date).format("DD-MM-YYYY") : 'NA'}</span>
                    </div>
                </div>

                {
                    data?.description &&
                    <div className="grid grid-cols-1 gap-4">
                        <div className="lead-details-list">
                            <label style={{ fontWeight: 'bold' }}>Description:</label>
                            <span>{data?.description}</span>
                        </div>
                    </div>
                }
            </div>

    )
}

export default Details
