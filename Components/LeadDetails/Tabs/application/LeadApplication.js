import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { LeadApi } from '@/data/Endpoints/Lead'
import moment from 'moment'
import { Edit, ExpandLess, ExpandMore } from '@mui/icons-material'
import { blue } from '@mui/material/colors'
import LeadApplicationModal from './create'
import { ApplicationApi } from '@/data/Endpoints/Application'
import { useRouter } from 'next/router'
import ApplicationStageChangeModal from '@/Components/Applications/Modals/stageChange'

function LeadApplication({ data, lead_id, handleStudentModalOpen }) {

    const router = useRouter()

    const [editId, setEditId] = useState()
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [reqId, setReqId] = useState()
    const [refresh, setRefresh] = useState(false)
    const [details, setDetails] = useState()


    const [stageId, setStageId] = useState()

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const [expandedRowId, setExpandedRowId] = useState(null);



    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
    };


    const handleExpand = (id) => {
        setExpandedRowId(id === expandedRowId ? null : id);
    };

    const isRowExpanded = (id) => {
        return expandedRowId === id;
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

    const handleStageOpen = (row) => {
        setStageId(row?.id)
        setDetails(row)
    }

    const fetchList = async () => {
        setLoading(true)
        const response = await ApplicationApi.list({ limit: limit, student_id: data?.student?.id, page: page + 1, })
        console.log(response);
        setList(response?.data)
        setLoading(false)
        handleExpand(router?.query?.app_id)
    }

    // console.log(list?.data);

    useEffect(() => {
        fetchList()
    }, [refresh, page])


    // useEffect(() => {
    //     handleExpand(router?.query?.app_id)
    // }, [list])

    console.log(expandedRowId);



    return (
        <>
            <LeadApplicationModal details={data} lead_id={lead_id} editId={editId} setEditId={setEditId} handleRefresh={handleRefresh} />
            <ApplicationStageChangeModal editId={stageId} setEditId={setStageId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />


            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <h2>Applications</h2>
                    <Grid display={'flex'} alignItems={'end'}>
                        <Grid>
                            <Button sx={{ mr: 2 }} disabled={data?.verification_status == 'Yes'} onClick={data && handleStudentModalOpen} variant='contained' className='bg-sky-600 text-white hover:bg-sky-700 text-white'>Submit Applicant Data</Button>
                        </Grid>
                        <Grid>
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
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Stage
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    list?.data?.map((obj, index) => (
                                                        <React.Fragment key={obj?.id}>
                                                            {/* sx={{ height: isRowExpanded(obj.id) ? 300 : null }} */}
                                                            <TableRow >
                                                                <TableCell>{obj?.university?.name}</TableCell>
                                                                <TableCell>{obj?.subject_area?.name}</TableCell>
                                                                <TableCell>{obj?.course}</TableCell>
                                                                <TableCell>{obj?.intake?.name}</TableCell>
                                                                {/* <TableCell>{obj?.stage?.name}</TableCell> */}

                                                                <TableCell >
                                                                    {isRowExpanded(obj?.id) ? (
                                                                        <ExpandLess
                                                                            onClick={() => handleExpand(obj?.id)}
                                                                            sx={{ color: blue[400], cursor: 'pointer' }}
                                                                            fontSize='small'
                                                                        />
                                                                    ) : (
                                                                        <ExpandMore
                                                                            onClick={() => handleExpand(obj?.id)}
                                                                            sx={{ color: blue[400], cursor: 'pointer' }}
                                                                            fontSize='small'
                                                                        />
                                                                    )}
                                                                </TableCell>                                                                <TableCell><Edit onClick={() => handleEditDocument(obj?.id)} sx={{ color: blue[400], cursor: 'pointer' }} fontSize='small' /></TableCell>
                                                            </TableRow>
                                                            {isRowExpanded(obj.id) && (
                                                                // <TableRow>
                                                                <TableCell colSpan={4} style={{ padding: 0, border: 'none' }} >
                                                                    <Grid container p={1}  style={{ width: '100%', height: 250 }}>
                                                                        <Grid p={1} item sx={{border:'1px solid grey',marginRight:1}} md={3.8}>
                                                                            University Deposit
                                                                        </Grid>
                                                                        <Grid p={1} item sx={{border:'1px solid grey',marginRight:1}}  md={3.8}>
                                                                            Student Documents
                                                                        </Grid>
                                                                        <Grid p={1} item sx={{border:'1px solid grey'}}  md={3.8}>
                                                                            University Documents
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid pl={1} pb={0.5}>
                                                                        <Button size='small' variant='contained' onClick={()=>handleStageOpen(obj)} className='bg-sky-500 text-white hover:bg-sky-600 text-white' >Change Stage</Button>
                                                                        <Button size='small' variant='outlined' sx={{ml:1}}>Defer Intake</Button>
                                                                        <Button size='small' variant='outlined' sx={{ml:1}}>Mail to University</Button>
                                                                        <Button size='small' variant='outlined' sx={{ml:1}}>Add Univer. Document</Button>
                                                                    </Grid>
                                                                   
                                                                </TableCell>
                                                                // </TableRow>
                                                            )}
                                                        </React.Fragment>
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
