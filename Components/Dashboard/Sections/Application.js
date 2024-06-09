import React, { useEffect, useState } from 'react'
import BarChartComponent from '../Charts/BarChart'
import BarColorChartComponent from '../Charts/BarColorGraph'
import { DateRangePicker } from 'rsuite'
import AsyncSelect from "react-select/async";
import { Skeleton } from '@mui/material';
import { useSession } from 'next-auth/react';

function ApplicationSection({ submitApplicationLoading, weeklyApplicationLoading, applicationStagesLoading, fetchUniversities, handleSelectUniversity, selectedUniversity, fetchCountries, selectedCountries, handleCountrySelect, applicationStages, weeklyApplicationRange, setWeeklyApplicationRange, submitApplicationList }) {

    const session = useSession()

    const handleDateRangeChange = (range) => {
        const [startDate, endDate] = range;
        if (startDate && endDate) {
          const daysDifference = endDate.diff(startDate, 'days');
          if (daysDifference === 6) { // 6 days difference means 7 days inclusive
            setWeeklyApplicationRange(range);
          } else {
            alert('Please select a range of exactly 7 days.');
          }
        } else {
          setWeeklyApplicationRange(range);
        }
      };

    return (
        <div >
            <div className='weekly-leads'>

                <div className='border flex'>
                    {
                        session?.data?.user?.role?.id == 6 ?
                            submitApplicationLoading ?
                                <Skeleton variant='rounded' width={450} height={200} />
                                :
                                <div style={{ height: '100%' }} className='stage w-5/12 flex items-center justify-evenly mt-10'>
                                    <div className='card border weekly-card rounded-sm h-5/6 w-2/8 flex items-center flex-column justify-between bg2'>
                                        <div>

                                        </div>
                                        <div>
                                            <h3> {submitApplicationList?.data?.returned}</h3>
                                            Application
                                        </div>

                                        <span className='Hot btn-stage'>Returned</span>
                                    </div>
                                    <div className='card border weekly-card rounded-sm h-5/6 w-2/8 flex items-center flex-column justify-between bg3'>
                                        <div>

                                        </div>
                                        <div>
                                            <h3> {submitApplicationList?.data?.submitted}</h3>
                                            Application
                                        </div>

                                        <span className='cool btn-stage'>Submitted</span>
                                    </div>
                                    <div className='card border weekly-card rounded-sm h-5/6 w-2/8 flex items-center flex-column justify-between bg4'>
                                        <div>

                                        </div>
                                        <div>
                                            <h3> {submitApplicationList?.data?.unsubmitted}</h3>
                                            Application

                                        </div>

                                        <span className='warm btn-stage'>Unsubmitted</span>
                                    </div>
                                </div>
                            :

                            <div style={{ height: '100%' }} className='graph w-4/12 border-r'>
                                <div className='total_sec h-14 border-b-2 d-flex flex items-center justify-between p-3'>
                                    <div className='total'><span>Total</span> 300</div>
                                    <div className='date-range'>
                                        <DateRangePicker
                                            className='no-clear'
                                            ranges={[]}
                                            value={weeklyApplicationRange}
                                            onChange={setWeeklyApplicationRange}
                                            // placeholder="Select Date Range"
                                            style={{ width: 220 }}
                                            format='dd-MM-yyyy'
                                            
                                        />
                                    </div>
                                </div>
                                {
                                    weeklyApplicationLoading ?
                                        <div className='graph'>
                                            <Skeleton variant='rounded' width={'100%'} height={200} />
                                        </div>
                                        :
                                        <div className='graph'>
                                            <BarChartComponent />
                                        </div>
                                }
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
