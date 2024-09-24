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
import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import AsyncSelect from "react-select/async";
import { useForm } from 'react-hook-form';
import { ListingApi } from '@/data/Endpoints/Listing';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function DepositConfirmPopup({ ID, setID, clickFunc, title, loading, stageChangeFunction, setdeletableData, delatableData }) {    
    
    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()

    const [open, setOpen] = React.useState(false);
    const [formButtonStatus, setFormButtonStatus] = useState({
        loading: false,
        disabled: false,
    });

    const [subStages, setsubStages] = useState([])

    const fetchStages = (e) => {
        return ListingApi.stages({ keyword: e, type: 'application' }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const handleStageChange = (data) => {
        setValue('stage', data)
        setsubStages(data?.sub_stages)
        if (data?.sub_stages?.includes(watch('subStage'))) {
            setValue('subStage', '')
        } else {

        }
    }

    const [changeStage, setChangeStage] = useState(false);
    const handleCheckboxChange = (event) => {
        setChangeStage(event.target.checked);
    };

    const handleClose = () => {
        setID();
        setOpen(false);
        setdeletableData()
    };

    const onSubmit = () => {
        if (delatableData?.university_deposit_document?.id) {
            stageChangeFunction(watch('stage'))
        } else {
            clickFunc()
        }
    }

    useEffect(() => {
        if (ID > 0) {
            setOpen(true);
        } else {
            handleClose()
            setOpen(false);
        }
    }, [ID]);


    const memoizedOpen = useMemo(() => open, [open]);

    return (
        <div>
            <Dialog
                className='delete-doc-popup'
                open={memoizedOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{
                    style: {
                        transform: 'translateY(-75%)',
                    },
                }}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent style={{ overflowY: 'unset' }}>
                    {/* <DialogContentText id="alert-dialog-slide-description">
                        {title}
                    </DialogContentText> */}

                    {
                        delatableData?.university_deposit_document?.id &&
                        <div className='application-input'>
                            {/* <a className='form-text'>Select Stage</a> */}
                            <Grid className='mb-5 forms-data' >
                                <FormControlLabel
                                    control={<Checkbox checked={changeStage} onChange={handleCheckboxChange} />}
                                    label="Do you want to change stage?"
                                />

                            </Grid>
                        </div>
                    }
                    {
                        changeStage &&
                        <div className='application-input'>
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
                    }
                </DialogContent>
                <DialogActions>
                    <Button size='small' onClick={handleClose} variant="outlined" color="inherit">
                        No
                    </Button>
                    <LoadingButton className='bg-sky-500 text-white hover:bg-sky-700' size='small' onClick={onSubmit} loading={loading} disabled={loading}
                        variant="contained" color='info' >Yes</LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}
