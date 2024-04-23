import { ListingApi } from '@/data/Endpoints/Listing';
import { Box, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import AsyncSelect from "react-select/async";
import ReactSelector from 'react-select';
import { GoalsApi } from '@/data/Endpoints/GoalsAndTargets';


function GoalsTable() {

    const { watch, setValue } = useForm()

    const [datas, setdatas] = useState()
    const [councellorId, setcouncellorId] = useState()

    const fetchUser = (e) => {
        return ListingApi.users({ keyword: e, role_id: 5 }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const Periods = [
        { name: 'This Month' },
        { name: 'Last Month' },
        { name: 'Last 3 Month' },
        { name: 'This Year' },
        { name: 'Last Year' },
    ]

    const fetchDatas = () => {
        GoalsApi.list({counselor:councellorId}).then((response) => {
            setdatas(response?.data?.data)
        })
    }

    const handleCouncellor = (data) => {
        setValue('councellor', data)
        setcouncellorId(data?.id)
    }

    // console.log(datas);

    useEffect(() => {
        fetchDatas()
    }, [councellorId])



    return (
        <>
            <Grid p={1} pl={0} mb={1} container display={'flex'}>
                <Grid width={300} mr={1} item md={2.5}>
                    <AsyncSelect
                        name='councellor'
                        defaultValue={watch('councellor')}
                        isClearable
                        defaultOptions
                        loadOptions={fetchUser}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        placeholder={<div>Counseller</div>}
                        onChange={handleCouncellor}
                    />
                </Grid>

                <Grid mr={1} item md={2.5}>
                    <ReactSelector
                        placeholder={'Periods'}
                        onInputChange={Periods}
                        styles={{ menu: provided => ({ ...provided, zIndex: 9999 }) }}
                        options={Periods}
                        getOptionLabel={option => option.name}
                        getOptionValue={option => option.name}
                        value={
                            Periods.filter(options =>
                                options?.name == watch('period')
                            )
                        }
                        name='period'
                        isClearable
                        defaultValue={(watch('period'))}
                        onChange={(selectedOption) => setValue('period', selectedOption?.name)}
                    />
                </Grid>
            </Grid>
            {/* {
                loading ?
                    <LoadingTable columns={3} columnWidth={100} columnHeight={20} rows={10} rowWidth={200} rowHeight={20} />
                    :
            } */}

            <Grid mt={3} sx={{ width: '100%', textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'start', paddingLeft: 2 }}>
                    Target
                </Typography>
                <Paper sx={{ width: '100%', mb: 2, border: '1px solid grey' }}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={3}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6">Leads</Typography>
                                <Typography variant="body1">{datas?.target_leads || 0}</Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={3}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6">Students</Typography>
                                <Typography variant="body1">{datas?.target_students || 0}</Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={3}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6">Application</Typography>
                                <Typography variant="body1">{datas?.target_applications || 0}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6">Payments</Typography>
                                <Typography variant="body1">{datas?.target_payments || 0}</Typography>
                            </Paper>
                        </Grid>

                    </Grid>
                </Paper>
            </Grid>


            <Grid mt={3} sx={{ width: '100%', textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'start', paddingLeft: 2 }}>
                    Goals
                </Typography>
                <Paper sx={{ width: '100%', mb: 2, border: '1px solid grey' }}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={3}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6">Leads</Typography>
                                <Typography variant="body1">{datas?.achived_leads || 0}</Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={3}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6">Students</Typography>
                                <Typography variant="body1">{datas?.achived_students || 0}</Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={3}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6">Application</Typography>
                                <Typography variant="body1">{datas?.achived_applications || 0}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6">Payments</Typography>
                                <Typography variant="body1">{datas?.achived_payments || 0}</Typography>
                            </Paper>
                        </Grid>

                    </Grid>
                </Paper>
            </Grid>
        </>
    )
}

export default GoalsTable
