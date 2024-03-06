import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Close, Delete } from '@mui/icons-material';
import SelectX from '@/Form/SelectX';
import { ListingApi } from '@/data/Endpoints/Listing';
import { LeadApi } from '@/data/Endpoints/Lead';
import toast from 'react-hot-toast';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function LeadDocumentModal({ id, editId, setEditId }) {

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setValue('template', '')
        setSelectedFile(null)
        setEditId()
        setOpen(false);
    }

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        // Handle file upload logic here
        console.log("Selected File:", selectedFile);
        // You can send the file to the server using fetch or any other method
    };

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

    const fetchTemplates = (e) => {
        return ListingApi.documentTemplate({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data;
            } else {
                return [];
            }
        })
    }

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


    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
        } else if (editId == 0) {
            setOpen(true)
        }
    }, [editId])

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
                            Add Document
                        </Typography>
                        <IconButton
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </Grid>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid mt={2}>
                            <a>Choose Template</a>
                            <SelectX
                                required={true}
                                loadOptions={fetchTemplates}
                                control={control}
                                rules={{ required: 'Template is required' }}
                                name={'template'}
                                defaultValue={watch('template')}
                            />
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
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Select File or Drag and Drop Here
                            </label>
                            {selectedFile && (
                                <Grid display={'flex'} justifyContent={'space-between'} className="mt-4">
                                    <Grid mr={1}>
                                        {
                                            <Tooltip title={selectedFile?.name}>
                                                <p className="text-gray-700">
                                                    {selectedFile?.name?.length > 20
                                                        ? selectedFile?.name?.slice(0, 20) + '....'
                                                        : selectedFile?.name}
                                                </p>
                                            </Tooltip>}
                                    </Grid>
                                    <Grid>
                                        <Delete sx={{ cursor: 'pointer' }} color='error' fontSize='small' onClick={handleDelete} />
                                    </Grid>
                                </Grid>
                            )}
                        </div>
                        <Grid display={'flex'} justifyContent={'end'}>
                            <LoadingButton
                                type='submit'
                                variant='contained'
                                disabled={!selectedFile}
                                loading={loading}
                                sx={{ textTransform: 'none' }}
                                className="mt-2 bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Upload
                            </LoadingButton>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
// <div className="flex flex-col items-center justify-center mt-8">
//     <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
//     <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//         Select File
//     </label>
//     {selectedFile && (
//         <div className="mt-4">
//             <p className="text-gray-700">{selectedFile.name}</p>
//             <button onClick={handleUpload} className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
//                 Upload
//             </button>
//         </div>
//     )}
// </div>