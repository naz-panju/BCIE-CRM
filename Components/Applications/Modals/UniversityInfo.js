import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect } from 'react';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, IconButton, TextField, Tooltip, Skeleton, FormControlLabel, Checkbox } from '@mui/material';
import { Close } from '@mui/icons-material';
import Image from 'next/image';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    pt: 1,
    maxHeigth: 600,
    overflowY: 'auto'
};

export default function UniversityInfoModal({ editId, setEditId, details, setDetails }) {


    let scheme = yup.object().shape({

        // template: yup.object().required("Please Choose a Template").typeError("Please choose a Template"),
    })



    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const [open, setOpen] = React.useState(false);


    const handleClose = () => {
        setDetails()
        setEditId()
        setOpen(false);
    }


    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
        } else if (editId == 0) {
            setOpen(true)
        }
    }, [editId])

    // console.log(details);


    return (
        <div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            // BackdropProps={{
            //     onClick: null, // Prevent closing when clicking outside
            // }}
            >
                <Box sx={style}>
                    <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {/* University Info */}
                        </Typography>
                        <IconButton
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                    <div className='flex items-start justify-start gap-3 mb-2'>
                        {
                            details?.university?.logo &&
                            <Image src={details?.university?.logo} alt='uni logo' width={60} height={30} />
                        }
                        <b>{details?.university?.name}</b>
                    </div>
                    <hr className='mb-2' />

                    {
                        details?.university?.extra_university_info &&
                        <Grid>
                            <h3 className="university-info-text">University Info</h3>
                            <Grid>
                                <span style={{ fontSize: '14px' }} >{details?.university?.extra_university_info}</span>
                            </Grid>
                        </Grid>
                    }

                    {
                        details?.university?.extra_scholarship_info &&
                        <Grid>
                            <h3 className="university-info-text mt-5">Scholorship Info</h3>
                            <Grid>
                                <span style={{ fontSize: '14px' }} >{details?.university?.extra_scholarship_info}</span>
                            </Grid>
                        </Grid>
                    }
                    {
                        (!details?.university?.extra_university_info && !details?.university?.extra_scholarship_info) &&
                        <Grid display={'flex'} justifyContent={'center'} alignItems={'center'} height={150}>
                            <a style={{ fontSize: '20px' }}>University Information not found</a>
                        </Grid>

                    }

                </Box>
            </Modal>
        </div>
    );
}


const loadingFields = () => {
    return (
        <Grid>
            <Grid container>
                <Grid pr={1} mt={2} md={12}>
                    <a>Select Template</a>
                    <Skeleton variant="rounded" width={'100%'} height={40} />
                </Grid>

            </Grid>

            <Grid mt={2}>
                <Skeleton variant="rounded" width={'100%'} height={100} />
            </Grid>
        </Grid>
    )
}