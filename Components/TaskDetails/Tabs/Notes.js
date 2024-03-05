import React, { useEffect, useState } from 'react';
import { Button, Divider, Grid, Slide, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { Delete, DeleteForever, Edit } from '@mui/icons-material';
import { TaskApi } from '@/data/Endpoints/Task';



const TaskNotes = (props) => {

    const { register, handleSubmit, watch, setValue, } = useForm();


    const [loading, setLoading] = useState(false)
    const [Notes, setNotes] = useState([])
    const [deleteID, setDeleteID] = useState(false)
    const [editID, setEditID] = useState(0)
    const [expandedNotes, setExpandedNotes] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false)
    const [buttonText, setbuttonText] = useState('Add')


    const fetchNotes = () => {
        setLoading(true)
        TaskApi.listNotes({ id: props.id }).then((notes) => {
            console.log(notes);
            if (notes?.data?.data?.length > 0) {
                setNotes(notes.data)
                setLoading(false)
            }
            setLoading(false)
        }).catch((error) => {
            console.log(error);
            setLoading(false)
        })
    }



    const onSubmit = (data) => {
        setSubmitLoading(true)

        let dataToSubmit = {
            task_id: props.id,
            note: data.note,
        }

        console.log(dataToSubmit);
        let action;

        if (editID > 0) {
            dataToSubmit['id'] = editID
            action = TaskApi.updateNote(dataToSubmit)
        } else {
            console.log(dataToSubmit);
            action = TaskApi.addNote(dataToSubmit)
        }
        action.then((response) => {
            console.log(response);
            if (response?.data) {
                toast.success(editID > 0 ? 'Note has been successfully updated.' : 'Note has been successfully added.')
                setSubmitLoading(false)
                fetchNotes()
                handleCancelEdit()
            }
        }).catch(errors => {
            setSubmitLoading(false)
            toast.error("server error")
        })
    }

    const fetchDetails = () => {
        setLoading(true)
        TaskApi.getNoteDetails({ id: props.id }).then((response) => {
            console.log(response);
            let data = response.data.data
            setValue('note', data.note)
            setLoading(false)
        })
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

    // const deleteFunction = () => {
    //     fetchNotes()
    //     props?.count()
    // }

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

    useEffect(() => {
        fetchNotes()
    }, [])

    return (
        <Grid p={2}>

            {/* {
                deleteID &&
                <Delete
                    ID={deleteID}
                    setID={setDeleteID}
                    setDeletePopup={setDeleteID}
                    Callfunc={() => deleteFunction()}
                    url="/projects/tasks/notes/delete?id="
                    title="Note"
                />
            } */}



            <form onSubmit={handleSubmit(onSubmit)}>

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
                    <LoadingButton loading={submitLoading} disabled={submitLoading}
                        variant="outlined" type="submit">{buttonText}</LoadingButton>
                </Grid>
            </form>


            <Divider sx={{ mb: 1 }} />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>

                    {Notes &&
                        Notes?.data?.map((note) => (
                            <>
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
                                            <a style={{ fontSize: 13, color: 'grey' }}>Added By: {note?.createdBy?.name}</a>
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
                            </>
                        ))}
                </Grid>
            </Grid>

        </Grid>
    )
}

export default TaskNotes;
