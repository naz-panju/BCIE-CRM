import React from 'react'
import BarChartComponent from '../Charts/BarChart'
import BarColorChartComponent from '../Charts/BarColorGraph'

function ApplicationSection() {
    return (
        <div >
            <div className='weekly-leads'>

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

                    <div style={{ height: '100%' }} className='graph w-8/12 p-3'>
                        <div className='total_sec d-flex flex items-center justify-between p-3'>
                            Application Stages
                        </div>
                        <div className='border rounded-sm h-5/6 w-6/6'>


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
