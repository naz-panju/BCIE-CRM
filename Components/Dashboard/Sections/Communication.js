import React from 'react'
import DoughnutChartComponent from '../Charts/DoughnutChart'
import Mail from '@/img/mail.svg'
import Message from '@/img/message.svg'
import Phone from '@/img/phone.svg'
import Deposit from '@/img/Deposit.svg'
import Pending from '@/img/Pending.svg'
import Image from 'next/image';
import AsyncSelect from "react-select/async";

function CommunicationSection() {
  return (
    <div >


      <div className='weekly-leads communication mt-4'>

        <div className='flex '>
          <div className=' w-7/12'>
            <div className='flex justify-between'>
              <div className=' w-5/12'> 
                <div className='comminication-block'>
                  <div className='section-title'>Communications</div>
                    <div className='flex justify-between'>
                      <div className=' w-6/12'>
                        <div className='communication-graph'>
                          <div className='chart-info-title'>
                            <div className='total'><span>Total</span></div>
                          </div>
                            <h2>120</h2>
                            <h4>Logs</h4>
                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="156" height="34" viewBox="0 0 156 34" fill="none"><path d="M-97.4882 19.8504C-88.59 19.8662 -88.6086 30.3994 -79.7104 30.4151C-70.8122 30.4308 -70.8338 42.7197 -61.9357 42.7353C-53.0375 42.751 -53.022 33.9733 -44.1238 33.989C-35.2256 34.0047 -35.2101 25.2269 -26.3119 25.2426C-17.4137 25.2583 -17.4176 27.4528 -8.51941 27.4685C0.378786 27.4841 0.373367 30.5564 9.27156 30.5721C18.1698 30.5877 18.1976 14.7878 27.0958 14.8035C35.994 14.8192 35.9763 24.9136 44.8744 24.9293C53.7726 24.945 53.7997 9.58389 62.6979 9.59958C71.5961 9.61528 71.593 11.3708 80.4912 11.3865C89.3894 11.4022 89.3739 20.18 98.2721 20.1957C107.17 20.2114 107.152 30.7447 116.05 30.7604C124.948 30.7761 125.369 18.8874 133.877 13.2363C140.145 9.0732 142.791 4.47419 151.689 4.48991C160.587 4.50563 160.578 9.77226 169.476 9.78796C178.374 9.80365 187.288 1.04156 196.186 1.05725C205.085 1.07293 205.075 6.3396 213.973 6.3553C222.872 6.37099 223.95 25.684 231.736 25.6978C239.522 25.7115 240.656 13.4246 249.554 13.4403C258.452 13.456 258.44 20.4782 267.338 20.4939C276.236 20.5096 276.248 13.4874 285.147 13.5031C294.045 13.5188 291.841 1.66486 302.964 1.68448" stroke="#8710FF" stroke-width="2"/></svg>

                            <div className='svg-bg'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="156" height="62" viewBox="0 0 156 62" fill="none"><path d="M-79.6596 29.4148C-88.5578 29.3991 -88.5392 18.8659 -97.4374 18.8502L-97.5162 63.5168C-97.524 67.935 -93.9486 71.5231 -89.5303 71.5309L294.888 72.2089C299.307 72.2167 302.895 68.642 302.903 64.2237L303.015 0.684233C291.892 0.664614 294.096 12.5185 285.197 12.5028C276.299 12.4871 276.287 19.5093 267.389 19.4936C258.49 19.4779 258.503 12.4557 249.605 12.44C240.706 12.4243 239.572 24.7112 231.786 24.6975C224.001 24.6838 222.922 5.37075 214.024 5.35505C205.126 5.33936 205.135 0.0726878 196.237 0.0570029C187.339 0.0413179 178.425 8.80341 169.527 8.78772C160.629 8.77202 160.638 3.50539 151.74 3.48967C142.842 3.47394 140.196 8.07296 133.928 12.236C125.42 17.8872 124.999 29.7758 116.101 29.7602C107.203 29.7445 107.221 19.2112 98.3229 19.1955C89.4247 19.1798 89.4402 10.402 80.542 10.3863C71.6438 10.3706 71.6469 8.61504 62.7487 8.59934C53.8505 8.58364 53.8234 23.9447 44.9252 23.929C36.027 23.9134 36.0448 13.8189 27.1466 13.8032C18.2484 13.7876 18.2205 29.5875 9.32234 29.5718C0.424145 29.5561 0.429564 26.4839 -8.46862 26.4682C-17.3668 26.4525 -17.3629 24.2581 -26.2611 24.2424C-35.1593 24.2267 -35.1748 33.0044 -44.073 32.9888C-52.9712 32.9731 -52.9867 41.7508 -61.8849 41.7351C-70.7831 41.7194 -70.7614 29.4305 -79.6596 29.4148Z" fill="url(#paint0_linear_10_992)"/><defs><linearGradient id="paint0_linear_10_992" x1="102.806" y1="-0.107796" x2="102.679" y2="71.8699" gradientUnits="userSpaceOnUse"><stop stop-color="#C082FF" stop-opacity="0.3"/><stop offset="0.524" stop-color="#FCDFFF" stop-opacity="0"/></linearGradient></defs></svg>
                            </div>

                        </div>
                      </div>
                      <div className=' w-5/12'>
                        <div className='communication-details'>
                          <ul>
                            <li><Image src={Mail} alt='Mail' width={22} height={22} /><b>5</b>Emails</li>
                            <li><Image src={Phone} alt='Mail' width={22} height={22} /><b>10</b>Calls</li>
                            <li><Image src={Message} alt='Mail' width={22} height={22} /><b>30</b>Messages</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              <div className=' w-5/12'> 
                <div className='comminication-block'>
                  <div className='section-title'>Payments</div>
                    <div className='flex justify-between'>
                      <div className=' w-6/12'>
                        <div className='communication-graph'>
                          <div className='chart-info-title'>
                            <div className='total'><span>Total</span></div>
                          </div>
                            <h2>$30K</h2>
                            <h4>Amount Received</h4>
                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="156" height="30" viewBox="0 0 156 30" fill="none">  <path d="M-95 20.3111C-87.9778 20.3112 -87.9778 30.8444 -80.9556 30.8444C-73.9333 30.8444 -73.9333 43.1333 -66.9111 43.1333C-59.8889 43.1333 -59.8889 34.3556 -52.8667 34.3556C-45.8445 34.3556 -45.8445 25.5778 -38.8222 25.5778C-31.8 25.5778 -31.8 27.7722 -24.7778 27.7722C-17.7556 27.7722 -17.7556 30.8445 -10.7333 30.8445C-3.71113 30.8444 -3.71113 15.0445 3.3111 15.0445C10.3333 15.0445 10.3334 25.1389 17.3556 25.1389C24.3778 25.1389 24.3778 9.77778 31.4 9.77778C38.4222 9.77778 38.4222 11.5334 45.4445 11.5334C52.4667 11.5334 52.4667 20.3111 59.4889 20.3111C66.5111 20.3111 66.5111 30.8444 73.5334 30.8445C80.5556 30.8445 80.8711 18.9551 87.5778 13.2889C92.5184 9.11479 94.6 4.51112 101.622 4.51114C108.644 4.51117 108.644 9.77781 115.667 9.77781C122.689 9.77781 129.711 1.00001 136.733 1C143.756 0.99999 143.756 6.26667 150.778 6.26667C157.8 6.26667 158.678 25.5778 164.822 25.5778C170.967 25.5778 171.844 13.2889 178.867 13.2889C185.889 13.2889 185.889 20.3111 192.911 20.3111C199.933 20.3111 199.933 13.2889 206.956 13.2889C213.978 13.2889 212.222 1.43889 221 1.43889" stroke="#22C55E" stroke-width="2"/></svg>

                            <div className='svg-bg'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="156" height="58" viewBox="0 0 156 58" fill="none"><path d="M-80.9556 29.8444C-87.9778 29.8444 -87.9778 19.3112 -95 19.3111V63.9778C-95 68.3961 -91.4183 71.9778 -87 71.9778H213C217.418 71.9778 221 68.3967 221 63.9784V0.438889C212.222 0.438889 213.978 12.2889 206.956 12.2889C199.933 12.2889 199.933 19.3111 192.911 19.3111C185.889 19.3111 185.889 12.2889 178.867 12.2889C171.844 12.2889 170.967 24.5778 164.822 24.5778C158.678 24.5778 157.8 5.26667 150.778 5.26667C143.756 5.26667 143.756 -1.02023e-05 136.733 0C129.711 1.02023e-05 122.689 8.77781 115.667 8.77781C108.644 8.77781 108.644 3.51117 101.622 3.51114C94.6 3.51112 92.5184 8.11479 87.5778 12.2889C80.8711 17.9551 80.5556 29.8445 73.5334 29.8445C66.5111 29.8444 66.5111 19.3111 59.4889 19.3111C52.4667 19.3111 52.4667 10.5334 45.4445 10.5334C38.4222 10.5334 38.4222 8.77778 31.4 8.77778C24.3778 8.77778 24.3778 24.1389 17.3556 24.1389C10.3334 24.1389 10.3333 14.0444 3.3111 14.0445C-3.71113 14.0445 -3.71113 29.8444 -10.7334 29.8445C-17.7556 29.8445 -17.7556 26.7722 -24.7778 26.7722C-31.8 26.7722 -31.8 24.5778 -38.8222 24.5778C-45.8445 24.5778 -45.8445 33.3556 -52.8667 33.3556C-59.8889 33.3556 -59.8889 42.1333 -66.9111 42.1333C-73.9333 42.1333 -73.9333 29.8444 -80.9556 29.8444Z" fill="url(#paint0_linear_10_903)"/>  <defs><linearGradient id="paint0_linear_10_903" x1="63" y1="0" x2="63" y2="71.9778" gradientUnits="userSpaceOnUse"><stop stop-color="#22C55E" stop-opacity="0.1"/><stop offset="1" stop-color="#22C55E" stop-opacity="0"/></linearGradient></defs></svg>
                            </div>

                        </div>
                      </div>
                      <div className=' w-5/12'>
                        <div className='communication-details'>
                          <ul>
                            <li><Image src={Deposit} alt='Mail' width={22} height={22} /><b>5</b>Deposit Paid</li>
                            <li><Image src={Pending} alt='Mail' width={22} height={22} /><b>10</b>Pending</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div  className='graph w-5/12'>
            <div className='total_sec d-flex flex items-center justify-between pb-3'>
              Targets


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
