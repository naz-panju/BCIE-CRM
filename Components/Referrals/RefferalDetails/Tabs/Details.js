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


    const handleCopy = async () => {
        setcopied(true)
        await navigator.clipboard.writeText(`${currentURL}/forms/event/${data?.token}`);
        setTimeout(() => {
            setcopied(false)
        }, 1000);
    }


    return (
        loading ?
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
                        <label style={{ fontWeight: 'bold' }}>Lead Source:</label>
                        <span>{data?.lead_source?.name || "Null"}</span>
                    </div>

                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Last Date of Validity:</label>
                        <span>{data?.created_at && moment(data?.last_date_of_validity).format("DD-MM-YYYY")}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Status:</label>
                        <span>{data?.status == 1 ? 'Open' : 'Close'}</span>
                    </div>
                    {data?.lead_source?.id == 5 && (
                        <>
                            <div className="lead-details-list">
                                <label style={{ fontWeight: 'bold' }}>Reffered Student:</label>
                                <span>{data?.referredStudent?.name}</span>
                            </div>
                        </>
                    )}

                    {data?.lead_source?.id == 6 && (
                        <>
                            <div className="lead-details-list">
                                <label style={{ fontWeight: 'bold' }}>Referred Agency:</label>
                                <span>{data?.agency?.name}</span>
                            </div>
                        </>
                    )}

                    {data?.lead_source?.id == 7 && (
                        <>
                            <div className="lead-details-list">
                                <label style={{ fontWeight: 'bold' }}>Referred University:</label>
                                <span>{data?.referred_university?.name}</span>
                            </div>
                        </>
                    )}

                    {data?.lead_source?.id == 11 && (
                        <>
                            <div className="lead-details-list">
                                <label style={{ fontWeight: 'bold' }}>Referred Event:</label>
                                <span>{data?.event?.name}</span>
                            </div>
                        </>
                    )}

                </div>

                {data?.banner_image && (
                    <>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="lead-details-list">
                                <label style={{ fontWeight: 'bold', maxWidth: 'unset', minWidth: 'unset' }}>Banner Image (preferred size 660x350)</label>
                                <Image loader={myLoader} src={data?.banner_image || ''} width={250} height={250} />
                            </div>
                        </div>
                    </>
                )}

                <div className="grid grid-cols-1 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Top Description:</label>
                        {/* <span>{data?.top_description || "NA"}</span> */}
                        <span dangerouslySetInnerHTML={{ __html: data?.top_description || "NA" }} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Bottom Description:</label>
                        {/* <span>{data?.bottom_description || "NA"}</span> */}
                        <span dangerouslySetInnerHTML={{ __html: data?.bottom_description || "NA" }} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Private Remarks:</label>
                        <span>{data?.private_remarks || "NA"}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Created By:</label>
                        <span>{data?.created_by?.name}</span>
                    </div>
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Created At:</label>
                        <span>{data?.created_at && moment(data?.created_at).format("DD-MM-YYYY")}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="lead-details-list">
                        <label style={{ fontWeight: 'bold' }}>Referral Link:</label>
                        <a href={`${currentURL}/forms/lead/${data?.token}`} target='_blank' style={{ fontSize: '16px', color: 'blue' }}>
                            {`${currentURL}/forms/lead/${data?.token}`}
                        </a>
                        <div className="flex justify-end items-center">
                            {
                                copied ?
                                    <a style={{ fontSize: '13px', marginRight: 5, cursor: 'pointer' }} onClick={handleCopy}>
                                        copied <Check fontSize='small' />
                                    </a> :
                                    <a style={{ fontSize: '13px', marginRight: 5, cursor: 'pointer' }} onClick={handleCopy}>
                                        copy <Link fontSize='small' />
                                    </a>
                            }
                        </div>
                    </div>
                </div>
            </div>
    );

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
