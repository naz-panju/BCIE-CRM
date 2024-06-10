import React from 'react'
import DoughnutChartComponent from '../../Charts/DoughnutChart'

function ApplicationSubmittedGraph({ data }) {
    return (
        <div >
            <div className='flex items-center justify-between' style={{ height: '180px' }}>
<<<<<<< HEAD
                <div className='target-inner-item'>
                    <div className='target-inner-item-title target'>Targets</div>
                    <h3> 40</h3>
                </div>
                <DoughnutChartComponent />
                <div className='target-inner-item'>
                    <div className='target-inner-item-title acheived'>Acheived</div>
                    <h3>55</h3>
=======
                <div>
                    Targets
                    <div> {data?.target || 0}</div>
                </div>
                <DoughnutChartComponent data={data} />
                <div>
                    Achievd
                    <div> {data?.achievement || 0}</div>
>>>>>>> 11346ce4f5b68d6b8790ec2fc3667fa32f65c800
                </div>
            </div>
        </div>
    )
}

export default ApplicationSubmittedGraph
