import React from 'react'
import DoughnutChartComponent from '../../Charts/DoughnutChart'

function ApplicationSubmittedGraph({ data }) {
    return (
        <div >
            <div className='flex items-center justify-between' style={{ height: '180px' }}>
                <div>
                    Targets
                    <div> {data?.target || 0}</div>
                </div>
                <DoughnutChartComponent data={data} />
                <div>
                    Achievd
                    <div> {data?.achievement || 0}</div>
                </div>
            </div>
        </div>
    )
}

export default ApplicationSubmittedGraph
