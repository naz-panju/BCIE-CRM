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

    const handleTemplateChange = (event) => {
        const checkboxValue = event.target.value;
        if (event.target.checked) {
            // Add the checkbox value to the selectedScopes array if checked
            setSelectedTemplates([...selectedTemplates, checkboxValue]);
        } else {
            // Remove the checkbox value from the selectedScopes array if unchecked
            setSelectedTemplates(selectedTemplates?.filter((value) => value !== checkboxValue));
        }
    };

    const isTemplateChecked = (value) => selectedTemplates.includes(value);


    const onSubmit = (data) => {
        setLoading(true)
        console.log(data);
        console.log(selectedFile)

        const formData = new FormData()

        formData.append('document_template_id', data?.template?.id)
        formData.append('lead_id', id)
        formData.append('file', selectedFile)

        LeadApi.addDocument(formData).then((response) => {
            console.log(response);
            if (response?.data?.data) {
                handleClose()
                toast.success('Document has been successfully added')
                setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
                setLoading(false)
            }
            setLoading(false)
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

                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                                        <FormControlLabel control={<Checkbox onChange={handleTemplateChange} value={obj?.name} checked={isTemplateChecked(obj?.name)} />} label={obj?.name} />
                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
                                    </FormGroup>
                                </Grid>
                        }

                        <Grid mt={2} display={'flex'} justifyContent={'end'}>
                            <LoadingButton
                                loading={loading}
                                size='small'
                                sx={{ textTransform: 'none', }}
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
