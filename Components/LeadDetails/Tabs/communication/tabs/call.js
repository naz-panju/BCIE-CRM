import React, { useState } from 'react'
import { Grid, MenuItem, Pagination, Select, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import { AttachmentOutlined, CachedOutlined, Delete, Edit } from '@mui/icons-material';
import CommEmailDetailModal from '../details/email/detailModal';
import ConfirmPopup from '@/Components/Common/Popup/confirm';
import { PhoneCallApi } from '@/data/Endpoints/PhoneCall';
import toast from 'react-hot-toast';
import CommCallDetailModal from '../details/email copy/detailModal';


function CallTab({ list, setCallLimit, loading, handleEdit, handleRefresh, page, setPage, callLimit }) {
    const [detailId, setdetailId] = useState()

    const [deleteId, setdeleteId] = useState()
    const [deleteLoading, setdeleteLoading] = useState(false)

    const handleDeleteOpen = (id) => {
        setdeleteId(id)
    }

    const handleDelete = () => {
        setdeleteLoading(true)
        PhoneCallApi.delete({ id: deleteId }).then((response) => {
            // console.log(response);
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
                            {
                                list?.data?.length > 0 ?
                                    <>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        {/* <TableCell >
                                                            <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                                Call Type
                                                            </Typography>

                                                        </TableCell> */}
                                                        <TableCell>
                                                            <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                                Summary
                                                            </Typography>

                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                                Date and Time
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            
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
                                                                    {/* <TableCell onClick={() => handleDetailOpen(obj?.id)} >

                                                                        {obj?.type}
                                                                    </TableCell> */}

                                                                    <TableCell sx={{
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        paddingLeft: '0px'

                                                                    }}>
                                                                        <Tooltip title={obj?.type}>
                                                                            <div style={{
                                                                                padding: 0,
                                                                                width: '3px',  // Width of the vertical line
                                                                                borderLeft: obj?.type == 'Outbound' ? '3px solid blue' : '3px solid green',  // Vertical line
                                                                                height: '23px',  // Full height of the TableCell
                                                                                marginRight: '8px',  // Space between the line and the text
                                                                                marginLeft: '0%'
                                                                            }}></div>
                                                                        </Tooltip>
                                                                        {
                                                                            obj?.call_summary?.length > 50 ?
                                                                               <a>{ obj?.call_summary?.slice(0, 50) +'...'}</a>
                                                                                :
                                                                             <a onClick={() => handleDetailOpen(obj?.id)} className='a_hover'> {obj?.call_summary}</a>
                                                                        }
                                                                        {/* {obj?.call_summary} */}
                                                                    </TableCell>

                                                                    <TableCell>{moment(obj?.date_time_of_call).format('DD-MM-YYYY hh:mm A')}</TableCell>

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
                                    :
                                    <Grid display={'flex'} alignItems={'center'} justifyContent={'center'} height={200} > No Logs Found</Grid>
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
