import React, { useEffect, useState } from 'react';
import { Button, Divider, Drawer, Grid, IconButton, Skeleton, Slide, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { Close, Delete, DeleteForever, Edit } from '@mui/icons-material';
import { TaskApi } from '@/data/Endpoints/Task';
import DeletePopup from '@/Components/Common/Popup/delete';
import { LeadApi } from '@/data/Endpoints/Lead';



const LeadNoteModal = ({ lead_id, editId, setEditId, refresh, setRefresh }) => {

    const { register, handleSubmit, watch, setValue, reset } = useForm();

    const anchor = 'right';

    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)
    const [Notes, setNotes] = useState([])
    const [deleteID, setDeleteID] = useState(false)
    const [editID, setEditID] = useState(0)
    const [expandedNotes, setExpandedNotes] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false)
    const [buttonText, setbuttonText] = useState('Add')
    const [total, setTotal] = useState()


    const fetchNotes = () => {
        setLoading(true)
        LeadApi.listNote({ limit: 50, id: lead_id }).then((notes) => {
            // console.log(notes);
            if (notes?.data?.data?.length > 0) {
                setNotes(notes.data)
                setLoading(false)
                setTotal(notes?.data?.meta?.total)
            }
            setLoading(false)
        }).catch((error) => {
            console.log(error);
            setLoading(false)
        })
    }



    const onSubmit = (data) => {

        if (watch('note')) {

            setSubmitLoading(true)

            let dataToSubmit = {
                lead_id: lead_id,
                note: watch('note'),
            }

            let action;

            if (editID > 0) {
                dataToSubmit['id'] = editID
                action = LeadApi.updateNote(dataToSubmit)
            } else {
                action = LeadApi.addNote(dataToSubmit)
            }
            action.then((response) => {
                // console.log(response);
                if (response?.status == 200 || response?.status == 201) {
                    toast.success(editID > 0 ? 'Note has been successfully updated.' : 'Note has been successfully added.')
                    setSubmitLoading(false)
                    fetchNotes()
                    handleCancelEdit()
                } else {
                    setSubmitLoading(false)
                    toast.error(response?.response?.data?.message)
                }
                setSubmitLoading(false)
            }).catch(errors => {
                setSubmitLoading(false)
                toast.error("server error")
            })
        }else{
            toast.error('note field is required')
        }
    }

    const handleEdit = (data) => {
        setEditID(data?.id)
        setValue('note', data.note)
        setbuttonText('Edit');
    }

    const deleteNote = (id) => {
        setDeleteID(id)
    }

    const handleCancelEdit = () => {
        setEditID(0)
        setValue('note', '')
        setbuttonText('Add');
    }

    const deleteFunction = () => {
        fetchNotes()
    }

    const toggleReadMore = (id) => {
        if (expandedNotes.includes(id)) {
            setExpandedNotes((prevExpandedNotes) =>
                prevExpandedNotes.filter((noteId) => noteId !== id)
            );
        } else {
            setExpandedNotes((prevExpandedNotes) => [...prevExpandedNotes, id]);
        }
    };

    const toggleReadLess = (id) => {
        setExpandedNotes((prevExpandedNotes) =>
            prevExpandedNotes.filter((noteId) => noteId !== id)
        );
    };


    const handleClose = () => {
        setEditId()
        reset()
        setOpen(false)

    }


    const handleDrawerClose = (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        // Check if the close icon was clicked
        if (event.target.tagName === 'svg') {
            setOpen(false);
        }
    };


    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
        } else if (editId == 0) {
            setOpen(true)
            fetchNotes()
        }
    }, [editId])

    return (
        <Drawer
            anchor={anchor}
            open={open}
            onClose={handleDrawerClose}
        >
            <Grid width={550}>

                {
                    deleteID &&
                    <DeletePopup
                        type={'post'}
                        ID={deleteID}
                        setID={setDeleteID}
                        setDeletePopup={setDeleteID}
                        Callfunc={() => deleteFunction()}
                        api={LeadApi.deleteNote}
                        title="Note"
                    />
                }

                <Grid p={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                    <a style={{ fontWeight: 500, fontSize: '19px' }}>Add Note</a>
                    <IconButton
                        onClick={handleClose}
                    >
                        <Close />
                    </IconButton>
                </Grid>
                <hr />



                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container p={1}>

                        {
                            editID ? <Grid mb={1}><a style={{ fontSize: '14px', color: 'blue' }}>You are editing a Note, <span onClick={handleCancelEdit} style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer', fontSize: '14px' }}>Click</span> to cancel</a></Grid>
                                : ''
                        }

                        <Grid item xs={12}>

                            <TextField
                                placeholder='Add Note'
                                {...register('note')}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                sx={{ width: '100%', }}
                                required
                            />
                        </Grid>

                        <Grid sx={{ pt: 2, pb: 2 }} display={'flex'} justifyContent={'end'} item xs={12}>
                            <LoadingButton loading={submitLoading} disabled={submitLoading} size='small' sx={{ textTransform: 'none', height: 35 }} onClick={onSubmit} variant='outlined'>{buttonText}</LoadingButton>
                        </Grid>
                    </Grid>
                </form>


                <Divider sx={{ mb: 1 }} />
                <Grid container p={1} spacing={2}>
                    <Grid item xs={12} sm={12}>

                        {
                            loading ?
                                // for loading
                                LoadingNote(total)
                                :
                                Notes && Notes.data && Notes.data.length > 0 ? (
                                    Notes.data.map((note) => (
                                        <div key={note.id}>
                                            <Typography variant="body2" style={{ paddingTop: 2, fontSize: '16px', whiteSpace: 'pre-line' }}>
                                                <a style={{}} className="text">
                                                    {note.note.length <= 140 ? (
                                                        <a style={{ fontWeight: 400 }}>{note.note}</a>
                                                    ) : (
                                                        expandedNotes.includes(note.id) ? (
                                                            <div>
                                                                <a>{note?.note}</a>
                                                                <a onClick={() => toggleReadLess(note?.id)} style={{ color: 'blue', cursor: 'pointer' }}>  read less</a>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <a>{note?.note.slice(0, 140)}</a>
                                                                <a onClick={() => toggleReadMore(note?.id)} style={{ color: 'blue', cursor: 'pointer' }}> ...read more</a>
                                                            </div>
                                                        )
                                                    )}
                                                </a>

                                                <Grid display={'flex'} justifyContent={'space-between'} mt={1}>
                                                    <Grid display={'flex'} justifyContent={'space-between'} xs={6}>
                                                        <a style={{ fontSize: 13, color: 'grey' }}>Date: {moment(note?.created_at).format('DD-MM-YYYY')}</a>
                                                        <a style={{ fontSize: 13, color: 'grey' }}>Added By: {note?.created_by?.name}</a>
                                                    </Grid>
                                                    <Grid display={'flex'} justifyContent={'end'}>
                                                        <Button onClick={() => handleEdit(note)}>
                                                            <Edit fontSize='small' />
                                                        </Button>
                                                        <LoadingButton onClick={() => deleteNote(note.id)}>
                                                            <Delete color='error' fontSize='small' />
                                                        </LoadingButton>
                                                    </Grid>
                                                </Grid>
                                            </Typography>
                                            <Divider sx={{ mb: 1 }} />
                                        </div>
                                    ))
                                ) : (
                                    <div className='timeline-content-block-item'>
                                        <div className='no-follw-up-block'>
                                            <h4 style={{ color: 'grey' }}>No Notes Found For This Lead</h4>
                                        </div>
                                    </div>
                                )
                        }
                    </Grid>
                </Grid>

            </Grid>

        </Drawer>
    )
}

export default LeadNoteModal;

const LoadingNote = (total) => (

    [...Array(total || 4)]?.map((_, index) => (
        <div key={index}>
            <Typography variant="body2" style={{ paddingTop: 2 }}>
                <a>
                    <Skeleton variant="rectangular" width={350} height={20} />
                </a>
                <Grid display={'flex'} justifyContent={'space-between'} mt={2}>
                    <Grid item mb={1} display={'flex'} xs={6}>
                        <Skeleton sx={{ mr: 2 }} variant="rectangular" width={100} height={20} />
                        <Skeleton variant="rectangular" width={100} height={20} />
                    </Grid>
                </Grid>
            </Typography>
            <Divider sx={{ mb: 1 }} />
        </div>
    ))
)
