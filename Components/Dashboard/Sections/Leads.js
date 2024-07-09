import React, { useEffect, useState } from 'react'
import BarChartComponent from '../Charts/BarChart'
import BarColorChartComponent from '../Charts/BarColorGraph'
import { Grid, Skeleton } from '@mui/material'
import { DateRangePicker } from 'rsuite'
import Unverified from '@/img/Unverified.png'
import Hot from '@/img/Hot.png'
import Cool from '@/img/Cool.png'
import Warm from '@/img/Warm.png'



import Others from '@/img/Others.svg'
import Image from 'next/image';
function LeadSection({ intakeRange,weeklyList, weeklyLoading, weeklyStageListLoading, leadSourceListLoading, leadStageLoading, weeklyRange, setWeeklyRange, weeklyStageList, leadSourceList, leadStage, index,leadCountryList }) {

    function formatPercentage(value) {
        if (typeof value === 'number' && !isNaN(value)) {
            return value.toFixed(2);
        } else {
            return value;
        }
    }

    const totalLeadCount = leadStage?.data?.reduce((total, currentItem) => {
        return total + currentItem.lead_count;
    }, 0);

    const totalWeeklyLeadCount = weeklyList?.data?.reduce((total, currentItem) => {
        return total + currentItem.count;
    }, 0);


    const getDayOfWeek = (dateString) => {
        const date = new Date(dateString);
        const days = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun',];
        return days[date.getDay()];
    };

    // Initialize an object to store the counts for each day of the week
    const dayCounts = {
       
        'Mon': 0,
        'Tue': 0,
        'Wed': 0,
        'Thu': 0,
        'Fri': 0,
        'Sat': 0,
        'Sun': 0,
    };

    weeklyList?.data?.forEach(item => {
        const dayOfWeek = getDayOfWeek(item.day);
        dayCounts[dayOfWeek] += item.count;
    });

    // // Convert the dayCounts object to an array of counts
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = labels?.map(day => dayCounts[day]);

    const backgroundClasses = ['bg1', 'bg2', 'bg3', 'bg4'];
    const spanClassess = ['Unverified', 'warm', 'cool', 'Hot'];
    const spanClassessBg = ['UnverifiedBg', 'warmBg', 'coolBg', 'HotBg'];

    const icons = [Unverified, Hot, Cool, Warm];

    const getIconSrc = (index) => {
        return icons[index] || DefaultIcon; // Provide a default icon in case index doesn't match
    };

    const getAltText = (index) => {
        const altTexts = ['Unverified', 'Hot', 'Cool', 'Warm'];
        return altTexts[index] || 'Default';
    };

    const predefinedRanges = {
        'This Week': [new Date(), new Date()]
        // Add more ranges if needed
    };


    return (
        <div >
            <div className='weekly-leads'>
                <div className="section-title">
                    Weekly Lead Updates
                </div>
                <div style={{ height: 300 }} className='border-clm flex'>
                    {
                        weeklyLoading ?
                            <div className='graph  w-4/12 border-r'>
                                <Skeleton variant='rounded' width={'100%'} height={'100%'} />
                            </div>
                            :

                            <div style={{ height: '100%' }} className='graph w-4/12 border-r'>
                                <div className='total_sec h-14 border-b-2 d-flex flex items-center justify-between p-3'>
                                    <div className='total'><span>Total</span> {totalWeeklyLeadCount}</div>
                                    <div className='date-range'>
                                        <DateRangePicker
                                            className='no-clear date-focused'
                                            ranges={[]}
                                            value={weeklyRange}
                                            onChange={setWeeklyRange}
                                            // placeholder="Select Date Range"
                                            style={{ width: 220 }}
                                            format='dd-MM-yyyy'
                                            disabledDate={(date) => {
                                                const startDate =intakeRange[0];
                                                const endDate = intakeRange[1];
                                                return date < startDate || date > endDate;
                                            }}
                                          
                                        />
                                    </div>
                                </div>

                                <div className='graph'>
                                    <BarChartComponent from={'lead'} data={counts} />
                                </div>
                            </div>
                    }

                    <div className='stage w-8/12 flex items-center justify-evenly'>
                        {
                            weeklyStageListLoading ?
                                [...Array(4)]?.map((_, index) => (
                                    <div key={index} className='card border weekly-card rounded-sm h-5/6 w-1/6 flex items-center flex-column justify-between bg3'>
                                        <Skeleton height={'100%'} width={'100%'} variant='rounded' />
                                    </div>
                                ))
                                :

                                weeklyStageList?.data?.map((obj, index) => (
                                    <div style={{backgroundColor:obj?.colour}} key={index} className={`card weekly-card border rounded-sm h-5/6 w-1/6 flex items-center flex-column justify-between `}>
                                        <div>


                                            <span className="icon">
                                                <Image src={getIconSrc(index)}
                                                    alt={getAltText(index)} width={18} height={18} />
                                            </span>
                                        </div>
                                        <div>
                                            <h3> {obj?.lead_count}</h3>
                                            Leads
                                        </div>

                                        <span className={`${spanClassess[index % backgroundClasses.length]} btn-stage`}>{obj?.name}</span>
                                    </div>
                                ))
                        }


                        {/* <div className='card border weekly-card rounded-sm h-5/6 w-1/6 flex items-center flex-column justify-between bg2'>
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
                        </div> */}
                    </div>

                </div>
            </div>

            <div className='weekly-leads mt-4'>

                <div style={{ height: 300 }} className='border flex'>
                    <div style={{ height: '100%' }} className='graph w-5/12 p-3'>
                        <div className='total_sec d-flex flex items-center justify-between p-3'>
                            Lead Country
                        </div>
                        <div className='border rounded-sm '>
                            {
                                leadSourceListLoading ?

                                    <Grid className='social-container' container display={'flex'} justifyContent={'space-between'} p={3}>
                                        {[...Array(6)].map((_, index) => (
                                            <Grid key={index} display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                                <span> <Skeleton variant='rounded' width={90} height={20} /></span>
                                                <span><Skeleton variant='rounded' width={40} height={20} /></span>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    :
                                    <Grid className='social-container' container display={'flex'} justifyContent={'space-between'} p={3}>
                                        {
                                            leadCountryList?.data?.map((obj, index) => (

                                                <Grid key={index} display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                                    <span style={{lineHeight:1}}><Image src={Others} alt='alt' width={14} height={14} /> {obj?.country}</span>
                                                    <span>{formatPercentage(obj?.value) || 0}%</span>
                                                </Grid>
                                            ))
                                        }
                                        {/* <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                            <span><Image src={Instagram} alt='Facebook' width={14} height={14} /> Instagram</span>
                                            <span>{formatPercentage(leadSourceList?.data?.Instagram)}%</span>
                                        </Grid>
                                      
                                        <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                            <span><Image src={Facebook} alt='Facebook' width={14} height={14} />Facebook</span>
                                            <span>{formatPercentage(leadSourceList?.data?.Facebook)}% </span>
                                        </Grid>
                                        <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                            <span><Image src={Others} alt='Facebook' width={14} height={14} />google Ads</span>
                                            <span>{formatPercentage(leadSourceList && leadSourceList?.data['Google Ads'])}% </span>
                                        </Grid>
                                        <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                            <span><Image src={Others} alt='Facebook' width={14} height={14} />Websites</span>
                                            <span>{formatPercentage(leadSourceList?.data?.Website)}% </span>
                                        </Grid>
                                        <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                            <span><Image src={Others} alt='Facebook' width={14} height={14} />Referral</span>
                                            <span>{formatPercentage(leadSourceList?.data?.Referral)}% </span>
                                        </Grid> */}

                                        {/* <Grid display={'flex'} p={2} justifyContent={'space-between'} item md={5}>
                                            <span><Image src={Others} alt='Facebook' width={14} height={14} />Others</span>
                                            <span>{formatPercentage(leadSourceList?.data?.Others)}% </span>
                                        </Grid> */}
                                    </Grid>
                            }


                        </div>

                    </div>

                    <div style={{ height: '100%' }} className='graph w-7/12 p-3'>
                        <div className='flex'>
                            <div className='border rounded-sm w-3/6'>

                                <div className='chart-info-title'>
                                    <div className='total'><span>Total</span>{leadStageLoading ? <Skeleton height={20} width={30} variant='rounded' /> : totalLeadCount} </div>
                                </div>


                                {
                                    leadStageLoading ?
                                        <Skeleton height={200} width={'100%'} variant='rounded' />
                                        :
                                        <BarColorChartComponent leadStage={leadStage} />
                                }

                            </div>

                            <div className=' w-3/6'>
                                <div className='chart-info-block'>
                                    <h2>Chart info</h2>


                                    <div className='flex g-5'>
                                        {
                                            leadStageLoading ?
                                                <Grid display={'flex'} container justifyContent={'space-between'} >
                                                    {[...Array(12)]?.map((_, index) => (
                                                        <Grid key={index} item md={5} className='md-6' style={{ marginBottom: 10 }} ><Skeleton variant='rounded' width={200} height={20} /></Grid>
                                                    ))}
                                                </Grid>
                                                :

                                                <ul>
                                                    {
                                                        leadStage?.data?.map((obj, index) => (
                                                            <li key={index}><span style={{ background: obj?.colour }}></span>{obj?.name}</li>
                                                        ))
                                                    }
                                                    {/* <li><span></span>Unverified</li>
                                            <li><span></span>Warm</li>
                                            <li><span></span>Application Preparation</li>
                                            <li><span></span>Application Submitted</li>
                                            <li><span></span>Visa Rejected</li>
                                            <li><span></span>Cold</li>
                                            <li><span></span>Hot</li>
                                            <li><span></span>Deposit Paid</li>
                                            <li><span></span>Visa Submitted</li>
                                            <li><span></span>Visa Obtained</li> */}
                                                </ul>
                                        }
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
