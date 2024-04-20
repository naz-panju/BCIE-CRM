import React, { useState } from 'react'
import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import { AttachmentOutlined, CachedOutlined } from '@mui/icons-material';
import CommEmailDetailModal from '../details/email/detailModal';


function WhatsappTab({ list, setwhatsappLimit, loading }) {
    const [detailId, setdetailId] = useState()

    // console.log(list);

    const handleDetailOpen = (id) => {
        setdetailId(id)
    }

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
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            
                                            <TableCell>
                                                <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                    Whatsapp Type
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


                            {(list?.meta?.total != list?.meta?.to && list?.meta?.total != 0) &&
                                <div className='loadmore-btn-block' style={{ marginTop: 15 }}>
                                    <button className='loadmore-btn' onClick={setwhatsappLimit} > <CachedOutlined />Load More </button>
                                </div>}
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
