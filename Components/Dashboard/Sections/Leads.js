import React, { useEffect, useState } from 'react'
import BarChartComponent from '../Charts/BarChart'
import BarColorChartComponent from '../Charts/BarColorGraph'
import { Grid, Skeleton } from '@mui/material'
import { DateRangePicker } from 'rsuite'
import Unverified from '@/img/Unverified.png'
import Hot from '@/img/Hot.png'
import Cool from '@/img/Cool.png'
import Warm from '@/img/Warm.png'
import Mail from '@/img/mail.svg'
import Message from '@/img/message.svg'
import Phone from '@/img/phone.svg'
import Deposit from '@/img/Deposit.svg'
import Pending from '@/img/Pending.svg'
import Others from '@/img/Others.svg'
import Image from 'next/image';
import moment from 'moment'
import toast from 'react-hot-toast'
function LeadSection({ communicationLogLoading, communicationLog, range, setRange, handleClean, intakeRange, weeklyList, weeklyLoading, weeklyStageListLoading, leadSourceListLoading, leadStageLoading, weeklyRange, setWeeklyRange, weeklyStageList, leadSourceList, leadStage, index, leadCountryList }) {

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
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',];
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
    const spanClassess = ['Unverified', 'cool', 'warm', 'Hot'];
    const spanClassessBg = ['UnverifiedBg', 'coolBg', 'warmBg', 'HotBg'];

    const icons = [Unverified, Cool, Warm, Hot,];

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

    const emails = communicationLog?.data?.emails || 0;
    const calls = communicationLog?.data?.calls || 0;
    const messages = communicationLog?.data?.whatsapp || 0;

    // Calculate the total
    const total = emails + calls + messages;

    const handleDateSelect = (range,e) => {
        const [start, end] = range;
        // console.log(e);

        e.preventDefault()

        if (start && end) {
            const startDate = moment(start);
            const endDate = moment(end);
            const diffInDays = endDate.diff(startDate, 'days');

            console.log(diffInDays);

            if (diffInDays > 7) {
                toast.error('The selected date range should not exceed 7 days.');
                // setWeeklyRange([start, null]); // Keep the start date and reset the end date
            } else {
                setWeeklyRange(range);
            }
        }     
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
                                            onChange={handleDateSelect}
                                            // placeholder="Select Date Range"
                                            style={{ width: 220 }}
                                            format='dd-MM-yyyy'
                                        // disabledDate={(date) => {
                                        //     const startDate = intakeRange[0];
                                        //     const endDate = intakeRange[1];
                                        //     return date < startDate || date > endDate;
                                        // }}

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
                                    <div style={{ backgroundColor: obj?.colour }} key={index} className={`card weekly-card border rounded-sm h-5/6 w-1/6 flex items-center flex-column justify-between `}>
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

                                        {/* index % backgroundClasses.length */}
                                        <span className={`${spanClassess[2]} btn-stage`}>{obj?.name}</span>
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

                <div className='flex justify-end mb-3'>
                    <Grid sx={{ width: 230, }} className='intake_dropdown '>
                        <DateRangePicker
                            preventOverflow
                            className='no-clear date-focused'
                            value={range}
                            onChange={setRange}
                            onClean={handleClean}
                            ranges={[]}
                            format='dd-MM-yyyy'
                        />
                    </Grid>
                </div>

                <div style={{ height: 320 }} className='border flex'>

                    <div className=' w-4/12'>
                        <div className=''>
                            <div className=' w-12/12'>
                                <div className='comminication-block p-5'>
                                    <div className='section-title'>Communications</div>
                                    {
                                        communicationLogLoading ?
                                            <div className='flex justify-between'>
                                                <Skeleton variant='rounded' width={400} height={200} />
                                            </div>
                                            :
                                            <div className='flex'>
                                                <div className=' w-full  mt-2' >
                                                    <div className='communication-graph'>
                                                        <div className='chart-info-title'>
                                                            <div className='total'><span>Total</span></div>
                                                        </div>

                                                        <h2>{total}</h2>

                                                        <h4>Logs</h4>

                                                        <svg xmlns="http://www.w3.org/2000/svg" width="156" height="34" viewBox="0 0 156 34" fill="none"><path d="M-97.4882 19.8504C-88.59 19.8662 -88.6086 30.3994 -79.7104 30.4151C-70.8122 30.4308 -70.8338 42.7197 -61.9357 42.7353C-53.0375 42.751 -53.022 33.9733 -44.1238 33.989C-35.2256 34.0047 -35.2101 25.2269 -26.3119 25.2426C-17.4137 25.2583 -17.4176 27.4528 -8.51941 27.4685C0.378786 27.4841 0.373367 30.5564 9.27156 30.5721C18.1698 30.5877 18.1976 14.7878 27.0958 14.8035C35.994 14.8192 35.9763 24.9136 44.8744 24.9293C53.7726 24.945 53.7997 9.58389 62.6979 9.59958C71.5961 9.61528 71.593 11.3708 80.4912 11.3865C89.3894 11.4022 89.3739 20.18 98.2721 20.1957C107.17 20.2114 107.152 30.7447 116.05 30.7604C124.948 30.7761 125.369 18.8874 133.877 13.2363C140.145 9.0732 142.791 4.47419 151.689 4.48991C160.587 4.50563 160.578 9.77226 169.476 9.78796C178.374 9.80365 187.288 1.04156 196.186 1.05725C205.085 1.07293 205.075 6.3396 213.973 6.3553C222.872 6.37099 223.95 25.684 231.736 25.6978C239.522 25.7115 240.656 13.4246 249.554 13.4403C258.452 13.456 258.44 20.4782 267.338 20.4939C276.236 20.5096 276.248 13.4874 285.147 13.5031C294.045 13.5188 291.841 1.66486 302.964 1.68448" stroke="#8710FF" strokeWidth="2" /></svg>

                                                        <div className='svg-bg'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="156" height="62" viewBox="0 0 156 62" fill="none"><path d="M-79.6596 29.4148C-88.5578 29.3991 -88.5392 18.8659 -97.4374 18.8502L-97.5162 63.5168C-97.524 67.935 -93.9486 71.5231 -89.5303 71.5309L294.888 72.2089C299.307 72.2167 302.895 68.642 302.903 64.2237L303.015 0.684233C291.892 0.664614 294.096 12.5185 285.197 12.5028C276.299 12.4871 276.287 19.5093 267.389 19.4936C258.49 19.4779 258.503 12.4557 249.605 12.44C240.706 12.4243 239.572 24.7112 231.786 24.6975C224.001 24.6838 222.922 5.37075 214.024 5.35505C205.126 5.33936 205.135 0.0726878 196.237 0.0570029C187.339 0.0413179 178.425 8.80341 169.527 8.78772C160.629 8.77202 160.638 3.50539 151.74 3.48967C142.842 3.47394 140.196 8.07296 133.928 12.236C125.42 17.8872 124.999 29.7758 116.101 29.7602C107.203 29.7445 107.221 19.2112 98.3229 19.1955C89.4247 19.1798 89.4402 10.402 80.542 10.3863C71.6438 10.3706 71.6469 8.61504 62.7487 8.59934C53.8505 8.58364 53.8234 23.9447 44.9252 23.929C36.027 23.9134 36.0448 13.8189 27.1466 13.8032C18.2484 13.7876 18.2205 29.5875 9.32234 29.5718C0.424145 29.5561 0.429564 26.4839 -8.46862 26.4682C-17.3668 26.4525 -17.3629 24.2581 -26.2611 24.2424C-35.1593 24.2267 -35.1748 33.0044 -44.073 32.9888C-52.9712 32.9731 -52.9867 41.7508 -61.8849 41.7351C-70.7831 41.7194 -70.7614 29.4305 -79.6596 29.4148Z" fill="url(#paint0_linear_10_992)" /><defs><linearGradient id="paint0_linear_10_992" x1="102.806" y1="-0.107796" x2="102.679" y2="71.8699" gradientUnits="userSpaceOnUse"><stop stopColor="#C082FF" stopOpacity="0.3" /><stop offset="0.524" stopColor="#FCDFFF" stopOpacity="0" /></linearGradient></defs></svg>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className=' w-full mt-2 px-2'>
                                                    <div className='communication-details'>
                                                        <ul clas>
                                                            <li><Image src={Mail} alt='Mail' width={22} height={22} /><b>{communicationLog?.data?.emails}</b>Emails</li>
                                                            <li><Image src={Phone} alt='Mail' width={22} height={22} /><b>{communicationLog?.data?.calls}</b>Calls</li>
                                                            <li><Image src={Message} alt='Mail' width={22} height={22} /><b>{communicationLog?.data?.whatsapp}</b>Messages</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>


                        </div>
                    </div>
                    {/* <div style={{ height: '100%' }} className='graph w-5/12 p-3'>
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
                                                    <span style={{ lineHeight: 1 }}><Image src={Others} alt='alt' width={14} height={14} /> {obj?.country}</span>
                                                    <span>{formatPercentage(obj?.value) || 0}%</span>
                                                </Grid>
                                            ))
                                        }
                                        
                                    </Grid>
                            }


                        </div>

                    </div> */}

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
