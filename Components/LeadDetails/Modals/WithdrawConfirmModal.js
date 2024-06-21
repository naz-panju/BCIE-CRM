import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-hot-toast';
import { Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { TaskApi } from '@/data/Endpoints/Task';
import { LeadApi } from '@/data/Endpoints/Lead';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function WithdrawPopup({ ID, setID, title, details, getDetails }) {

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()


    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = useState(false)


    const handleClose = () => {
        setID();
        setOpen(false);
        setValue('note')
        setLoading(false)
    };

    const handleComplete = async () => {
        setLoading(true)
        let dataToSubmit = {
            id: ID,
        }
        let action;

        if (details?.withdrawn != 1) {
            dataToSubmit['withdraw_reason'] = watch('note')
            action = LeadApi.withdraw(dataToSubmit)
        } else {
            action = LeadApi.withdrawResume(dataToSubmit)
        }

        action.then((response => {
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response.data.message)
                getDetails()
                handleClose()
                setLoading(false)
            } else {
                setLoading(false)
                toast.error(response.response?.data?.message)
                setLoading(false)
            }
            setLoading(false)
        }))
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
        <div>
            <Dialog
                open={memoizedOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{
                    style: {
                        width: 400,
                    },
                }}
            >
                <DialogTitle> {title}</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-slide-description">
                        {title}
                    </DialogContentText> */}


                    {
                        details?.withdrawn != 1 &&
                        <Grid display={'flex'} container item xs={12}>
                            <Grid item xs={12} md={12}>
                                <Typography sx={{ fontWeight: '500' }}>Reason</Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField multiline rows={2} fullWidth control={control}  {...register('note')}
                                    value={watch('note') || ''} />
                            </Grid>
                        </Grid>
                    }

                </DialogContent>
                <DialogActions>
                    <Button size='small' onClick={handleClose} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <LoadingButton onClick={handleComplete} className='bg-sky-500 text-white hover:bg-sky-700' size='small' loading={loading} disabled={loading}
                        variant="contained" color='info' >Confirm</LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}
