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
import moment from 'moment';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function AlertPopup({ openPopup, onClose, title, subTitle }) {

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()


    const [open, setOpen] = React.useState(false);
    const [formButtonStatus, setFormButtonStatus] = useState({
        loading: false,
        disabled: false,
    });

    const handleClose = () => {
        onClose()
        setOpen(false);
    };

    useEffect(() => {
        if (openPopup) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [openPopup]);


    const memoizedOpen = useMemo(() => open, [open]);

    return (
        <div>
            <Dialog
                open={memoizedOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={null}
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{
                    style: {
                        width: 450,
                        marginBottom: 'auto'
                    },
                }}
            >
                <DialogTitle>
                    {title}
                </DialogTitle>


                <DialogContent>
                    <span style={{ color: 'black' }}> {subTitle}</span>
                </DialogContent>
                <DialogActions>
                    <LoadingButton onClick={handleClose} className='bg-sky-500 text-white hover:bg-sky-700' size='small'
                        variant="contained" color='info' >Ok</LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}
