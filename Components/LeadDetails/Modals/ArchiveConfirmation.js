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
import { LeadApi } from '@/data/Endpoints/Lead';
import { Drawer, Grid, IconButton, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { StudentApi } from '@/data/Endpoints/Student';
import SelectX from '@/Form/SelectX';
import { ListingApi } from '@/data/Endpoints/Listing';
import { Close } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function ArchiveConfirmPopup({ ID, setID, setLoading, title, loading, details, getDetails }) {

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()


    const [open, setOpen] = React.useState(false);
    const [formButtonStatus, setFormButtonStatus] = useState({
        loading: false,
        disabled: false,
    });

    const fetchReasons = (e) => {
        return ListingApi.archiveReason({ keyword: e }).then(response => {
            if (response?.status == 200 || response?.status == 201) {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }


    const handleClose = () => {
        setID();
        setOpen(false);
    };

    const ArchiveLead = () => {
        setLoading(true)
        let dataToSubmit = {
            id: ID
        }

        let action;
        if (details?.closed == 1) {
            action = LeadApi.reOpenLead(dataToSubmit)
        } else {
            dataToSubmit['archive_note'] = watch('note')
            dataToSubmit['archive_reason'] = watch('reason')?.reason
            console.log(dataToSubmit);
            action = LeadApi.closeLead(dataToSubmit)
        }
        action.then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response?.data?.message)
                setID()
                getDetails()
                setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
                setLoading(false)
            }
        }).catch((error) => {
            console.log(error);
            setLoading(false)
        })
    }

    useEffect(() => {
        if (ID > 0) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [ID]);


    const memoizedOpen = useMemo(() => open, [open]);
    const anchor = 'right'; // Set anchor to 'right'

    return (
        <div>
            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleClose}
            >
                <Grid width={550}>
                    <Grid className='modal_title d-flex align-items-center'>
                        <a className='back_modal' onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                            </svg>
                        </a>
                        <a className='back_modal_head'>{details?.closed == 1 ? 'Unarchive' : 'Archive'} {title}</a>

                    </Grid>
                    <div className='form-data-cntr'>

                        <div class="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                            <div className='application-input'>
                                <a className='form-text'>Note</a>
                                {/* className='form_group */}
                                <Grid className='mb-5 forms-data' >

                                    <TextField multiline rows={2} fullWidth control={control}  {...register('note')}
                                        value={watch('note') || ''} />

                                </Grid>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                            <div className='application-input'>
                                <a className='form-text'>Reasons</a>
                                {/* className='form_group */}
                                <Grid className='mb-5 forms-data' >
                                    <SelectX
                                        // placeholder='Reasons'
                                        // menuPlacement='top'
                                        loadOptions={fetchReasons}
                                        control={control}
                                        // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
                                        // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
                                        name={'reason'}
                                        defaultValue={watch('reason')}
                                    />

                                </Grid>
                            </div>
                        </div>

                        <Grid pb={3}  >
                            <LoadingButton onClick={ArchiveLead} className='save-btn' loading={loading} disabled={loading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>
                                {
                                    loading ?
                                        <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                        :
                                        <>
                                            Confirm <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </>
                                }
                            </LoadingButton>
                            <Button className='cancel-btn' onClick={handleClose} size='small' sx={{ textTransform: 'none', mr: 2 }} variant='outlined'> Cancel <svg svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                            </svg></Button>

                        </Grid>

                    </div>
                    {/* <DialogActions>
                        <Button size='small' onClick={handleClose} variant="outlined" color="inherit">
                            Cancel
                        </Button>
                        <LoadingButton className='bg-sky-500 text-white hover:bg-sky-700' size='small' onClick={ArchiveLead} loading={loading} disabled={loading}
                            variant="contained" color='info' >Confirm</LoadingButton>
                    </DialogActions> */}
                </Grid>
            </Drawer>
        </div>
    );
}
