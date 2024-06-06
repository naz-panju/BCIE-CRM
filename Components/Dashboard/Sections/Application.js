import React, { useEffect, useState } from 'react'
import BarChartComponent from '../Charts/BarChart'
import BarColorChartComponent from '../Charts/BarColorGraph'
import { DateRangePicker } from 'rsuite'
import AsyncSelect from "react-select/async";

function ApplicationSection() {
    const [range, setRange] = useState([null, null]);
    return (
        <div >
            <div className='weekly-leads'>

                <div  className='border flex'>
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

                    <div style={{ height: '100%' }} className='graph w-8/12 p-3 pt-0 '>
                        <div className='total_sec d-flex flex items-center justify-between p-3'>
                            Application Stages

                            <div className='flex items-center justify-between gap-2'>
                                <div className='intake_dropdown'>
                                    <AsyncSelect
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), }}
                                        placeholder='Counsellors'
                                        name={'Counsellors'}
                                        defaultValue='Counsellors'
                                        isClearable
                                        defaultOptions
                                    />
                                </div>

                                <div className='intake_dropdown'>
                                    <AsyncSelect
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), }}
                                        placeholder='Counsellors'
                                        name={'Counsellors'}
                                        defaultValue='Counsellors'
                                        isClearable
                                        defaultOptions
                                    />
                                </div>
                            </div>
                        </div>
                        

                        <div className='application-stages-block'>
                            <div className='application-stages-block-item'>
                                <span>103</span>
                                <h4>Offer Pending</h4>
                            </div>
                            <div className='application-stages-block-item'>
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

export default ApplicationSection
