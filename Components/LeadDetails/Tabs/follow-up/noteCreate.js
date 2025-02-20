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
import DeleteIcon from '@/img/Delete.svg'
import EditIcon from '@/img/Edit.svg'
import Image from 'next/image';

const LeadNoteModal = ({ lead_id, editId, setEditId, refresh, setRefresh, from, app_id ,handleDetailRefresh}) => {

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
        let params = {
            id: lead_id,
            limit: 50,
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        LeadApi.
        listNote(params).then((notes) => {
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
            if (from == 'app') {
                dataToSubmit['application_id'] = app_id
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
                    if(handleDetailRefresh){
                        handleDetailRefresh()
                    }
                    // if(refresh){
                    setRefresh(!refresh)
                    // }
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
        } else {
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
         setRefresh(!refresh)
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
            onClose={handleClose}
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

                <Grid className='modal_title d-flex align-items-center  '>
                    <a className='back_modal' onClick={handleClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                            <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                    <a className='back_modal_head'> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 19.9991C12.9051 20 12.7986 20 12.677 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V12.6747C20 12.7973 20 12.9045 19.9991 13M13 19.9991C13.2857 19.9966 13.4663 19.9862 13.6388 19.9448C13.8429 19.8958 14.0379 19.8147 14.2168 19.705C14.4186 19.5814 14.5916 19.4089 14.9375 19.063L19.063 14.9375C19.4089 14.5916 19.5809 14.4186 19.7046 14.2168C19.8142 14.0379 19.8953 13.8424 19.9443 13.6384C19.9857 13.4659 19.9964 13.2855 19.9991 13M13 19.9991V14.6001C13 14.04 13 13.7598 13.109 13.5459C13.2049 13.3577 13.3577 13.2049 13.5459 13.109C13.7598 13 14.0396 13 14.5996 13H19.9991" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Add Note </a>

                </Grid>
                <hr />

                <div className='form-data-cntr'>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid  >

                            {
                                editID ? <Grid mb={1}><a style={{ fontSize: '14px', color: 'blue' }}>You are editing a Note, <span onClick={handleCancelEdit} style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer', fontSize: '14px' }}>Click</span> to cancel</a></Grid>
                                    : ''
                            }

                            <Grid className='form_group frm-text-conn-stl '>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V12M9 15V12.5L17.75 3.75C18.4404 3.05964 19.5596 3.05964 20.25 3.75V3.75C20.9404 4.44036 20.9404 5.55964 20.25 6.25L15.5 11L11.5 15H9Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                <TextField
                                    placeholder='Add Note'
                                    {...register('note')}
                                
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
                        </Grid>
                    </form>
                </div>

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
                                            <Typography className='add-note-block' variant="body2" style={{ paddingTop: 2, fontSize: '16px', whiteSpace: 'pre-line' }}>

                                                
                                                <Grid className='centeritem' display={'flex'} justifyContent={'space-between'} mt={1}>
                                                    <Grid display={'flex'} justifyContent={'space-between'} xs={6}>
                                                        <a style={{ fontSize: 13, color: 'grey' }}>Date: {moment(note?.created_at).format('DD-MM-YYYY')}</a>
                                                    </Grid>
                                                    <Grid className='add-note-block-icon' display={'flex'} justifyContent={'end'}>
                                                        <Button className='add-note-block-icon-item' onClick={() => handleEdit(note)}>
                                                            <Image  src={EditIcon} alt='DeleteIcon'  width={16} height={16} />
                                                        </Button>
                                                        <LoadingButton  className='add-note-block-icon-item' onClick={() => deleteNote(note.id)}>
                                                            <Image  src={DeleteIcon} alt='DeleteIcon'  width={16} height={16} />
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

                                                <a style={{ fontSize: 13, color: 'grey' }}>Added By: {note?.created_by?.name}</a>

                                                <span className='add-author'>{getFirstLettersOfTwoWords(note?.created_by?.name)}</span>

                                                
                                            </Typography>
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
