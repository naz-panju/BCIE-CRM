import React from 'react'
import BarChartComponent from '../Charts/BarChart'
import BarColorChartComponent from '../Charts/BarColorGraph'
import { Grid } from '@mui/material'

function LeadSection() {
    return (
        <div >
            <div className='weekly-leads'>
                Weekly Lead Updates
                <div style={{ height: 300 }} className='border flex'>
                    <div style={{ height: '100%' }} className='graph w-4/12 border-r'>
                        <div className='total_sec h-14 border-b-2 d-flex flex items-center justify-between p-3'>
                            <span>Total 300</span>
                            <span>Date Range</span>
                        </div>
                        <div className='graph'>
                            <BarChartComponent />
                        </div>
                    </div>

                    <div className='stage w-8/12 flex items-center justify-evenly'>
                        <div className='card border rounded-sm h-5/6 w-1/6 flex items-center flex-column justify-between'>
                            <div>
                                icon
                            </div>
                            <div>
                                <p> 20</p>
                                Leads
                            </div>

                            <span>Unverified</span>
                        </div>
                        <div className='card border rounded-sm h-5/6 w-1/6 flex items-center flex-column justify-between'>
                            <div>
                                icon
                            </div>
                            <div>
                                <p> 20</p>
                                Leads
                            </div>

                            <span>Unverified</span>
                        </div>
                        <div className='card border rounded-sm h-5/6 w-1/6 flex items-center flex-column justify-between'>
                            <div>
                                icon
                            </div>
                            <div>
                                <p> 20</p>
                                Hot
                            </div>

                            <span>Cool</span>
                        </div>
                        <div className='card border rounded-sm h-5/6 w-1/6 flex items-center flex-column justify-between'>
                            <div>
                                icon
                            </div>
                            <div>
                                <p> 20</p>
                                Leads
                            </div>

                            <span>Warm</span>
                        </div>
                    </div>

                </div>
            </div>

            <div className='weekly-leads mt-4'>

                <div style={{ height: 300 }} className='border flex'>
                    <div style={{ height: '100%' }} className='graph w-5/12 p-3'>
                        <div className='total_sec d-flex flex items-center justify-between p-3'>
                            Lead Source
                        </div>
                        <div className='border rounded-sm h-4/5'>
                            <Grid container display={'flex'} justifyContent={'space-between'} p={3}>
                                <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                    <span>Instagram </span>
                                    <span>75% </span>
                                </Grid>
                                <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                    <span>Linkedin </span>
                                    <span>75% </span>
                                </Grid>
                                <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                    <span>Facebook </span>
                                    <span>75% </span>
                                </Grid>
                                <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                    <span>Whatsapp </span>
                                    <span>75% </span>
                                </Grid>
                                <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                    <span>X </span>
                                    <span>75% </span>
                                </Grid>
                                <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                    <span>Others </span>
                                    <span>75% </span>
                                </Grid>
                            </Grid>

                        </div>

                    </div>

                    <div style={{ height: '100%' }} className='graph w-7/12 p-3'>

                        <div className='border rounded-sm h-5/6 w-3/6'>
                            <BarColorChartComponent />

                        </div>

                        {/* <div className='graph'>
                            <BarChartComponent />
                        </div> */}
                    </div>

                </div>
            </div>

        </div>
    )
}

export default LeadSection
