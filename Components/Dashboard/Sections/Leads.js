import React, { useEffect, useState } from 'react'
import BarChartComponent from '../Charts/BarChart'
import BarColorChartComponent from '../Charts/BarColorGraph'
import { Grid } from '@mui/material'
import { DateRangePicker } from 'rsuite'
import Facebook from '@/img/facebook.svg'
import Instagram from '@/img/instagram.svg'
import Twitter from '@/img/twitter.svg'
import Whatsapp from '@/img/Whatsapp.svg'
import Linkedin from '@/img/Linkedin.svg'
import Others from '@/img/Others.svg'
import Image from 'next/image';
function LeadSection() {

    const [range, setRange] = useState([null, null]);



    return (
        <div >
            <div className='weekly-leads'>
                <div className="section-title">
                    Weekly Lead Updates
                </div>
                <div style={{ height: 300 }} className='border-clm flex'>
                    <div style={{ height: '100%' }} className='graph w-4/12 border-r'>
                        <div className='total_sec h-14 border-b-2 d-flex flex items-center justify-between p-3'>
                            <div className='total'><span>Total</span> 300</div>
                            <div className='date-range'>  <DateRangePicker
                                    
                                    onChange={setRange}
                                    // placeholder="Select Date Range"
                                    style={{ width: 150 }}
                                    format='dd-MM-yyyy'
                                /></div>
                        </div>
                        <div className='graph'>
                            <BarChartComponent />
                        </div>
                    </div>

                    <div className='stage w-8/12 flex items-center justify-evenly'>
                        <div className='card weekly-card border rounded-sm h-5/6 w-1/6 flex items-center flex-column justify-between bg1'>
                            <div>
                                icon
                            </div>
                            <div>
                                <h3> 20</h3>
                                Leads
                            </div>

                            <span className='Unverified btn-stage'>Unverified</span>
                        </div>
                        <div className='card border weekly-card rounded-sm h-5/6 w-1/6 flex items-center flex-column justify-between bg2'>
                            <div>
                                icon
                            </div>
                            <div>
                                <h3> 20</h3>
                                Leads
                            </div>

                            <span className='Hot btn-stage'>Hot</span>
                        </div>
                        <div className='card border weekly-card rounded-sm h-5/6 w-1/6 flex items-center flex-column justify-between bg3'>
                            <div>
                                icon
                            </div>
                            <div>
                                <h3> 20</h3>
                                Hot
                            </div>

                            <span className='cool btn-stage'>Cool</span>
                        </div>
                        <div className='card border weekly-card rounded-sm h-5/6 w-1/6 flex items-center flex-column justify-between bg4'>
                            <div>
                                icon
                            </div>
                            <div>
                                <h3> 20</h3>
                                Leads
                            </div>

                            <span className='warm btn-stage'>Warm</span>
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
                            <Grid className='social-container' container display={'flex'} justifyContent={'space-between'} p={3}>
                                <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                    <span><Image src={Instagram } alt='Facebook' width={14} height={14} /> Facebook</span>
                                    <span>75% </span>
                                </Grid>
                                <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                    <span><Image src={Linkedin } alt='Facebook' width={14} height={14} />Linkedin</span>
                                    <span>75% </span>
                                </Grid>
                                <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                    <span><Image src={Facebook } alt='Facebook' width={14} height={14} />Facebook</span>
                                    <span>75% </span>
                                </Grid>
                                <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                    <span><Image src={Whatsapp } alt='Facebook' width={14} height={14} />Whatsapp</span>
                                    <span>75% </span>
                                </Grid>
                                <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                    <span><Image src={Twitter } alt='Facebook' width={14} height={14} />X</span>
                                    <span>75% </span>
                                </Grid>
                                <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                    <span><Image src={Others } alt='Facebook' width={14} height={14} />Others</span>
                                    <span>75% </span>
                                </Grid>
                            </Grid>

                        </div>

                    </div>

                    <div style={{ height: '100%' }} className='graph w-7/12 p-3'>
                        <div className='flex'>
                            <div className='border rounded-sm w-3/6'>
                                
                                <div className='chart-info-title'>
                                    <div className='total'><span>Total</span> 300</div>
                                </div>


                                <BarColorChartComponent />

                            </div>

                            <div className=' w-3/6'>
                                <div className='chart-info-block'>
                                    <h2>Chart info</h2>

                                    <div className='flex g-5'>
                                        <ul>
                                            <li><span></span>Unverified</li>
                                            <li><span></span>Warm</li>
                                            <li><span></span>Application Preparation</li>
                                            <li><span></span>Application Submitted</li>
                                            <li><span></span>Visa Rejected</li>
                                            <li><span></span>Cold</li>
                                            <li><span></span>Hot</li>
                                            <li><span></span>Deposit Paid</li>
                                            <li><span></span>Visa Submitted</li>
                                            <li><span></span>Visa Obtained</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
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
