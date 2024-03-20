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
import TextInput from '@/Form/TextInput';
import AsyncSelect from "react-select/async";
import { data } from 'autoprefixer';
import { CourseApi } from '@/data/Endpoints/Course';


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

export default function AddCourse({ id, addId, setAddId,handleRefresh }) {

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()

    const [open, setOpen] = React.useState(false);
    const [templates, setTemplates] = useState([])
    const handleOpen = () => setOpen(true);
    const [loading, setLoading] = useState(false)
    const [selectedTemplates, setSelectedTemplates] = useState([])
    const [datLoading, setdatLoading] = useState(false)

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(0);

    const handleFileChange = (event) => {
        setFileInputKey(prevKey => prevKey + 1);
        setSelectedFile(event.target.files[0]);
    };


    const handleClose = () => {
        setAddId()
        setValue('course_level')
        setValue('add_course')
        setSelectedFile()
        setOpen(false);
    }

    const handleCourseLevelChange = (data) => {
        setValue('course_level', data || '')
    }

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setSelectedFile(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };
    const handleDelete = () => {
        setSelectedFile(null); // Clear selected file
    };


    const fetchCourseLevel = (e) => {
        return ListingApi.courseLevel({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }


    const AddCourse = () => {
        setLoading(true)
        const formData = new FormData()

        formData.append('name', watch('add_course'))
        formData.append('course_level_id', watch('course_level')?.id)

        if (selectedFile) {
            formData.append('image', selectedFile)
        }


        CourseApi.add(formData).then((response) => {
            console.log(response);
            if (response?.status == 200 || 201) {
                toast.success('New Course Added')
                handleRefresh()
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
        if (addId > 0) {
            setOpen(true)
        } else if (addId == 0) {
            setOpen(true)
            fetchTemplates()
        }
    }, [addId])


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
                            Add New Course
                        </Typography>
                        <IconButton
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </Grid>

                    <form >

                        <Grid >
                            <Grid p={1} container >
                                <Grid item pr={1} display={'flex'} alignItems={'center'} xs={4} md={4}>
                                    <a className='form-text'>Course Level</a>
                                </Grid>

                                <Grid item pr={1} xs={8} md={8}>
                                    <AsyncSelect
                                        // isDisabled={!selectedUniversityId}
                                        name={'course_level'}
                                        defaultValue={watch('course_level')}
                                        isClearable
                                        defaultOptions
                                        loadOptions={fetchCourseLevel}
                                        getOptionLabel={(e) => e.name}
                                        getOptionValue={(e) => e.id}
                                        onChange={handleCourseLevelChange}
                                    />
                                    {errors.course_level && <span className='form-validation'>{errors.course_level.message}</span>}

                                </Grid>
                            </Grid>

                            <Grid p={1} container >
                                <Grid item pr={1} display={'flex'} alignItems={'center'} xs={4} md={4}>
                                    <a className='form-text'>Add Courses</a>
                                </Grid>

                                <Grid item pr={1} xs={8} md={8}>
                                    <TextInput control={control} name="add_course"
                                        value={watch('add_course')} />
                                </Grid>
                            </Grid>

                            <div
                                className="flex flex-col items-center justify-center mt-4 border-dashed border-2 border-gray-400 p-4 "
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                    key={fileInputKey}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Select Image or Drag and Drop Here
                                </label>
                                {(selectedFile) && (
                                    <Grid display={'flex'} justifyContent={'space-between'} className="mt-4">
                                        <Grid mr={1}>
                                            {
                                                selectedFile &&
                                                <Tooltip title={selectedFile?.name}>
                                                    <p className="text-gray-700">
                                                        {
                                                            selectedFile?.name?.length > 20
                                                                ? selectedFile?.name?.slice(0, 20) + '....'
                                                                : selectedFile?.name
                                                        }
                                                    </p>
                                                </Tooltip>
                                            }

                                        </Grid>
                                        {
                                            selectedFile &&
                                            <Grid>
                                                <Delete sx={{ cursor: 'pointer' }} color='error' fontSize='small' onClick={handleDelete} />
                                            </Grid>
                                        }
                                    </Grid>
                                )}
                            </div>

                        </Grid>


                        <Grid mt={2} display={'flex'} justifyContent={'end'}>
                            <LoadingButton
                                onClick={AddCourse}
                                loading={loading}
                                disabled={loading}
                                variant='contained'
                                size='small'
                                sx={{ textTransform: 'none', height: 30 }}
                                className=" bg-sky-500 hover:bg-sky-700 text-white font-bold  rounded"
                            >
                                Add
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
