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
import { DashboardApi } from '@/data/Endpoints/Dashboard'
import moment from 'moment'
import { useSession } from 'next-auth/react'


function DashboardIndex() {

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()

    const session = useSession()

    const [intakeId, setIntakeId] = useState();
    const handleinTakeChange = (data) => {
        handleIntakeDateRange(data?.name)
        setValue('intake', data || '')
        setIntakeId(data?.id)
    }
    const [intakeRefresh, setIntakerfersh] = useState(false)
    const [range, setRange] = useState([null, null]);
    const fetchIntakes = (e) => {
        return ListingApi.intakes({ keyword: e, }).then(response => {
            if (typeof response.data.data !== "undefined") {
                const allIntakes = response?.data?.data
                const defualtIntake = allIntakes?.find(obj => obj?.is_default == 1)
                setValue('intake', defualtIntake || '')
                setIntakeId(defualtIntake?.id)
                setIntakerfersh(true)
                // handleIntakeDateRange(defualtIntake?.name)
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    useEffect(() => {
        if (intakeId) {
            handleIntakeDateRange(watch('intake')?.name)
        }
    }, [intakeRefresh])


    const fetchOffice = (e) => {
        return ListingApi.office({ keyword: e, }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const [selectedCountries, setSelectedCountries] = useState();
    const handleCountrySelect = (data) => {
        setSelectedCountries(data)
        setSelectedUniversity()
    }
    const fetchCountries = (e) => {
        return ListingApi.universityCountries({ keyword: e }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const [selectedUniversity, setSelectedUniversity] = useState();
    const handleSelectUniversity = (data) => {
        setSelectedUniversity(data)
    }
    const fetchUniversities = (e) => {
        return ListingApi.universities({ keyword: e, country: selectedCountries?.id }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const [selectedCounsellor, setSelectedCounsellor] = useState();
    const handleCounsellorSelect = (data) => {
        setSelectedCounsellor(data)
    }

    // console.log(session?.data);
    const fetchCounsellors = (e) => {
        return ListingApi.users({ keyword: e, role_id: 5 }).then(response => {
            console.log(response);
            if (typeof response.data.data !== "undefined") {
                if (!selectedCounsellor) {
                    setSelectedCounsellor({ name: 'All', id: session?.data?.user?.id })
                }
                return [{ name: 'All', id: session?.data?.user?.id }, ...response.data.data];
            } else {
                return [];
            }
        })
    }

    const [selectedManager, setSelectedManager] = useState();
    const handleManagerSelect = (data) => {
        setSelectedManager(data)
    }
    const fetchManagers = (e) => {
        return ListingApi.users({ keyword: e, role_id: 4 }).then(response => {
            if (typeof response.data.data !== "undefined") {

                setSelectedManager(response?.data?.data[0])
                return response.data.data;
            } else {
                return [];
            }
        })
    }


    const [officeId, setOfficeId] = useState();
    const handleOfficeChange = (data) => {

        setValue('office', data || '')
        setOfficeId(data?.id)
    }

    const handleIntakeDateRange = (date) => {
        const dayBefore = moment(date).subtract(1, 'day');
        // console.log(dayBefore);

        if (dayBefore.month() === 11) {
            const adjustedDate = moment({ year: dayBefore.year(), month: 8, day: 1 });
            // console.log(adjustedDate);
            setRange([adjustedDate.toDate(), dayBefore.toDate()])
        } else if (dayBefore.month() === 5) {
            const adjustedDate = moment({ year: dayBefore.year(), month: 0, day: 1 })
            // console.log(adjustedDate);
            setRange([adjustedDate.toDate(), dayBefore.toDate()])
        }
        else if (dayBefore.month() === 8) {
            const adjustedDate = moment({ year: dayBefore.year(), month: 5, day: 1 })
            // console.log(adjustedDate);
            setRange([adjustedDate.toDate(), dayBefore.toDate()])
        }
    }

    // console.log(moment(watch('intake')?.name).format('DD-MM-YYYY'));


    // console.log(range);
    const [weeklyRange, setWeeklyRange] = useState([moment().subtract(7, 'days').toDate(), new Date()]);
    const [weeklyApplicationRange, setWeeklyApplicationRange] = useState([moment().subtract(7, 'days').toDate(), new Date()]);

    const [weeklyList, setWeeklyList] = useState([]);
    const [weeklyLoading, setWeeklyLoading] = useState(true)
    const fetchWeeklyList = async () => {
        setWeeklyLoading(true)
        try {
            const response = await DashboardApi.list({
                type: 'weekly_leads',
                week_starts_from: moment(weeklyRange[0]).format('YYYY-MM-DD'),
                week_ends_on: moment(weeklyRange[1]).format('YYYY-MM-DD'),
                office: officeId
            })
            setWeeklyList(response?.data)
            setWeeklyLoading(false)
        } catch (error) {
            console.log(error);
            setWeeklyLoading(false)
        }

    }
    const [weeklyStageList, setWeeklyStageList] = useState([]);
    const [weeklyStageListLoading, setWeeklyStageListLoading] = useState(true);
    const fetchWeeklyStageList = async () => {
        setWeeklyStageListLoading(true)
        try {
            const response = await DashboardApi.list({
                type: 'weekly_leads_by_stage',
                week_starts_from: moment(weeklyRange[0]).format('YYYY-MM-DD'),
                week_ends_on: moment(weeklyRange[1]).format('YYYY-MM-DD'),
                office: officeId
            })
            // console.log(response);
            setWeeklyStageList(response?.data)
            setWeeklyStageListLoading(false)
        } catch (error) {
            console.log(error);
            setWeeklyStageListLoading(false)
        }

    }
    const [leadSourceList, setLeadSourceList] = useState();
    const [leadSourceListLoading, setLeadSourceListLoading] = useState(true);
    const fetchLeadSource = async () => {
        setLeadSourceListLoading(true)
        try {
            const response = await DashboardApi.list({
                type: 'lead_by_source',
                date_from: moment(range[0]).format('YYYY-MM-DD'),
                date_to: moment(range[1]).format('YYYY-MM-DD'),
                office: officeId
            })
            // console.log(response);
            setLeadSourceList(response?.data)
            setLeadSourceListLoading(false)
        } catch (error) {
            console.log(error);
            setLeadSourceListLoading(false)
        }

    }

    const [leadStage, setLeadStage] = useState([]);
    const [leadStageLoading, setLeadStageLoading] = useState(true);
    const fetchLeadStage = async () => {
        setLeadStageLoading(true)
        try {
            const response = await DashboardApi.list({
                type: 'leads_by_stage',
                date_from: moment(range[0]).format('YYYY-MM-DD'),
                date_to: moment(range[1]).format('YYYY-MM-DD'),
                office: officeId
            })
            // console.log(response);
            setLeadStage(response?.data)
            setLeadStageLoading(false)
        } catch (error) {
            console.log(error);
            setLeadStageLoading(false)
        }
    }

    const [communicationLog, setCommunicationLog] = useState([]);
    const [communicationLogLoading, setCommunicationLogLoading] = useState(true);
    const fetchCommunicationLog = async () => {
        setCommunicationLogLoading(true)
        try {
            const response = await DashboardApi.list({
                type: 'communication_log',
                date_from: moment(range[0]).format('YYYY-MM-DD'),
                date_to: moment(range[1]).format('YYYY-MM-DD'),
                office: officeId,
                counselor: selectedCounsellor?.id
            })
            // console.log(response);
            setCommunicationLog(response?.data)
            setCommunicationLogLoading(false)
        } catch (error) {
            console.log(error);
            setCommunicationLogLoading(false)
        }
    }

    const [payments, setPayments] = useState([]);
    const [paymentLoading, setPaymentLoading] = useState(true);
    const fetchPayments = async () => {
        setPaymentLoading(true)
        try {
            const response = await DashboardApi.list({
                type: 'deposits',
                date_from: moment(range[0]).format('YYYY-MM-DD'),
                date_to: moment(range[1]).format('YYYY-MM-DD'),
                office: officeId,
                counselor: selectedCounsellor?.id
            })
            // console.log(response);
            setPayments(response?.data)
            setPaymentLoading(false)
        } catch (error) {
            console.log(error);
            setPaymentLoading(false)
        }
    }

    const [applicationStages, setApplicationStages] = useState([]);
    const [applicationStagesLoading, SetApplicationStagesLoading] = useState(true);
    const fetchApplicationStages = async () => {
        SetApplicationStagesLoading(true)
        try {
            const response = await DashboardApi.list({
                type: 'applications_by_stages',
                date_from: moment(range[0]).format('YYYY-MM-DD'),
                date_to: moment(range[1]).format('YYYY-MM-DD'),
                office: officeId,
                country: selectedCountries?.id
            })
            // console.log(response);
            setApplicationStages(response?.data)
            SetApplicationStagesLoading(false)
        } catch (error) {
            console.log(error);
            SetApplicationStagesLoading(false)
        }
    }

    const [weeklyApplicationList, setWeeklyApplicationList] = useState([]);
    const [weeklyApplicationLoading, setWeeklyApplicationLoading] = useState(true);
    const fetchWeeklyApplication = async () => {
        setWeeklyApplicationLoading(true)
        try {
            const response = await DashboardApi.list({
                type: 'weekly_applications',
                week_starts_from: moment(weeklyApplicationRange[0]).format('YYYY-MM-DD'),
                week_ends_on: moment(weeklyApplicationRange[1]).format('YYYY-MM-DD'),
                country: selectedCountries?.id,
                university: selectedUniversity?.id,
            })
            // console.log(response);
            setWeeklyApplicationList(response?.data)
            setWeeklyApplicationLoading(false)
        } catch (error) {
            console.log(error);
            setWeeklyApplicationLoading(false)
        }
    }

    const [submitApplicationList, setSubmitApplicationList] = useState([]);
    const [submitApplicationLoading, setSubmitApplicationLoading] = useState(true);
    const fetchsubmitApplication = async () => {
        setSubmitApplicationLoading(true)
        try {
            const response = await DashboardApi.list({
                type: 'applications_by_submitted_status',
                date_from: moment(weeklyApplicationRange[0]).format('YYYY-MM-DD'),
                date_to: moment(weeklyApplicationRange[1]).format('YYYY-MM-DD'),
                office: officeId,
                country: selectedCountries?.id
            })
            // console.log(response);
            setSubmitApplicationList(response?.data)
            setSubmitApplicationLoading(false)
        } catch (error) {
            console.log(error);
            setSubmitApplicationLoading(false)
        }
    }
    const [targets, setTargets] = useState([]);
    const [targetLoading, setTargetLoading] = useState(true);
    const fetchTargets = async () => {
        setTargetLoading(true)
        let params = {
            type: 'targets',
            intake: intakeId,
        }

        if (session?.data?.user?.role?.id == 3) {
            if (selectedManager) {
                try {
                    params['manager'] = selectedManager?.id
                    const response = await DashboardApi.list(params)
                    console.log(response);
                    setTargets(response?.data)
                    setTargetLoading(false)
                } catch (error) {
                    console.log(error);
                    setTargetLoading(false)
                }
            }
        }

        if (session?.data?.user?.role?.id == 4) {
            if (selectedCounsellor) {
                console.log(selectedCounsellor);
                try {
                    if (selectedCounsellor?.name == 'All') {
                        params['manager'] = selectedCounsellor?.id
                    } else {
                        params['counselor'] = selectedCounsellor?.id
                    }
                    const response = await DashboardApi.list(params)
                    console.log(response);
                    setTargets(response?.data)
                    setTargetLoading(false)
                } catch (error) {
                    console.log(error);
                    setTargetLoading(false)
                }
            }
        }

        if (session?.data?.user?.role?.id == 5) {
            if (selectedCounsellor) {
                console.log(selectedCounsellor);
                try {
                    params['counselor'] = session?.data?.user?.id
                    const response = await DashboardApi.list(params)
                    console.log(response);
                    setTargets(response?.data)
                    setTargetLoading(false)
                } catch (error) {
                    console.log(error);
                    setTargetLoading(false)
                }
            }
        }

    }

    useEffect(() => {
        fetchWeeklyList()
        fetchWeeklyStageList()
        fetchLeadSource()
    }, [weeklyRange, officeId])
    useEffect(() => {
        if (range[0]) {
            fetchLeadSource()
            fetchLeadStage()
        }
    }, [range, officeId])
    useEffect(() => {
        if (range[0]) {
            fetchCommunicationLog()
            fetchPayments()
        }
    }, [range, selectedCounsellor])
    useEffect(() => {
        if (range[0]) {
            fetchApplicationStages()
            fetchsubmitApplication()
        }
    }, [range, officeId, selectedCountries])
    useEffect(() => {
        fetchWeeklyApplication()
    }, [weeklyApplicationRange, selectedCountries, selectedUniversity])
    useEffect(() => {
        fetchTargets()
    }, [intakeId, selectedCounsellor, selectedManager])


    const handleClean = (event) => {
        // Prevent default behavior which clears the date
        event.preventDefault();
    };


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
                                    key={intakeRefresh}
                                    defaultValue={watch('intake')}
                                    // isClearable
                                    defaultOptions
                                    loadOptions={fetchIntakes}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    onChange={handleinTakeChange}
                                />
                            </Grid>

                            <Grid mr={2} sx={{ width: 200 }} className='intake_dropdown'>
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

                            <Grid sx={{ width: 230 }} className='intake_dropdown'>
                                <DateRangePicker
                                    className='no-clear'
                                    value={range}
                                    onChange={setRange}
                                    onClean={handleClean}
                                    ranges={[]}
                                    // placeholder="Select Date Range"
                                    // style={{ width: 150 }}
                                    format='dd-MM-yyyy'
                                />
                            </Grid>
                        </div>
                    </div>
                </div>
                <div className='content-block'>
                    {
                        session?.data?.user?.role?.id != 6 &&
                        <div className='lead_sec'>
                            <LeadSection weeklyList={weeklyList} weeklyLoading={weeklyLoading} weeklyStageListLoading={weeklyStageListLoading} leadSourceListLoading={leadSourceListLoading} leadStageLoading={leadStageLoading} weeklyRange={weeklyRange} setWeeklyRange={setWeeklyRange} weeklyStageList={weeklyStageList} leadSourceList={leadSourceList} leadStage={leadStage} />
                        </div>
                    }
                    {
                        session?.data?.user?.role?.id != 6 &&
                        <div className='comm_sec'>
                            <CommunicationSection fetchManagers={fetchManagers} handleManagerSelect={handleManagerSelect} selectedManager={selectedManager} communicationLogLoading={communicationLogLoading} paymentLoading={paymentLoading} targetLoading={targetLoading} fetchCounsellors={fetchCounsellors} selectedCounsellor={selectedCounsellor} handleCounsellorSelect={handleCounsellorSelect} communicationLog={communicationLog} payments={payments} targets={targets} />
                        </div>
                    }

                    <div className='app_sec'>
                        <ApplicationSection submitApplicationLoading={submitApplicationLoading} weeklyApplicationLoading={weeklyApplicationLoading} applicationStagesLoading={applicationStagesLoading} weeklyApplicationList={weeklyApplicationList} submitApplicationList={submitApplicationList} fetchUniversities={fetchUniversities} handleSelectUniversity={handleSelectUniversity} selectedUniversity={selectedUniversity} fetchCountries={fetchCountries} selectedCountries={selectedCountries} handleCountrySelect={handleCountrySelect} applicationStages={applicationStages} weeklyApplicationRange={weeklyApplicationRange} setWeeklyApplicationRange={setWeeklyApplicationRange} />
                    </div>
                </div>
            </section>
        </>
    )
}

export default DashboardIndex


// {[...Array(columns)].map((_, index) => (
//     <TableCell key={index} align="left">
//         <Skeleton variant='rounded' width={columnWidth} height={columnHeight} />
//     </TableCell>
// ))}

