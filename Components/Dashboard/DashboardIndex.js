import React, { useEffect, useState } from 'react'
import LeadSection from './Sections/Leads'
import CommunicationSection from './Sections/Communication'
import ApplicationSection from './Sections/Application'
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { ListingApi } from '@/data/Endpoints/Listing'
import AsyncSelect from "react-select/async";
import { useForm } from 'react-hook-form'
import { DateRangePicker } from 'rsuite'
import 'rsuite/dist/rsuite.min.css';


function DashboardIndex() {

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()


    const fetchIntakes = (e) => {
        return ListingApi.intakes({ keyword: e, }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }
    const fetchOffice = (e) => {
        return ListingApi.office({ keyword: e, }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }
    const handleinTakeChange = (data) => {
        setValue('intake', data || '')
    }

    const handleOfficeChange = (data) => {
        setValue('office', data || '')
    }

    const [range, setRange] = useState([null, null]);



    return (
        <>
            <section>
                <div className='page-title-block'>
                    <div className='page-title-block-content justify-between'>
                        <h1>Dashboard</h1>
                        <div className='flex justify-between'>
                            <Grid mr={2} sx={{ width: 200 }} className='intake_dropdown'>
                                <AsyncSelect
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), }}
                                    placeholder='Intakes'
                                    name={'intake'}
                                    defaultValue={watch('intake')}
                                    isClearable
                                    defaultOptions
                                    loadOptions={fetchIntakes}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    onChange={handleinTakeChange}
                                />
                            </Grid>

                            <Grid sx={{ width: 200 }} className='intake_dropdown'>
                                <AsyncSelect
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), }}
                                    placeholder='Office'
                                    name={'office'}
                                    defaultValue={watch('office')}
                                    isClearable
                                    defaultOptions
                                    loadOptions={fetchOffice}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    onChange={handleOfficeChange}
                                />
                            </Grid>

                            <Grid sx={{ width: 100 }} className='intake_dropdown'>
                                <DateRangePicker
                                    value={range}
                                    onChange={setRange}
                                    // placeholder="Select Date Range"
                                    style={{ width: 150 }}
                                    format='dd-MM-yyyy'
                                />
                            </Grid>
                        </div>
                    </div>
                </div>
                <div className='content-block'>
                    <div className='lead_sec'>
                        <LeadSection />
                    </div>
                    <div className='comm_sec'>
                        <CommunicationSection />
                    </div>
                    <div className='app_sec'>
                        <ApplicationSection />
                    </div>
                </div>
            </section>
        </>
    )
}

export default DashboardIndex
