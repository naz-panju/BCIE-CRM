import React, { useEffect, useState } from 'react';
import moment from "moment";
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid, ListItemText,
    Slide, TextField, Typography
} from "@mui/material";
import toast from "react-hot-toast";
import { useForm } from 'react-hook-form';
import { TaskApi } from '@/data/Endpoints/Task';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const listStatus = [
    { id: 1, name: "Not Started", color: "rgb(196, 196, 196)" },
    { id: 2, name: "In Progress", color: "rgb(253, 171, 61)" },
    { id: 3, name: "Review pending", color: "#e8c8ff" },
    { id: 4, name: "Review Failed", color: "#b84bff" },
    { id: 5, name: "Completed", color: "#00c875" },
]

const StatusModal = (props) => {

    let dataSet = props.dataSet;

    // const [dataSet,setObj] = useState(props.dataSet);
    const [statusNote, setStatusNote] = useState();
    const [history, setHistory] = useState([]);
    const [status, setStatus] = useState();

    const { register, handleSubmit, watch, formState: { errors }, control, setValue, getValues, reset } = useForm();


    const [open, setOpen] = React.useState(false);
    const [viewPage, setViewPage] = useState(false)
    const [openChangeStatus, setOpenChangeStatus] = React.useState(false);
    const [editid, setEditId] = useState()
    const handleClickOpen = () => { setViewPage(true); };
    const handleClose = () => {
        setOpen(false)
        props.setOpen(false)
        props.setDataSet()
    };

    const handleClickOpenChangeStatus = () => { setOpenChangeStatus(true); };
    const handleCloseChangeStatus = () => { setOpenChangeStatus(false); };

    const handleStatusChange = (status) => {
        setStatus(status)
        setOpenChangeStatus(true);

    }

    const handleStatusNoteChange = (e) => {
        setStatusNote(e.target.value);
    }

    const handleStatusChangeConfirm = async () => {
        setOpenChangeStatus(true);
        const loadingToast = toast.loading('Changing...');
        let change = await TaskApi.statusChange(
            {
                id: dataSet.id,
                status: status,
                status_note: statusNote
            });

        console.log(change);

        if (change?.data?.message || change?.status == 200) {
            toast.dismiss(loadingToast);
            toast.success(change.data.message)
            handleCloseChangeStatus();
            handleClose()
            setTimeout(function () {
                props.onUpdate();
            }, 500)
            // handleStatusPopoverClose()
            fetchStatus();
        } else {
            toast.dismiss(loadingToast);
            toast.error(change.data.message)
        }
        setOpen(false)
    }

    const fetchStatus = async () => {
        let history = await TaskApi.statusTimeline({ id: dataSet?.id });
        console.log(history);
        if (history?.statusText === "OK") {
            setHistory(history?.data?.data);
        }
    }

    useEffect(() => {
        if (open) {
            fetchStatus();
        }

    }, [open])


    useEffect(() => {
        if (props.Open) {
            setOpen(true)
        }

    }, [])




    return (<>

        <Dialog open={openChangeStatus} onClose={handleCloseChangeStatus}>
            <DialogTitle>Change status of task</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please submit remarks on this task, you can leave it blank if you want.
                </DialogContentText>
                <TextField
                    autoFocus
                    onChange={handleStatusNoteChange}
                    margin="dense"
                    id="name"
                    label="Remarks"
                    type="email"
                    fullWidth
                    variant="standard"
                />
                {/* {
                    status == 'Completed' ?
                        <Grid mt={2} width={'50%'}>
                            <DateInput control={control} name="due_date"
                                label="Date of Completion"
                                value={watch('due_date')} />

                        </Grid>
                        : ''
                } */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseChangeStatus}>Cancel</Button>
                <Button onClick={handleStatusChangeConfirm}>Change</Button>
            </DialogActions>
        </Dialog>


        {/* Status change Modal */}
        <Dialog
            open={open}
            PaperProps={{ sx: { width: "40%", height: "100%", position: "fixed", right: 0, top: 0, bottom: 0, m: 0, p: 0, borderRadius: 0, maxHeight: '100%', maxWidth: '60%' } }}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            {
                dataSet?.status == 'Completed' &&
                <Grid mt={1} style={{ marginLeft: 'auto' }}>
                    {/* <Button Button style={{ marginRight: 45 }} variant='contained'>Archive</Button> */}

                </Grid>
            }
            <DialogTitle
                sx={{
                    fontSize: '17px',
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold', // Emphasize the title
                    color: '#333', // Choose a pleasant color
                    textTransform: 'capitalize', // Capitalize the text
                    letterSpacing: '0.5px', // Add a bit of letter spacing
                    lineHeight: '1.5', // Improve readability with line height
                    // textShadow: '1px 1px 1px rgba(0,0,0,0.2)', // Add a subtle shadow
                    // // Add some spacing around the title
                    // // Add any additional styles you desire
                }}
            >
                {dataSet.title}
            </DialogTitle>
            <DialogContent sx={{ mt: 1 }}>
                <Grid item md={12} sm={12}>
                    <b>Status : </b> <br />
                    {listStatus?.map(ob => {
                        return (
                            <Chip
                                key={ob?.id}
                                sx={{ mr: 1, mt: 2 }}
                                label={ob.name}
                                color="success"
                                onClick={() => handleStatusChange(ob.name)}
                                variant={ob.name !== dataSet.status ? "outlined" : ""}
                            />
                        );
                    })}
                </Grid>
                {history.length > 0 &&


                    <Grid item md={12} sx={{ my: 2, mt: 5 }}>
                        <b>Status history : </b>
                        {history.map(ob => {
                            return <ListItemText key={ob?.id} sx={{ border: "1px solid #e9e9e9", padding: 1 }}
                                primary={<React.Fragment>{ob.status}
                                    <Typography sx={{ display: "inline-block", fontSize: '10px', marginLeft: 2 }} variant={"string"}>{moment(ob.updated_at).fromNow()}, {moment(ob.updated_at).format('YYYY MMM DD HH:mm')}
                                        {"   - " + ob.created_user?.name}</Typography></React.Fragment>}
                                secondary={<React.Fragment> <Typography sx={{ display: "block", fontSize: '12px', }} variant={"string"}>{ob.description}</Typography></React.Fragment>}
                            />;
                        })}
                    </Grid>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog >
    </>
    );
};

export default StatusModal;
