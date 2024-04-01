import { Check, Link } from '@mui/icons-material';
import { Button, Divider, Grid, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react'


function EventRegistrations({ details }) {

    const [copied, setcopied] = useState(false)
    const [leadCopied, setleadCopied] = useState(false)

    const router = useRouter()

    const currentURL = window?.location?.origin;

    const handleCopy = async () => {
        setcopied(true)
        await navigator.clipboard.writeText(`${currentURL}/forms/event/${details?.token}`);
        setTimeout(() => {
            setcopied(false)
        }, 1000);
    }

    const handleLeadLinkCopy = async () => {
        setleadCopied(true)
        await navigator.clipboard.writeText(`${currentURL}/forms/lead`);
        setTimeout(() => {
            setleadCopied(false)
        }, 1000);
    }


    return (

        <Grid >
            <Grid p={2} container spacing={2} >
                <Grid item xs={4} sm={4} md={4}>
                    <Typography variant="" style={{ fontWeight: 'bold' }}>
                        Event Registration Link:
                    </Typography>

                </Grid>
                <Grid item container xs={8} sm={8} md={8}>
                    <Grid item width={50} xs={12} sm={12} md={12}>
                        <a href={`${currentURL}/forms/event/${details?.token}`} target='_blank' style={{ fontSize: '16px', color: 'blue' }}>
                            {`${currentURL}/forms/event/${details?.token}`}
                        </a>
                    </Grid>
                    <Grid display={'flex'} alignItems={'center'} justifyContent={'end'} item xs={12} sm={12} md={12}>
                        {/* <IconButton> */}
                        {
                            copied ?
                                <a style={{ fontSize: '13px', marginRight: 5, cursor: 'pointer' }} onClick={handleCopy}>
                                    copied <Check fontSize='small' />
                                </a> :
                                <a style={{ fontSize: '13px', marginRight: 5, cursor: 'pointer' }} onClick={handleCopy}>
                                    copy <Link fontSize='small' />
                                </a>
                        }
                    </Grid>
                </Grid>
            </Grid >
            <Divider sx={{ mb: 1 }} />


            <Grid p={2} container spacing={2} >
                <Grid item xs={4} sm={4} md={4}>
                    <Typography variant="" style={{ fontWeight: 'bold' }}>
                        Lead Registration Link:
                    </Typography>

                </Grid>
                <Grid item container xs={8} sm={8} md={8}>
                    <Grid item width={50} xs={12} sm={12} md={12}>
                        <a href={`${currentURL}/forms/lead`} target='_blank' style={{ fontSize: '16px', color: 'blue' }}>
                            {`${currentURL}/forms/lead`}
                        </a>
                    </Grid>
                    <Grid display={'flex'} alignItems={'center'} justifyContent={'end'} item xs={12} sm={12} md={12}>
                        {/* <IconButton> */}
                        {
                            leadCopied ?
                                <a style={{ fontSize: '13px', marginRight: 5, cursor: 'pointer' }} onClick={handleLeadLinkCopy}>
                                    copied <Check fontSize='small' />
                                </a> :
                                <a style={{ fontSize: '13px', marginRight: 5, cursor: 'pointer' }} onClick={handleLeadLinkCopy}>
                                    copy <Link fontSize='small' />
                                </a>
                        }
                    </Grid>
                </Grid>
            </Grid >
            <Divider sx={{ mb: 1 }} />


        </Grid >
    )
}

export default EventRegistrations


