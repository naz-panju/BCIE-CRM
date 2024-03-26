import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { LeadApi } from '@/data/Endpoints/Lead'
import moment from 'moment'
import { Edit } from '@mui/icons-material'
import { blue } from '@mui/material/colors'
import LeadApplicationModal from './create'
import { ApplicationApi } from '@/data/Endpoints/Application'

function LeadApplication({ data, lead_id }) {

    const [editId, setEditId] = useState()
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [reqId, setReqId] = useState()
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
    const handleRequest = () => {
        setReqId(0)
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
        const response = await ApplicationApi.list({ limit: limit, student_id: data?.student?.id, page: page + 1, })
        setList(response?.data)
        setLoading(false)
    }

    // console.log(list?.data);

    useEffect(() => {
        fetchList()
    }, [refresh, page])

    return (
        <>
            <LeadApplicationModal details={data} lead_id={lead_id} editId={editId} setEditId={setEditId} handleRefresh={handleRefresh} />

            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <h2>Applications</h2>
                    <Grid display={'flex'} alignItems={'end'}>
                        {
                            data?.student?.id ?
                                <Button variant='contained' disabled={data?.verification_status != 'Yes'} onClick={handleCreate} className='bg-sky-500 mr-4' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Apply</Button>
                                :
                                <Tooltip title="Only for Students" >
                                    <a>
                                        <Button variant='contained' disabled={true} className='bg-sky-500 mr-4' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Apply</Button>
                                    </a>
                                </Tooltip>
                        }

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
                                                            University
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>

                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Subject Area
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Course
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Intake
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    list?.data?.map((obj, index) => (
                                                        <TableRow key={obj?.id}>
                                                            <TableCell>{obj?.university?.name}</TableCell>
                                                            <TableCell>{obj?.subject_area?.name}</TableCell>
                                                            <TableCell>{obj?.course}</TableCell>
                                                            <TableCell>{obj?.intake?.name}</TableCell>

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
                                    <h4>No Application Found</h4>
                            }
                        </div>
                }

            </div>
        </>
    )
}

export default LeadApplication

const loadTable = () => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {[...Array(4)].map((_, index) => (
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
                                [...Array(4)]?.map((_, colindex) => (
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
