import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { LeadApi } from '@/data/Endpoints/Lead'
import moment from 'moment'
import { Edit } from '@mui/icons-material'
import { blue } from '@mui/material/colors'
import LeadPaymentModal from './create'
import { PaymentApi } from '@/data/Endpoints/Payments'

function LeadPayments({ id }) {

    const [editId, setEditId] = useState()
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
    };


    const handleCreate = () => {
        setEditId(0)
    }

    const handleEditDocument = (id) => {
        setEditId(id)
    }

    const handleRefresh = () => {
        if (page != 0) {
            setPage(0)
        }
        setRefresh(!refresh)
    }

    const fetchList = async () => {
        setLoading(true)
        const response = await PaymentApi.list({ limit: limit, lead_id: id, page: page + 1 })
        setList(response?.data)
        setLoading(false)
    }

    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }

    // console.log(list?.data);

    useEffect(() => {
        fetchList()
    }, [refresh, page])

    return (
        <>
            <LeadPaymentModal lead_id={id} editId={editId} setEditId={setEditId} handleRefresh={handleRefresh} />

            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <h2>Payments</h2>
                    <Grid display={'flex'} alignItems={'end'}>
                        <Button onClick={handleCreate} className='bg-sky-500 mr-4' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Add</Button>
                    </Grid>
                </div>
                {
                    loading ?
                        loadTable()
                        :
                        <div className='no-follw-up-block'>
                            {
                                list?.data?.length > 0 ?

                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>

                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Amount
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Payment Mode
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Payment Date
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Receipt
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Details
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Created By
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Created Date
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    list?.data?.map((obj, index) => (
                                                        <TableRow key={obj?.id}>
                                                            {/* <TableCell><a href={obj?.file} target='_blank' style={{ color: blue[700], textDecoration: 'underLine' }} >{trimUrlAndNumbers(obj?.file)}</a></TableCell> */}
                                                            <TableCell>{obj?.amount}</TableCell>
                                                            <TableCell>{obj?.payment_mode}</TableCell>
                                                            <TableCell>{moment(obj?.payment_date).format('DD-MM-YYYY')}</TableCell>
                                                            <TableCell><a href={obj?.receipt_file} target='_blank' style={{ color: blue[700], textDecoration: 'underLine' }} >{trimUrlAndNumbers(obj?.receipt_file)}</a></TableCell>
                                                            <TableCell>
                                                                {
                                                                    obj?.details?.length > 50 ?

                                                                        <Tooltip title={obj?.details}>
                                                                            {obj?.details?.slice(0, 50) + '...'}
                                                                        </Tooltip>
                                                                        :
                                                                        obj?.details
                                                                }
                                                            </TableCell>
                                                            <TableCell>{obj?.created_by?.name}</TableCell>
                                                            <TableCell>{moment(obj?.created_at).format('DD-MM-YYYY')}</TableCell>
                                                            <TableCell>{obj?.uploaded_by?.name}</TableCell>
                                                            <TableCell><Edit onClick={() => handleEditDocument(obj?.id)} sx={{ color: blue[400], cursor: 'pointer' }} fontSize='small' /></TableCell>
                                                        </TableRow>
                                                    ))
                                                }

                                            </TableBody>
                                        </Table>

                                        <TablePagination
                                            rowsPerPageOptions={[10, 15, 25]}
                                            component="div"
                                            count={list?.meta?.total || 0}
                                            rowsPerPage={list?.meta?.per_page || 0}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </TableContainer>

                                    :
                                    <h4>No Payments Found</h4>
                            }
                        </div>
                }

            </div>
        </>
    )
}

export default LeadPayments

const loadTable = () => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {[...Array(5)].map((_, index) => (
                        <TableCell key={index} align="left">
                            <Skeleton variant='rounded' width={60} height={20} />
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    [...Array(5)]?.map((_, index) => (
                        <TableRow key={index} className='table-custom-tr'>
                            {
                                [...Array(5)]?.map((_, colindex) => (
                                    <TableCell key={colindex} align="left"><Skeleton variant='rounded' width={120} height={20} /></TableCell>
                                ))
                            }
                        </TableRow>
                    ))
                }

            </TableBody>
        </Table>
    )

}
