import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Grid, IconButton, Skeleton, TextField, Tooltip } from '@mui/material';
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

export default function LeadDocumentRequest({ id, reqId, setReqId }) {

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()

    const [open, setOpen] = React.useState(false);
    const [templates, setTemplates] = useState([])
    const handleOpen = () => setOpen(true);
    const [loading, setLoading] = useState(false)
    const [selectedTemplates, setSelectedTemplates] = useState([])
    const [datLoading, setdatLoading] = useState(false)

    const handleClose = () => {
        setReqId()
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
            if (response?.statusText == 'OK') {
                toast.success(response?.data?.message)
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
        ListingApi.documentTemplate().then((response) => {
            setTemplates(response?.data?.data)
            setdatLoading(false)
        }).catch((error) => {
            console.log(error);
            setdatLoading(false)
        })
    }


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

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Request Document
                        </Typography>
                        <IconButton
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </Grid>

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

                                                    <Grid key={index} item xs={12} sm={6}>
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
                                onClick={requestDocument}
                                loading={loading}
                                disabled={loading}
                                size='small'
                                sx={{ textTransform: 'none', height: 30 }}
                                className=" bg-sky-500 hover:bg-sky-700 text-white font-bold  rounded"
                            >
                                Request
                            </LoadingButton>

                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}

const loadingGrid = () => (
    <Grid container>

        {
            [...Array(4)].map((_, index) => (
                <Grid mt={1} key={index} item xs={12} sm={6}>
                    <Skeleton variant='rounded' height={20} width={150} />
                </Grid>
            ))
        }
    </Grid>
)
