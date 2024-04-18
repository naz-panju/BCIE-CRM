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
                        {data?.body}
                    </Typography>
                </Grid>
            </Grid >
            <Divider sx={{ mb: 1 }} />

            

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
