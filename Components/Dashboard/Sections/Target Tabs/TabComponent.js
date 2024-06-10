import React from 'react'
import DoughnutChartComponent from '../../Charts/DoughnutChart'

function ApplicationSubmittedGraph({ data }) {
    return (
        <div >
            <div className='flex items-center justify-between' style={{ height: '180px' }}>
                <div className='target-inner-item'>
                    <div className='target-inner-item-title target'>Targets</div>
                    <h3> {data?.target || 0}</h3>
                </div>
                <DoughnutChartComponent />
                <div className='target-inner-item'>
                    <div className='target-inner-item-title acheived'>Acheived</div>
                    <h3>{data?.achievement || 0}</h3>
                </div>
            </div>
        </div>
    )
}

export default ApplicationSubmittedGraph
