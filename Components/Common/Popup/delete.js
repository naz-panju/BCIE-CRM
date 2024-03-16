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
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function DeletePopup({ ID, setID, setDeletePopup, Callfunc, api, title, showDeletePopup, type }) {


    const [open, setOpen] = React.useState(false);
    const [formButtonStatus, setFormButtonStatus] = useState({
        label: 'Delete',
        loading: false,
        disabled: false,
    });


    const handleClose = () => {

        setID();
        setOpen(false);
        setDeletePopup(false)
        // setTimeout(() => {
        //     setDeletePopup(false)
        // }, 100)

    };

    useEffect(() => {
        if (ID > 0) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [ID]);

    const DeleteHandler = async () => {
        setFormButtonStatus({ ...formButtonStatus, loading: true, disabled: true });

        // console.log(api);

        try {
            let response;
            if (type == 'post') {
                let dataToDelete = {
                    id: ID,
                }
                response = await api(dataToDelete)
            } else {

                // response = await DeleteApI.deletedata(`${url}${ID}`)
            }

            // console.log(response);
            if (response?.statusText == "OK") {
              
                toast.success(`${response?.data?.message}`, { autoClose: 1000, position: "top-center" });
                handleClose()
                Callfunc()
            } else {
                toast.error(response?.response?.data?.message, { autoClose: 1000, position: "top-center" })
            }

            handleClose()

        }


        catch (error) {
            toast.error('An error occurred. Please try again later.', { autoClose: 2000, position: "top-center" });
            setFormButtonStatus({ label: "Delete", loading: false, disabled: false });
        }


    };


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
                        transform: 'translateY(-75%)',
                    },
                }}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to delete this {title}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <LoadingButton onClick={() => DeleteHandler()} loading={formButtonStatus.loading} disabled={formButtonStatus.disabled}
                        variant="outlined" color='error' >{formButtonStatus.label}</LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}
