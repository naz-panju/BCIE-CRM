import { Divider, Grid, Skeleton, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react'


function Details({ data, loading }) {


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
    )
}

export default Details
