import React, { useEffect, useState } from 'react';
import { Button, Divider, Grid, Skeleton, Slide, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { Delete, DeleteForever, Edit } from '@mui/icons-material';
import { TaskApi } from '@/data/Endpoints/Task';
import DeletePopup from '@/Components/Common/Popup/delete';
import Image from 'next/image';
import EditIcon from '@/img/Edit.svg'
import DeleteIcon from '@/img/Delete.svg'




const TaskNotes = (props) => {

    const { register, handleSubmit, watch, setValue, } = useForm();


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
        TaskApi.listNotes({ limit: 50, id: props.id }).then((notes) => {
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
                task_id: props.id,
                note: watch('note'),
            }

            // console.log(dataToSubmit);
            let action;

            if (editID > 0) {
                dataToSubmit['id'] = editID
                action = TaskApi.updateNote(dataToSubmit)
            } else {
                // console.log(dataToSubmit);
                action = TaskApi.addNote(dataToSubmit)
            }
            action.then((response) => {
                // console.log(response);
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
        } else {
            toast.error('Note field is required')
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


    const getFirstLettersOfTwoWords = (name) => {
        if (name) {
            const words = name.split(" "); // Split the name into an array of words
            if (words.length >= 2) {
                // Extract the first letter of the first two words and concatenate them
                return words[0].charAt(0) + words[1].charAt(0);
            } else if (words.length === 1) {
                // If there's only one word, return its first letter
                return words[0].charAt(0);
            }
        }
        return ""; // Return an empty string if name is not provided
    };

    useEffect(() => {
        fetchNotes()
    }, [])

    return (
        <Grid p={2}>

            {
                deleteID &&
                <DeletePopup
                    type={'post'}
                    ID={deleteID}
                    setID={setDeleteID}
                    setDeletePopup={setDeleteID}
                    Callfunc={() => deleteFunction()}
                    api={TaskApi.deleteNote}
                    title="Note"
                />
            }

            <div style={{padding:'0px'}} className='form-data-cntr'>
                <form onSubmit={handleSubmit(onSubmit)}>

                    {
                        editID ? <Grid mb={1}><a style={{ fontSize: '14px', color: 'blue' }}>You are editing a Note, <span onClick={handleCancelEdit} style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer', fontSize: '14px' }}>Click</span> to cancel</a></Grid>
                            : ''
                    }

                    <Grid className='form_group frm-text-conn-stl '>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V12M9 15V12.5L17.75 3.75C18.4404 3.05964 19.5596 3.05964 20.25 3.75V3.75C20.9404 4.44036 20.9404 5.55964 20.25 6.25L15.5 11L11.5 15H9Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
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
                    <Grid sx={{ pt: 2, pb: 2 }} item xs={12}>
                        <LoadingButton className='save-btn right' loading={submitLoading} disabled={submitLoading} size='small' sx={{ textTransform: 'none', height: 35 }} onClick={onSubmit} variant='outlined'>{
                            submitLoading ?
                                <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                :
                                <>
                                    {buttonText} <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                        <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </>
                        }</LoadingButton>
                    </Grid>
                </form>
            </div>

            <Divider sx={{ mb: 1 }} />
            <Grid container spacing={2}>
                <Grid  item xs={12} sm={12}>

                    {
                        loading ?
                            // for loading
                            <>
                                {
                                    [...Array(total || 4)]?.map((_, index) => (
                                        <div style={{padding:'16px'}} key={index}>
                                            <Typography variant="body2" style={{ paddingTop: 2 }}>
                                                <a>
                                                    <Skeleton variant="rectangular" width={350} height={20} />
                                                </a>
                                                <Grid display={'flex'} justifyContent={'space-between'} mt={2}>
                                                    <Grid mb={1} display={'flex'} xs={6}>
                                                        <Skeleton sx={{ mr: 2 }} variant="rectangular" width={100} height={20} />
                                                        <Skeleton variant="rectangular" width={100} height={20} />
                                                    </Grid>
                                                </Grid>
                                            </Typography>
                                            <Divider sx={{ mb: 1 }} />
                                        </div>
                                    ))}
                            </>
                            :
                            Notes && Notes.data && Notes.data.length > 0 ? (
                                Notes.data.map((note) => (
                                    <div key={note.id}>
                                        <Typography className='add-note-block' variant="body2" style={{ paddingTop: 2, fontSize: '16px', whiteSpace: 'pre-line' }}>


                                            <Grid className='centeritem' display={'flex'} justifyContent={'space-between'} mt={1}>
                                                <Grid display={'flex'} justifyContent={'space-between'} xs={6}>
                                                    <a style={{ fontSize: 13, color: 'grey' }}>Date: {moment(note?.created_at).format('DD-MM-YYYY')}</a>
                                                </Grid>
                                                <Grid className='add-note-block-icon' display={'flex'} justifyContent={'end'}>
                                                    <Button className='add-note-block-icon-item' onClick={() => handleEdit(note)}>
                                                        <Image src={EditIcon} alt='DeleteIcon' width={16} height={16} />
                                                    </Button>
                                                    <LoadingButton className='add-note-block-icon-item' onClick={() => deleteNote(note.id)}>
                                                        <Image src={DeleteIcon} alt='DeleteIcon' width={16} height={16} />
                                                    </LoadingButton>
                                                </Grid>
                                            </Grid>


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

                                            <a style={{ fontSize: 13, color: 'grey' }}>Added By: {note?.createdBy?.name}</a>

                                            <span className='add-author'>{getFirstLettersOfTwoWords(note?.createdBy?.name)}</span>


                                        </Typography>
                                    </div>
                                ))
                            ) : (
                                <div className='timeline-content-block-item'>
                                    <div className='no-follw-up-block'>
                                        <h4 style={{ color: 'grey' }}>No Notes Found For This Task</h4>
                                    </div>
                                </div>
                            )
                    }
                </Grid>
            </Grid>

        </Grid>
    )
}

export default TaskNotes;
