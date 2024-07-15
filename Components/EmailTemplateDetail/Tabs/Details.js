import { Divider, Grid, Skeleton, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react'


function Details({ data, loading }) {

    return (
        loading ?
            // for loading
            loadingDetail()
            :
            // <Grid p={3}>
            //     <Grid container spacing={2} style={{ marginBottom: '10px' }}>
            //         <Grid item xs={12} sm={12}>
            //             <Typography variant="" style={{ fontWeight: 'bold' }}>
            //                 Template Name:
            //             </Typography>
            //             <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
            //                 {data?.name}
            //             </Typography>
            //         </Grid>
            //     </Grid >
            //     <Divider sx={{ mb: 1 }} />


            //     <Grid container spacing={2} style={{ marginBottom: '10px' }}>
            //         <Grid item xs={12} sm={12}>
            //             <Typography variant="" style={{ fontWeight: 'bold' }}>
            //                 Subject:
            //             </Typography>
            //             <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
            //                 {data?.subject}
            //             </Typography>
            //         </Grid>
            //     </Grid >
            //     <Divider sx={{ mb: 1 }} />

            //     <Grid container spacing={2} style={{ marginBottom: '10px' }}>
            //         <Grid item xs={12} sm={12}>
            //             <Typography variant="" style={{ fontWeight: 'bold' }}>
            //                 Body:
            //             </Typography>
            //             <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
            //                 <div dangerouslySetInnerHTML={{ __html: data?.body }} />
            //                 {/* {data?.body} */}
            //             </Typography>
            //         </Grid>
            //     </Grid >
            //     <Divider sx={{ mb: 1 }} />

            //     <Grid container spacing={2} style={{ marginBottom: '10px' }}>
            //         <Grid item xs={12} sm={12}>
            //             <Typography variant="" style={{ fontWeight: 'bold' }}>
            //                 Body Footer:
            //             </Typography>
            //             <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
            //                 <div dangerouslySetInnerHTML={{ __html: data?.body_footer }} />
            //                 {/* {data?.body_footer} */}
            //             </Typography>
            //         </Grid>
            //     </Grid >
            //     <Divider sx={{ mb: 1 }} />

            //     <Grid container spacing={2} style={{ marginBottom: '10px' }}>
            //         <Grid item xs={12} sm={12}>
            //             <Typography variant="" style={{ fontWeight: 'bold' }}>
            //                 Default CC:
            //             </Typography>
            //             <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
            //                 {data?.default_cc}
            //             </Typography>
            //         </Grid>
            //     </Grid >
            //     <Divider sx={{ mb: 1 }} />

            //     <Grid container style={{ marginBottom: '10px' }}>
            //         <Grid item xs={6} sm={6}>
            //             <Typography variant="" style={{ fontWeight: 'bold' }}>
            //                 Created By:
            //             </Typography>
            //             <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
            //                 {data?.created_by_user?.name}
            //             </Typography>
            //         </Grid>
            //         <Grid item xs={6} sm={6}>
            //             <Typography variant="" style={{ fontWeight: 'bold' }}>
            //                 Created At:
            //             </Typography>
            //             <Typography variant="body1" style={{ fontSize: '16px', color: 'grey' }}>
            //                 {
            //                     data?.created_at &&
            //                     moment(data?.created_at).format("DD-MM-YYYY")
            //                 }
            //             </Typography>
            //         </Grid>
            //     </Grid>
            //     <Divider sx={{ mb: 1 }} />

            // </Grid>

            <div style={{ padding: '15px' }} className='lead-tabpanel-content-item'>
            <div className="grid grid-cols-1 gap-4">
                <div className="lead-details-list">
                    <label style={{ fontWeight: 'bold' }}> Template Name:</label>
                    <span> {data?.name}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="lead-details-list">
                    <label style={{ fontWeight: 'bold' }}>Subject:</label>
                    <span>{data?.subject}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="lead-details-list">
                    <label style={{ fontWeight: 'bold' }}>Body:</label>
                    <span>
                        <div dangerouslySetInnerHTML={{ __html: data?.body }} />
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="lead-details-list">
                    <label style={{ fontWeight: 'bold' }}>CC:</label>
                    <span>{data?.default_cc}</span>
                </div>
            </div>

           

            <div className="grid grid-cols-1 gap-4">
                <div className="lead-details-list">
                    <label style={{ fontWeight: 'bold' }}>Body Footer:</label>
                    <span>
                        <div dangerouslySetInnerHTML={{ __html: data?.body_footer }} />
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
                    <hr style={{ margin: '10px 0' }} />
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
