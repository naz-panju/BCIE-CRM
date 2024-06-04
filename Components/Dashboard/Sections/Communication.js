import React from 'react'
import DoughnutChartComponent from '../Charts/DoughnutChart'

function CommunicationSection() {
  return (
    <div >


      <div className='weekly-leads mt-4'>

        <div style={{ height: 300 }} className='border flex'>
          <div style={{ height: '100%' }} className='graph w-5/12 p-3'>
            <div className='total_sec d-flex flex items-center justify-between p-3'>
              Communications
            </div>
            <div className='border rounded-sm h-4/5'>
              <div className='container'>

              </div>
            </div>

          </div>
          <div style={{ height: '100%' }} className='graph w-5/12 p-3'>
            <div className='total_sec d-flex flex items-center justify-between p-3'>
              Payments
            </div>
            <div className='border rounded-sm h-4/5'>
              <div className='container'>

              </div>
            </div>

          </div>

          <div style={{ height: '100%' }} className='graph w-6/12 p-3'>
            <div className='total_sec d-flex flex items-center justify-between p-3'>
              Targets
            </div>
            <div className='border rounded-sm h-4/5'>
                <DoughnutChartComponent />
              <div className=''>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default CommunicationSection
