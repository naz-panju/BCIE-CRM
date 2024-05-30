import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Checkbox, Drawer, FormControlLabel, FormGroup, Grid, IconButton, Skeleton, TextField, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Close, Delete } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import { LeadApi } from '@/data/Endpoints/Lead';
import toast from 'react-hot-toast';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function LeadDocumentRequest({ id, reqId, setReqId, fetchList, handleDeselectDocument }) {

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()

    const [open, setOpen] = React.useState(false);
    const [templates, setTemplates] = useState([])
    const handleOpen = () => setOpen(true);
    const [loading, setLoading] = useState(false)
    const [selectedTemplates, setSelectedTemplates] = useState([])
    const [datLoading, setdatLoading] = useState(false)

    const handleClose = () => {
        setReqId()
        setSelectedTemplates([])
        setOpen(false);
    }

    const handleTemplateChange = (id) => {
        // const checkboxValue = event.target.value;
        const isSelected = selectedTemplates.includes(id);

        if (isSelected) {
            // If the template is already selected, remove it from the array
            setSelectedTemplates(selectedTemplates.filter(value => value !== id));
        } else {
            // If the template is not selected, add it to the array
            setSelectedTemplates([...selectedTemplates, id]);
        }
    };

    const isTemplateChecked = (value) => selectedTemplates.includes(value);


    const requestDocument = () => {
        setLoading(true)

        let dataToSubmit = {
            lead_id: id,
            document_template_ids: selectedTemplates
        }
        LeadApi.requestDocument(dataToSubmit).then((response) => {
            if (response?.status == 200 || 201) {
                toast.success(response?.data?.message)
                if (fetchList) {
                    fetchList()
                }
                if (handleDeselectDocument) {
                    handleDeselectDocument()
                }
                handleClose()
                setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
                setLoading(false)
            }
        }).catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message)
            setLoading(false)
        })
    }


    const fetchTemplates = () => {
        setdatLoading(true)
        ListingApi.documentTemplate({ type: 'student' }).then((response) => {
            setTemplates(response?.data?.data)
            setdatLoading(false)
        }).catch((error) => {
            console.log(error);
            setdatLoading(false)
        })
    }

    const anchor = 'right'; // Set anchor to 'right'


    useEffect(() => {
        if (reqId > 0) {
            setOpen(true)
        } else if (reqId == 0) {
            setOpen(true)
            fetchTemplates()
        }
    }, [reqId])


    return (
        <div>

            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleClose}
            >
                <Grid width={550}>
                    <Grid className='modal_title d-flex align-items-center'>

                        <a className='back_modal' onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </a>

                        <a className='back_modal_head'>Request Document </a>

                    </Grid>
                    <hr />
                    <div className='form-data-cntr'>
                        <form >
                            {
                                datLoading ?
                                    loadingGrid()
                                    :
                                    <Grid mt={2}>
                                        <a style={{ color: 'grey' }}>Select Templates</a>
                                        <FormGroup style={{}}>
                                            <Grid container sx={{ display: 'flex', }}>
                                                {
                                                    templates?.map((obj, index) => (

                                                        <Grid key={index} mb={2} item xs={12} sm={6}>
                                                            <FormControlLabel control={<Checkbox onChange={() => handleTemplateChange(obj?.id)} value={obj?.id} checked={isTemplateChecked(obj?.id)} />} label={obj?.name} />
                                                        </Grid>
                                                    ))
                                                }
                                            </Grid>
                                        </FormGroup>
                                    </Grid>
                            }

                            <Grid mt={2} display={'flex'} justifyContent={'end'}>
                                <LoadingButton
                                    className='save-btn'
                                    onClick={requestDocument}
                                    loading={loading}
                                    disabled={loading || datLoading}
                                    size='small'
                                    sx={{ textTransform: 'none', height: 30 }}
                                >
                                    {
                                        loading ?
                                            <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                            :
                                            <>
                                                Request
                                            </>
                                    }
                                </LoadingButton>

                            </Grid>
                        </form>
                    </div>
                </Grid>
            </Drawer>
        </div>
    );
}

const loadingGrid = () => (
    <Grid container>

        {
            [...Array(16)].map((_, index) => (
                <Grid mt={1} mb={2} key={index} item xs={12} sm={6}>
                    <Skeleton variant='rounded' height={20} width={150} />
                </Grid>
            ))
        }
    </Grid>
)
