import React from 'react'
import DoughnutChartComponent from '../../Charts/DoughnutChart'

function ApplicationSubmittedGraph() {
    return (
        <div >
            <div className='flex items-center justify-between' style={{ height: '180px' }}>
                <div>
                    Targets
                    <div> 40</div>
                </div>
                <DoughnutChartComponent />
                <div>
                    Achievd
                    <div> 40</div>
                </div>
            </div>
        </div>
    )
}

export default ApplicationSubmittedGraph
