import { ListingApi } from '@/data/Endpoints/Listing';
import { Box, Grid, Paper } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form';
import AsyncSelect from "react-select/async";
import ReactSelector from 'react-select';


function GoalsTable() {

    const { watch, setValue } = useForm()


    const fetchUser = (e) => {
        return ListingApi.users({ keyword: e }).then(response => {
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


    return (
        <>
            <Grid p={1} pl={0} mb={1} container display={'flex'}>
                <Grid width={300} mr={1} item md={2.5}>
                    <AsyncSelect
                        isClearable
                        defaultOptions
                        loadOptions={fetchUser}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        placeholder={<div>Counseller</div>}
                    // onChange={handleAssignedTo}
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

            <Box mt={3} sx={{ width: '100%' }}>
                <a style={{fontSize:'18px'}}>Target</a>
                <Paper sx={{ width: '100%', mb: 2, border: '1px solid grey' }}>

                    <Grid height={150} width={'100%'}>

                    </Grid>
                </Paper>
            </Box>
            <Box mt={3} sx={{ width: '100%' }}>
                <a style={{fontSize:'18px'}}>Current Status </a>
                <Paper sx={{ width: '100%', mb: 2, border: '1px solid grey' }}>

                    <Grid height={150} width={'100%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Grid display={'flex'} flexDirection={'column'}>
                            {/* <a style={{fontSize:'17px'}}>Lead</a>
                            <a style={{fontSize:'17px'}}>100</a> */}
                        </Grid>

                    </Grid>
                </Paper>
            </Box>
        </>
    )
}

export default GoalsTable
