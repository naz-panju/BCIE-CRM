import React, { useState } from 'react'
import { Grid, MenuItem, Pagination, Select, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import { AttachmentOutlined, CachedOutlined } from '@mui/icons-material';
import CommEmailDetailModal from '../details/email/detailModal';


function WhatsappTab({ list, setwhatsappLimit, loading, page, setPage, whatsappLimit }) {
    const [detailId, setdetailId] = useState()

    // console.log(list);

    const handleDetailOpen = (id) => {
        setdetailId(id)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        whatsappLimit(parseInt(event.target.value));
        // setPage(1);
    };

    return (

        <>
            {
                <CommEmailDetailModal id={detailId} setId={setdetailId} />
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
                                                                Type
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                                From
                                                            </Typography>

                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                                To
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
                                                                    <TableCell>{obj?.type}</TableCell>
                                                                    <TableCell>{obj?.from}</TableCell>
                                                                    <TableCell>{obj?.to}</TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            obj?.attachments?.length > 0 &&
                                                                            <AttachmentOutlined fontSize='small' sx={{ color: 'grey' }} />
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            moment(obj?.message_date).isSame(moment(), 'day') ?
                                                                                moment(obj?.message_date).format('HH:mm')
                                                                                :
                                                                                moment(obj?.message_date).format('DD MMM')
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
                                                        <Select value={emailLimit} onChange={handleChangeRowsPerPage} inputprops={{ 'aria-label': 'Rows per page' }}>
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
