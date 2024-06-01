import { Divider, Grid, Skeleton, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react'


function Details({ data, loading }) {

    return (
        loading ?
            // for loading
            loadingDetail()
            :
            <Grid p={3}>
                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Template Name:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.name}
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

                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Body Footer:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.body_footer}
                        </Typography>
                    </Grid>
                </Grid >
                <Divider sx={{ mb: 1 }} />

                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="" style={{ fontWeight: 'bold' }}>
                            Default CC:
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
                            {data?.default_cc}
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
                            {data?.created_by_user?.name}
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

    </Grid>
)
