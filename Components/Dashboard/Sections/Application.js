import React, { useEffect, useState } from 'react'
import BarChartComponent from '../Charts/BarChart'
import BarColorChartComponent from '../Charts/BarColorGraph'
import { DateRangePicker } from 'rsuite'
import Pending from '@/img/Pending.svg'
import AsyncSelect from "react-select/async";
import { Skeleton } from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image'

function ApplicationSection({paymentLoading,payments, selectedAppCounsellor, selectedAppCoordinators, handleAppCounsellorSelect, handleAppCoordinatorSelect, fetchAppCounsellors, fetchAppCoordinators, intakeRange, weeklyApplicationList, submitApplicationLoading, weeklyApplicationLoading, applicationStagesLoading, fetchUniversities, handleSelectUniversity, selectedUniversity, fetchCountries, selectedCountries, handleCountrySelect, applicationStages, weeklyApplicationRange, setWeeklyApplicationRange, submitApplicationList }) {


    const session = useSession()

    const totalWeeklyAppCount = weeklyApplicationList?.data?.reduce((total, currentItem) => {
        return total + currentItem.count;
    }, 0);

    const getDayOfWeek = (dateString) => {
        const date = new Date(dateString);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

    weeklyApplicationList?.data?.forEach(item => {
        const dayOfWeek = getDayOfWeek(item.day);
        dayCounts[dayOfWeek] += item.count;
    });

    // // Convert the dayCounts object to an array of counts
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',];
    const counts = labels.map(day => dayCounts[day]);
    const backgroundClasses = ['bg1', 'bg2', 'bg3', 'bg4'];

    return (
        <div >
            <div className='weekly-leads'>

                <div className='border flex'>
                    {
                        session?.data?.user?.role?.id == 6 ?
                            submitApplicationLoading ?
                                <Skeleton style={{ marginTop: '70px' }} variant='rounded' width={600} height={200} />
                                :
                                <div style={{ height: '100%', marginTop: '70px' }} className='stage w-5/12 flex items-center justify-evenly application-submit-sec'>
                                    {
                                        submitApplicationList?.data?.map((obj, index) => (

                                            <div key={index} className={`card application border weekly-card rounded-sm h-5/6 w-2/8 flex items-center flex-column justify-between ${backgroundClasses[index % backgroundClasses.length]} `}>
                                                <div>

                                                </div>
                                                <div>
                                                    <h3> {obj?.count}</h3>
                                                    Application
                                                </div>

                                                <span className='Hot btn-stage'>{obj?.status}</span>
                                            </div>
                                        ))
                                    }

                                </div>
                            :

                            // <div style={{ height: '100%' }} className='graph w-4/12 border-r'>
                            //     <div className="section-title p-5 pb-4">
                            //         Weekly Application Updates
                            //     </div>

                            //     <div className='total_sec h-14 border-b-2 d-flex flex items-center justify-between p-3'>
                            //         <div className='total'><span>Total</span> {totalWeeklyAppCount}</div>
                            //         <div className='date-range'>
                            //             <DateRangePicker
                            //                 className='no-clear date-focused'
                            //                 ranges={[]}
                            //                 value={weeklyApplicationRange}
                            //                 onChange={setWeeklyApplicationRange}
                            //                 // placeholder="Select Date Range"
                            //                 style={{ width: 220 }}
                            //                 format='dd-MM-yyyy'
                            //                 disabledDate={(date) => {
                            //                     const startDate = intakeRange[0];
                            //                     const endDate = intakeRange[1];
                            //                     return date < startDate || date > endDate;
                            //                 }}

                            //             />
                            //         </div>
                            //     </div>
                            //     {
                            //         weeklyApplicationLoading ?
                            //             <div className='graph'>
                            //                 <Skeleton variant='rounded' width={'100%'} height={200} />
                            //             </div>
                            //             :
                            //             <div className='graph'>
                            //                 <BarChartComponent from='app' data={counts} />
                            //             </div>
                            //     }
                            // </div>

                            <div className=' w-5/12'>
                                <div className='comminication-block  p-5'>
                                    <div className='section-title'>Payments</div>
                                    {
                                        paymentLoading ?
                                            <div className='flex justify-between'>
                                                <Skeleton variant='rounded' width={400} height={200} />
                                            </div>
                                            :
                                            <div className='flex justify-between'>
                                                <div className=' w-6/12'>
                                                    <div className='communication-graph'>
                                                        <div className='chart-info-title'>
                                                            <div className='total'><span>Total</span></div>
                                                        </div>
                                                        <h2>{payments?.data?.deposit_paid_leads}</h2>
                                                        <h4>Total Deposit </h4>

                                                        <svg xmlns="http://www.w3.org/2000/svg" width="156" height="30" viewBox="0 0 156 30" fill="none">  <path d="M-95 20.3111C-87.9778 20.3112 -87.9778 30.8444 -80.9556 30.8444C-73.9333 30.8444 -73.9333 43.1333 -66.9111 43.1333C-59.8889 43.1333 -59.8889 34.3556 -52.8667 34.3556C-45.8445 34.3556 -45.8445 25.5778 -38.8222 25.5778C-31.8 25.5778 -31.8 27.7722 -24.7778 27.7722C-17.7556 27.7722 -17.7556 30.8445 -10.7333 30.8445C-3.71113 30.8444 -3.71113 15.0445 3.3111 15.0445C10.3333 15.0445 10.3334 25.1389 17.3556 25.1389C24.3778 25.1389 24.3778 9.77778 31.4 9.77778C38.4222 9.77778 38.4222 11.5334 45.4445 11.5334C52.4667 11.5334 52.4667 20.3111 59.4889 20.3111C66.5111 20.3111 66.5111 30.8444 73.5334 30.8445C80.5556 30.8445 80.8711 18.9551 87.5778 13.2889C92.5184 9.11479 94.6 4.51112 101.622 4.51114C108.644 4.51117 108.644 9.77781 115.667 9.77781C122.689 9.77781 129.711 1.00001 136.733 1C143.756 0.99999 143.756 6.26667 150.778 6.26667C157.8 6.26667 158.678 25.5778 164.822 25.5778C170.967 25.5778 171.844 13.2889 178.867 13.2889C185.889 13.2889 185.889 20.3111 192.911 20.3111C199.933 20.3111 199.933 13.2889 206.956 13.2889C213.978 13.2889 212.222 1.43889 221 1.43889" stroke="#22C55E" strokeWidth="2" /></svg>

                                                        <div className='svg-bg'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="156" height="58" viewBox="0 0 156 58" fill="none"><path d="M-80.9556 29.8444C-87.9778 29.8444 -87.9778 19.3112 -95 19.3111V63.9778C-95 68.3961 -91.4183 71.9778 -87 71.9778H213C217.418 71.9778 221 68.3967 221 63.9784V0.438889C212.222 0.438889 213.978 12.2889 206.956 12.2889C199.933 12.2889 199.933 19.3111 192.911 19.3111C185.889 19.3111 185.889 12.2889 178.867 12.2889C171.844 12.2889 170.967 24.5778 164.822 24.5778C158.678 24.5778 157.8 5.26667 150.778 5.26667C143.756 5.26667 143.756 -1.02023e-05 136.733 0C129.711 1.02023e-05 122.689 8.77781 115.667 8.77781C108.644 8.77781 108.644 3.51117 101.622 3.51114C94.6 3.51112 92.5184 8.11479 87.5778 12.2889C80.8711 17.9551 80.5556 29.8445 73.5334 29.8445C66.5111 29.8444 66.5111 19.3111 59.4889 19.3111C52.4667 19.3111 52.4667 10.5334 45.4445 10.5334C38.4222 10.5334 38.4222 8.77778 31.4 8.77778C24.3778 8.77778 24.3778 24.1389 17.3556 24.1389C10.3334 24.1389 10.3333 14.0444 3.3111 14.0445C-3.71113 14.0445 -3.71113 29.8444 -10.7334 29.8445C-17.7556 29.8445 -17.7556 26.7722 -24.7778 26.7722C-31.8 26.7722 -31.8 24.5778 -38.8222 24.5778C-45.8445 24.5778 -45.8445 33.3556 -52.8667 33.3556C-59.8889 33.3556 -59.8889 42.1333 -66.9111 42.1333C-73.9333 42.1333 -73.9333 29.8444 -80.9556 29.8444Z" fill="url(#paint0_linear_10_903)" />  <defs><linearGradient id="paint0_linear_10_903" x1="63" y1="0" x2="63" y2="71.9778" gradientUnits="userSpaceOnUse"><stop stopColor="#22C55E" stopOpacity="0.1" /><stop offset="1" stopColor="#22C55E" stopOpacity="0" /></linearGradient></defs></svg>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className=' w-5/12'>
                                                    <div className='communication-details'>
                                                        <ul>
                                                            {/* <li style={{lineHeight:1}} ><Image src={Deposit} alt='Mail' width={22} height={22} /><b>{payments?.data?.deposit_paid_leads}</b>Deposit Paid</li> */}
                                                            <li><Image src={Pending} alt='Mail' width={22} height={22} /><b>{payments?.data?.deposit_not_paid_leads}</b>Pending</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>
                    }


                    <div style={{ height: '100%' }} className='graph w-8/12 p-3 pt-0 '>
                        <div className='total_sec d-flex flex items-center justify-between p-3'>
                            Application Stages

                            <div className='flex items-center justify-between gap-2'>
                                {/* <div className='intake_dropdown'>
                                    <AsyncSelect
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), }}
                                        placeholder='Counsellors'
                                        name={'Counsellors'}
                                        defaultValue='Counsellors'
                                        isClearable
                                        defaultOptions
                                    />
                                </div> */}

                                <AsyncSelect
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), }}
                                    isClearable
                                    defaultOptions
                                    name='country'
                                    value={selectedCountries}
                                    defaultValue={selectedCountries}
                                    loadOptions={fetchCountries}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    placeholder={<div>Country</div>}
                                    onChange={handleCountrySelect}
                                />

                                <AsyncSelect
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), }}
                                    isClearable
                                    defaultOptions
                                    isDisabled={!selectedCountries}
                                    key={selectedCountries?.id}
                                    name='university'
                                    value={selectedUniversity}
                                    defaultValue={selectedUniversity}
                                    loadOptions={fetchUniversities}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    placeholder={<div>University</div>}
                                    onChange={handleSelectUniversity}
                                />
                                {/* {
                                    session?.data?.user?.role?.id != 5 &&
                                    <AsyncSelect
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), }}
                                        isClearable
                                        defaultOptions
                                        // isDisabled={!selectedCountries}
                                        // key={selectedCountries?.id}
                                        name='counselllor'
                                        value={selectedAppCounsellor}
                                        defaultValue={selectedAppCounsellor}
                                        loadOptions={fetchAppCounsellors}
                                        getOptionLabel={(e) => e.name}
                                        getOptionValue={(e) => e.id}
                                        placeholder={<div>Counsellor</div>}
                                        onChange={handleAppCounsellorSelect}
                                    />
                                } */}

                                {
                                    session?.data?.user?.role?.id != 6 &&
                                    <AsyncSelect
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), }}
                                        isClearable
                                        defaultOptions
                                        // isDisabled={!selectedCountries}
                                        // key={selectedCountries?.id}
                                        name='app_coordinator'
                                        value={selectedAppCoordinators}
                                        defaultValue={selectedAppCoordinators}
                                        loadOptions={fetchAppCoordinators}
                                        getOptionLabel={(e) => e.name}
                                        getOptionValue={(e) => e.id}
                                        placeholder={<div>App Coordinator</div>}
                                        onChange={handleAppCoordinatorSelect}
                                    />
                                }





                            </div>
                        </div>

                        {
                            applicationStagesLoading ?
                                <div className='application-stages-block'>
                                    <Skeleton variant='rounded' width={'100%'} height={200} />
                                </div>
                                :

                                <div className='application-stages-block'>
                                    {
                                        applicationStages?.data?.map((obj, index) => (

                                            <div key={index} className='application-stages-block-item'>
                                                <span>{obj?.application_count}</span>
                                                <h4>{obj?.name}</h4>
                                            </div>
                                        ))
                                    }
                                    {/* <div className='application-stages-block-item'>
                                <span>55</span>
                                <h4>Offer Rejection</h4>
                            </div>
                            <div className='application-stages-block-item'>
                                <span>124</span>
                                <h4>More Info Need</h4>
                            </div>
                            <div className='application-stages-block-item'>
                                <span>68</span>
                                <h4>Conditional Offer</h4>
                            </div>
                            <div className='application-stages-block-item'>
                                <span>24</span>
                                <h4>Unconditional Offer</h4>
                            </div>
                            <div className='application-stages-block-item'>
                                <span>138</span>
                                <h4>Differ</h4>
                            </div>
                            <div className='application-stages-block-item'>
                                <span>68</span>
                                <h4>Deposit paid</h4>
                            </div>
                            <div className='application-stages-block-item'>
                                <span>55</span>
                                <h4>Deposit paid</h4>
                            </div>
                            <div className='application-stages-block-item'>
                                <span>108</span>
                                <h4>Cash Received</h4>
                            </div>
                            <div className='application-stages-block-item'>
                                <span>110</span>
                                <h4>Visa Submitted</h4>
                            </div>
                            <div className='application-stages-block-item'>
                                <span>87</span>
                                <h4>Visa Rejected</h4>
                            </div>
                            <div className='application-stages-block-item'>
                                <span>29</span>
                                <h4>Visa Obtained</h4>
                            </div> */}
                                </div>
                        }


                        {/* <div className='graph'>
                            <BarChartComponent />
                        </div> */}
                    </div>

                </div>
            </div>



        </div>
    )
}

export default ApplicationSection
