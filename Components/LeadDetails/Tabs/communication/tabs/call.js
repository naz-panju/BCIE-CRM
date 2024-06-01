import React, { useState } from 'react'
import { MenuItem, Pagination, Select, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import { AttachmentOutlined, CachedOutlined, Delete, Edit } from '@mui/icons-material';
import CommEmailDetailModal from '../details/email/detailModal';
import ConfirmPopup from '@/Components/Common/Popup/confirm';
import { PhoneCallApi } from '@/data/Endpoints/PhoneCall';
import toast from 'react-hot-toast';
import CommCallDetailModal from '../details/email copy/detailModal';


function CallTab({ list, setCallLimit, loading, handleEdit, handleRefresh,page,setPage,callLimit }) {
    const [detailId, setdetailId] = useState()

    const [deleteId, setdeleteId] = useState()
    const [deleteLoading, setdeleteLoading] = useState(false)

    const handleDeleteOpen = (id) => {
        setdeleteId(id)
    }

    const handleDelete = () => {
        setdeleteLoading(true)
        PhoneCallApi.delete({ id: deleteId }).then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response?.data?.message)
                setdeleteLoading(false)
                setdeleteId()
                handleRefresh()
            } else {
                toast.error(response?.response?.data?.message)
                setdeleteLoading(false)
            }
        }).catch((error) => {
            toast.error(error?.response?.data?.message)
            setdeleteLoading(false)
        })
    }

    const handleDetailOpen = (id) => {
        setdetailId(id)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setCallLimit(parseInt(event.target.value));
        // setPage(1);
    };

    console.log(page);



    return (

        <>
            {
                <CommCallDetailModal id={detailId} setId={setdetailId} />
            }

            <ConfirmPopup loading={deleteLoading} ID={deleteId} setID={setdeleteId} clickFunc={handleDelete} title={`Do you want to Delete this Call Summary?`} />

            <div>
                {
                    loading ?
                        loadingTab()
                        :
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell >
                                                <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                    Call Type
                                                </Typography>

                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                    Date and Time
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                    Summary
                                                </Typography>

                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            list?.data?.map((obj, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                        {/* <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleDetailOpen(obj?.id)}>
                                                            {
                                                                obj?.subject?.length > 50 ?
                                                                    <b> {obj?.subject?.slice(0, 50)} ...</b>
                                                                    :
                                                                    <b>{obj?.subject}</b>
                                                            }
                                                        </TableCell> */}
                                                        <TableCell onClick={() => handleDetailOpen(obj?.id)} sx={{cursor:'pointer'}} >{obj?.type}</TableCell>
                                                        <TableCell>{moment(obj?.date_time_of_call).format('DD-MM-YYYY HH:mm')}</TableCell>
                                                        <TableCell>{obj?.call_summary}</TableCell>
                                                        <TableCell>
                                                            <Edit onClick={() => handleEdit(obj?.id)} fontSize='small' sx={{ color: 'blue', cursor: 'pointer' }} />
                                                            <Delete onClick={() => handleDeleteOpen(obj?.id)} fontSize='small' sx={{ color: 'red', cursor: 'pointer', ml: 2 }} />
                                                        </TableCell>


                                                    </TableRow>)
                                            })
                                        }

                                    </TableBody>
                                </Table>

                            </TableContainer>


                            {
                                            list?.data?.length > 0 &&
                                            <div className='table-pagination d-flex justify-content-end align-items-center'>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <div className='select-row-box'>
                                                        <Select value={callLimit} onChange={handleChangeRowsPerPage} inputprops={{ 'aria-label': 'Rows per page' }}>
                                                            <MenuItem value={10}>10</MenuItem>
                                                            <MenuItem value={15}>15</MenuItem>
                                                            <MenuItem value={25}>25</MenuItem>
                                                        </Select>
                                                        <label>Rows per page</label>
                                                    </div>
                                                    <div>
                                                        <Stack spacing={2}>
                                                            <Pagination count={list?.meta?.last_page} variant="outlined" shape="rounded" page={page} onChange={handleChangePage} />
                                                        </Stack>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                        </>

                }
            </div>
        </>
    )
}

export default CallTab

const loadingTab = () => {
    return (
        <TableContainer>
            <Table>
                <TableBody>
                    {
                        [...Array(5)]?.map((_, index) => (
                            <TableRow key={index} className='table-custom-tr'>
                                {
                                    [...Array(3)]?.map((_, colindex) => (
                                        <TableCell key={colindex} align="left"><Skeleton variant='rounded' width={260} height={30} /></TableCell>
                                    ))
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

        </TableContainer>
    )
}
