import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-hot-toast';
import { ListingApi } from '@/data/Endpoints/Listing';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import AsyncSelect from "react-select/async";
import ReactSelector from 'react-select';
import { useForm } from 'react-hook-form';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});


export default function DocDeleteConfirmPopup({ ID, setID, clickFunc, title, loading, details }) {

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()


    // const fetchStages = (e) => {
    //     return ListingApi.agencies({ keyword: e, }).then(response => {
    //         if (typeof response.data.data !== "undefined") {
    //             // setstages(response.data.data)
    //             return response.data.data;
    //         } else {
    //             return [];
    //         }
    //     })
    // }

    const fetchStages = (e) => {
        return ListingApi.applicationStages({ keyword: e, id: details?.stage?.id }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const [open, setOpen] = React.useState(false);
    const [subStages, setsubStages] = useState([])


    const [formButtonStatus, setFormButtonStatus] = useState({
        loading: false,
        disabled: false,
    });

    const handleStageChange = (data) => {
        setValue('stage', data)
        setsubStages(data?.sub_stages)
        if (data?.sub_stages?.includes(watch('subStage'))) {
            setValue('subStage', '')
        } else {

        }
    }

    const [changeStage, setChangeStage] = useState(true);
    const handleCheckboxChange = (event) => {
        setChangeStage(event.target.checked);
    };


    const handleClose = () => {
        reset()
        setID();
        setOpen(false);
    };

    const initialValues = () => {
        // console.log(details);
        // isSubStage(details?.stage)
        setValue('stage', details?.stage)
        setValue('note', details?.stage_note)
        // setValue('subStage', details?.substage)

    }

    useEffect(() => {
        if (ID > 0) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [ID]);


    const memoizedOpen = useMemo(() => open, [open]);

    return (
        <div >
            <Dialog
                className='delete-doc-popup'
                open={memoizedOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{
                    style: {
                        // transform: 'translateY(-75%)',
                        // height:300
                    },
                }}
            >
                <DialogTitle>Are you sure want to delete this Document?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {title}
                    </DialogContentText>


                </DialogContent>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0 p-5 pt-0">
                    <div className='application-input'>
                        {/* <a className='form-text'>Select Stage</a> */}
                        <Grid className='mb-5 forms-data' >
                            <AsyncSelect
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                // isDisabled={!selectedUniversityId}
                                key={ID}
                                placeholder='Select Stage'
                                name={'stage'}
                                defaultValue={watch('stage')}
                                isClearable
                                defaultOptions
                                loadOptions={fetchStages}
                                getOptionLabel={(e) => e.name}
                                getOptionValue={(e) => e.id}
                                onChange={handleStageChange}
                            />
                            {errors.stage && <span className='form-validation'>{errors.stage.message}</span>}

                        </Grid>
                    </div>
                    {
                        watch('stage')?.sub_stages?.length > 0 &&
                        <div className='application-input'>
                            <a className='form-text'>Select Stage</a>
                            <Grid className='mb-5 forms-data' >
                                <ReactSelector
                                    onInputChange={subStages}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                    }}
                                    options={subStages}
                                    getOptionLabel={option => option.name}
                                    getOptionValue={option => option}
                                    value={
                                        subStages.find(options =>
                                            options.name === watch('subStage')
                                        )
                                    }
                                    name='subStage'

                                    defaultValue={(watch('subStage'))}
                                    onChange={(selectedOption) => setValue('subStage', selectedOption)}
                                />
                                {errors.substage && <span className='form-validation'>{errors.substage.message}</span>}
                            </Grid>
                        </div>
                    }
                    <div className='application-input'>
                        {/* <a className='form-text'>Select Stage</a> */}
                        <Grid className='mb-5 forms-data' >
                            <FormControlLabel
                                control={<Checkbox checked={changeStage} onChange={handleCheckboxChange} />}
                                label="Prevent all Other stage actions"
                            />

                        </Grid>
                    </div>
                </div>

                <DialogActions>
                    <Button size='small' onClick={handleClose} variant="outlined" color="inherit">
                        No
                    </Button>
                    <LoadingButton className='bg-sky-500 text-white hover:bg-sky-700' size='small' onClick={clickFunc} loading={loading} disabled={loading}
                        variant="contained" color='info' >Yes</LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}
