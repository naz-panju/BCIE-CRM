import React, { useEffect, useState } from 'react';
import { Divider, Grid, MenuItem, Popover, Skeleton, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { toast } from 'react-hot-toast';
import { CheckCircle, DeleteOutlineOutlined, Edit, MoreVert, PanoramaFishEye } from '@mui/icons-material';
import { TaskApi } from '@/data/Endpoints/Task';
import TextInput from '@/Form/TextInput';
import DeletePopup from '@/Components/Common/Popup/delete';



const CheckListTab = ({ id }) => {

    const { handleSubmit, watch, control, setValue, } = useForm()
    const [loading, setLoading] = useState(false)
    const [checkNotes, setCheckNotes] = useState([])
    const [total, setTotal] = useState()
    const [pageNumber, setPageNumber] = useState(0);
    const [deleteID, setDeleteID] = useState()
    const [anchorEls, setAnchorEls] = useState({})
    const [checkNoteEdit, setcheckNoteEdit] = useState(0)

    const [buttonText, setButtonText] = useState('Add')
    const [buttonLoading, setButtonLoading] = useState(false)

    const handleOpenPopover = (event, noteId) => {
        setAnchorEls({ ...anchorEls, [noteId]: event.currentTarget });
    };

    const handleClosePopover = (noteId) => {
        setAnchorEls({ ...anchorEls, [noteId]: null });
    };

    // const id = anchorEl ? 'popover-basic' : undefined;


    const handlePageChange = (page) => {
        setPageNumber(page)
    }

    const onSubmit = (data) => {

        setButtonLoading(true)

        let dataToSubmit = {
            task_id: id,
            checklist: watch('check_note')
        }

        console.log(dataToSubmit);
        let action;

        if (checkNoteEdit > 0) {
            dataToSubmit['id'] = checkNoteEdit
            action = TaskApi.updateChecklist(dataToSubmit)
        } else {
            console.log(dataToSubmit);
            action = TaskApi.addChecklist(dataToSubmit)
        }
        action.then((response) => {
            console.log(response);
            if (response?.status == 200 || 201) {
                toast.success(checkNoteEdit > 0 ? 'Checklist has been successfully updated.' : 'Checklist has been successfully added.')
                fetchDetails()
                handleCancelEdit()
                setButtonLoading(false)
            }
            else{
                toast.error(response?.response?.data?.message)
                setButtonLoading(false)
            }

        }).catch(errors => {
            console.log(errors);
            toast.error(errors?.response?.response?.data?.message)
            setButtonLoading(false)
        })
    }

    const handleDelete = (id) => {
        // console.log(id);
        setDeleteID(id)
        handleClosePopover(id)
    }
    const handleEdit = (data) => {
        handleClosePopover(data.id);
        setcheckNoteEdit(data.id)
        setValue('check_note', data.checklist)
        setButtonText('Edit')
    }
    const handleCancelEdit = () => {
        setcheckNoteEdit(0)
        setValue('check_note', '')
        setButtonText('Add')
    }

    const fetchDetails = () => {
        setLoading(true)

        TaskApi.listChecklist({ limit: 50, id }).then((response) => {
            setCheckNotes(response?.data)
            setTotal(response?.data?.meta?.total)
            setLoading(false)
        }).catch((error) => {
            setLoading(false)
        })
    }

    console.log(checkNotes);

    const handleCheck = (id) => {
        // console.log(id);
        const loadingToast = toast.loading('Changing...');

        TaskApi.completeChecklist({ id:id }).then((response) => {
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response?.data?.message)
                toast.dismiss(loadingToast);
                fetchDetails()
            }else{
                toast.error(response?.response?.data?.message)
                toast.dismiss(loadingToast);
            }
        }).catch(errors => {
            console.log(errors);
            toast.error(errors?.response?.data?.message)
            toast.dismiss(loadingToast);
        })
    }

    const deleteFunction = () => {
        fetchDetails()
    }

    useEffect(() => {
        fetchDetails()
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
                    api={TaskApi.deleteChecklist}
                    title="Checklist"
                />
            }

            <form onSubmit={handleSubmit(onSubmit)}>


                {
                    checkNoteEdit ? <Grid mb={1}><a style={{ fontSize: '14px', color: 'blue' }}>You are editing a Checklist, <span onClick={handleCancelEdit} style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer', fontSize: '14px' }}>Click</span> to cancel</a></Grid>
                        : ''
                }
                <Grid xs={12} display={'flex'} justifyContent={'space-between'}>

                    <Grid width={450} sx={{}} item sm={9} xs={9}>
                        <TextInput
                            isRequired={true}
                            control={control}
                            name="check_note"
                            value={watch('check_note')} />
                    </Grid>

                    <Grid display={'flex'} alignItems={'end'} sx={{}} item sm={3} xs={3}>
                        <LoadingButton sx={{ textTransform: 'none', height: 35 }} loading={buttonLoading} disabled={buttonLoading}
                            variant="outlined" onClick={onSubmit} >{buttonText}</LoadingButton>
                    </Grid>
                </Grid>
            </form>

            {/* <Divider sx={{mt:1}} /> */}

            {
                loading ?
                    <Grid p={1} style={{ overflowY: 'auto', maxHeight: '500px', border: checkNotes ? '1px solid #ccc' : '', borderRadius: 2.5 }} mt={1} container sx={12} sm={12}>
                        {
                            [...Array(total || 4)]?.map((_, index) => (
                                <div style={{ width: '100%' }} key={index}>
                                    <Grid width={'100%'} mb={1} sx={12} sm={12} display={'flex'} alignItems={'start'}>
                                        <Grid width={'90%'} sx={10} sm={10}>
                                            <Typography variant="body2" style={{ paddingTop: 10, fontSize: '16px' }}>
                                                <Skeleton variant="rectangular" width={350} height={20} />
                                            </Typography>
                                        </Grid>
                                        <Grid display={'flex'} alignItems={'center'} mt={.6} sx={2} sm={2} pl={2}>
                                            <Skeleton sx={{ mr: 2 }} variant="rectangular" width={100} height={20} />                                        </Grid>
                                    </Grid>
                                    {index !== checkNotes?.data?.length - 1 && <Divider />}
                                </div>
                            ))}

                    </Grid>
                    :
                    checkNotes && checkNotes?.data?.length > 0 ? (
                        <Grid p={1} style={{ overflowY: 'auto', maxHeight: '500px', border: checkNotes ? '1px solid #ccc' : '', borderRadius: 2.5 }} mt={1} container sx={12} sm={12}>
                            {checkNotes?.data?.map((notes, index) => (
                                <div style={{ width: '100%' }} key={index}>
                                    <Grid width={'100%'} mb={1} sx={12} sm={12} display={'flex'} alignItems={'start'}>
                                        <Grid width={'90%'} sx={10} sm={10}>
                                            <Typography variant="body2" style={{ paddingTop: 10, fontSize: '16px' }}>
                                                {notes.checklist}
                                            </Typography>
                                        </Grid>
                                        <Grid display={'flex'} alignItems={'center'} mt={.6} sx={2} sm={2} pl={2}>
                                            {
                                                notes.completed === 1 ?
                                                    <a><CheckCircle sx={{ color: 'green', cursor: 'pointer', marginTop: 1 }} fontSize='small' /></a>
                                                    :
                                                    <a><PanoramaFishEye onClick={() => handleCheck(notes?.id)} sx={{ color: 'grey', cursor: 'pointer', marginTop: 1 }} fontSize='small' /></a>
                                            }

                                            {/* <Checkbox style={{ color: notes.is_completed === 1 ? 'green' : '' }} defaultChecked={notes.is_completed === 1} onChange={(e) => statusChange(e, notes)} /> */}
                                            <a data-item-id={notes.id} onClick={(e) => handleOpenPopover(e, notes.id)} style={{ marginLeft: 10, cursor: 'pointer', marginTop: 5 }}><MoreVert fontSize='small' /></a>
                                        </Grid>
                                    </Grid>
                                    <Popover
                                        id={notes.id} // Use the checklist item's ID as the popover ID
                                        open={Boolean(anchorEls[notes.id])}
                                        anchorEl={anchorEls[notes.id]}
                                        onClose={() => handleClosePopover(notes.id)}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <MenuItem onClick={() => handleEdit(notes)}>
                                            <Edit fontSize='small' sx={{ marginRight: 1, color: 'blue' }} />
                                        </MenuItem>
                                        <MenuItem onClick={() => handleDelete(notes.id)}>
                                            <DeleteOutlineOutlined fontSize='small' sx={{ marginRight: 1, color: 'red' }} />
                                        </MenuItem>
                                    </Popover>
                                    {index !== checkNotes?.data?.length - 1 && <Divider />}
                                </div>
                            ))}

                        </Grid>
                    ) : (
                        <div className='timeline-content-block-item'>
                            <div className='no-follw-up-block'>
                                <h4 style={{ color: 'grey' }}>No Checklist Found For This Task</h4>
                            </div>
                        </div>
                    )
            }


        </Grid>
    )
}

export default CheckListTab;
