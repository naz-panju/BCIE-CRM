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
import { Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { StudentApi } from '@/data/Endpoints/Student';
import SelectX from '@/Form/SelectX';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function DocumentRejectPopup({ ID, setID, setLoading, title, loading, details, getDetails ,lead_id}) {

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()


    const [open, setOpen] = React.useState(false);
    const [formButtonStatus, setFormButtonStatus] = useState({
        loading: false,
        disabled: false,
    });



    const handleClose = () => {
        setID();
        setValue('note','')
        setOpen(false);
    };

    const [checked, setchecked] = useState(true)
    const handleCheckboxChange = (event) => {
        setchecked(event.target.checked)
    };

    console.log(details);

    const onSubmit = () => {
        setLoading(true)
        let dataToSubmit = {
            id: ID,
            reject_reason: watch('note')
        }

        LeadApi.rejectDocument(dataToSubmit).then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                if (checked) {
                    LeadApi.requestDocument({
                        lead_id: lead_id,
                        document_template_ids: [details?.document_template?.id]
                    }).then((response) => {
                        if (response?.status == 200 || 201) {
                            toast.success('Document has been Rejected and Re Requested')
                            setID()
                            getDetails()
                            setLoading(false)
                        } else {
                            toast.error(response?.response?.data?.message)
                            setLoading(false)
                        }
                    })
                } else {
                    toast.success(response?.data?.message)
                    setID()
                    getDetails()
                    setLoading(false)
                }
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
                    <div className='application-input'>
                        <a className='form-text'>Note</a>
                        {/* className='form_group */}
                        <Grid className='mb-1 forms-data' >
                            <TextField multiline rows={2} fullWidth control={control}  {...register('note')}
                                value={watch('note') || ''} />
                        </Grid>
                    </div>

                    <div className='application-input'>
                        {/* <a className='form-text'>Re Request</a> */}
                        <FormControlLabel control={<Checkbox checked={checked} onChange={handleCheckboxChange} />} label="Re Request" />

                    </div>

                </DialogContent>
                <DialogActions>
                    <Button size='small' onClick={handleClose} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <LoadingButton className='bg-sky-500 text-white hover:bg-sky-700' size='small' onClick={onSubmit} loading={loading} disabled={loading}
                        variant="contained" color='info' >Confirm</LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}
