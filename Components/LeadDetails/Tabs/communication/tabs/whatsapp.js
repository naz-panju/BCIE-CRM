import React, { useState } from 'react'
import { Button, Grid, MenuItem, Pagination, Select, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import { AttachmentOutlined, CachedOutlined, Visibility } from '@mui/icons-material';
import CommEmailDetailModal from '../details/email/detailModal';
import WhatsappMessageModal from '../Modals/WhatsappMessageModal';


function WhatsappTab({getShowNotification, list, setwhatsappLimit, loading, page, setPage, whatsappLimit, leadData }) {
    const [detailId, setdetailId] = useState()

    // console.log(list);

    const handleDetailOpen = (id) => {
        setdetailId(id)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setwhatsappLimit(parseInt(event.target.value));
        // setPage(1);
    };

    const [whatsappMessageId, setwhatsappMessageId] = useState()
    const handleWhatsMessageOpen = (id) => {
        setwhatsappMessageId(id)
    }

    return (
        <>
            {
                <WhatsappMessageModal editId={whatsappMessageId} setEditId={setwhatsappMessageId} leadData={leadData} />
            }
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

                                                        <TableCell>
                                                            <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                                Content
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>

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
                                                                                borderLeft: obj?.type == 'Whatsapp Send' ? '3px solid blue' : '3px solid green',  // Vertical line
                                                                                height: '23px',  // Full height of the TableCell
                                                                                marginRight: '8px',  // Space between the line and the text
                                                                                marginLeft: '0%'
                                                                            }}></div>
                                                                        </Tooltip>

                                                                        <b>{obj?.body}</b>

                                                                    </TableCell>

                                                                    <TableCell>
                                                                        {
                                                                            // index == 0 &&
                                                                            <Visibility onClick={() => handleWhatsMessageOpen(obj?.id)} className='text-gray-400  hover:text-gray-600 cursor-pointer text-[20px]' />
                                                                            // <span  className='bg-sky-700 p-2 rounded-[8px] shadow-lg hover:bg-sky-800' style={{ cursor: 'pointer', color: 'white' }}> View</span>
                                                                        }
                                                                    </TableCell>

                                                                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'right', minWidth: '150px' }}>
                                                                        {
                                                                            
                                                                                moment(obj?.message_date).format('DD MMM hh:mm A')
                                                                        }
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
                                                        <Select value={whatsappLimit} onChange={handleChangeRowsPerPage} inputprops={{ 'aria-label': 'Rows per page' }}>
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

export default WhatsappTab

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
