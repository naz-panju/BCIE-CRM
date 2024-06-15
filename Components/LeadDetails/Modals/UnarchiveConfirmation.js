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
import { Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { StudentApi } from '@/data/Endpoints/Student';
import SelectX from '@/Form/SelectX';
import { ListingApi } from '@/data/Endpoints/Listing';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function UnArchiveConfirmPopup({ ID, setID, setLoading, title, loading, details, getDetails }) {

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
            dataToSubmit['archive_note']=watch('note')
            dataToSubmit['archive_reason']=watch('reason')?.reason
            // console.log(dataToSubmit);
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
                <DialogTitle>{details?.closed == 1 ? 'Unarchive' : 'Archive'} {title}</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-slide-description">
                        {title}
                    </DialogContentText> */}

                </DialogContent>
                <DialogActions>
                    <Button size='small' onClick={handleClose} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <LoadingButton className='bg-sky-500 text-white hover:bg-sky-700' size='small' onClick={ArchiveLead} loading={loading} disabled={loading}
                        variant="contained" color='info' >Confirm</LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}
