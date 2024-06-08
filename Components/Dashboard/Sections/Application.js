import React, { useEffect, useState } from 'react'
import BarChartComponent from '../Charts/BarChart'
import BarColorChartComponent from '../Charts/BarColorGraph'
import { DateRangePicker } from 'rsuite'
import AsyncSelect from "react-select/async";
import { Skeleton } from '@mui/material';

function ApplicationSection({ weeklyApplicationLoading, applicationStagesLoading, fetchUniversities, handleSelectUniversity, selectedUniversity, fetchCountries, selectedCountries, handleCountrySelect, applicationStages, weeklyApplicationRange, setWeeklyApplicationRange }) {
    const [range, setRange] = useState([null, null]);
    return (
        <div >
            <div className='weekly-leads'>

                <div className='border flex'>
                    <div style={{ height: '100%' }} className='graph w-4/12 border-r'>
                        <div className='total_sec h-14 border-b-2 d-flex flex items-center justify-between p-3'>
                            <div className='total'><span>Total</span> 300</div>
                            <div className='date-range'>
                                <DateRangePicker
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
