import { Divider, Grid, Skeleton, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react'


function Details({ data, loading }) {

    // console.log(data);

    return (
        loading ?
            // for loading
            loadingDetail()
            :
            <div style={{ padding: '15px' }} className='lead-tabpanel-content-item'>
                <div className="grid grid-cols-1 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Name:</label>
                        <span>{data?.name}</span>
                    </div>
                </div>


                <div className="grid grid-cols-2 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Venue:</label>
                        <span>{data?.venue || 'NA'}</span>
                    </div>
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Branch:</label>
                        <span>{data?.office?.name || 'NA'}</span>
                    </div>
                </div>


                <div className="grid grid-cols-2 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Start Date:</label>
                        <span>
                            {data?.start_date && moment(data?.start_date).format("DD-MM-YYYY") || 'NA'}
                        </span>
                    </div>
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>End Date:</label>
                        <span>
                            {data?.end_date && moment(data?.end_date).format("DD-MM-YYYY") || 'NA'}
                        </span>
                    </div>
                </div>


                <div className="grid grid-cols-1 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Description:</label>
                        <span>{data?.description || 'NA'}</span>
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

        <Grid container spacing={2} style={{ marginBottom: '10px' }}>
            <Grid item xs={12} sm={12}>
                <Skeleton variant="rounded" width={100} height={20} />
                <Skeleton sx={{ mt: 1 }} variant="rounded" width={200} height={20} />
            </Grid>
        </Grid>
        <Divider sx={{ mb: 1 }} />



    </Grid>
)
