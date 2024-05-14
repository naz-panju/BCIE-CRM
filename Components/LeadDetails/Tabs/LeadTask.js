import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { LeadApi } from '@/data/Endpoints/Lead'
import moment from 'moment'
import { CheckCircle, CheckCircleOutline, Edit } from '@mui/icons-material'
import { blue } from '@mui/material/colors'
import { ApplicationApi } from '@/data/Endpoints/Application'
import { TaskApi } from '@/data/Endpoints/Task'
import CreateTask from '@/Components/Task/Create/Create'
import TaskDetailModal from '@/Components/TaskDetails/Modal'
import StatusModal from '@/Components/Task/StatusModal'
import TaskCompletePopup from '../Modals/TaskCompleteModal'

function LeadTask({ lead_id, from, app_id, taskRefresh, handleTaskRefresh }) {

    const [editId, setEditId] = useState()
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [reqId, setReqId] = useState()
    const [refresh, setRefresh] = useState(false)

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const [taskDetails, setTaskDetails] = useState()
    const [statusOpen, setStatusOpen] = useState(false)
    const [detailId, setDetailId] = useState()

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

    const handleEdit = (id) => {
        setEditId(id)
    }

    const handleDetailOpen = (id) => {
        setDetailId(id)
    }

    const handleStatusChange = (data) => {
        setStatusOpen(true)
        setTaskDetails(data)
    }

    const handleRefresh = () => {
        if (page != 0) {
            setPage(0)
        }
        handleTaskRefresh()
    }

    const fetchList = async () => {
        setLoading(true)
        let params = {
            lead_id: lead_id,
            limit,
            page: page + 1
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        const response = await TaskApi.list(params)
        setList(response?.data)
        setLoading(false)
    }

    const [completeId, setcompleteId] = useState()
    const [completeLoading, setcompleteLoading] = useState(false)

    const completeOpen = (id) => {
        setcompleteId(id)
    }


    useEffect(() => {
        fetchList()
    }, [taskRefresh, page])

    return (
        <>

            <CreateTask lead_id={lead_id} from={from} app_id={app_id} editId={editId} setEditId={setEditId} refresh={refresh} setRefresh={setRefresh} handleRefresh={handleRefresh} />
            <TaskCompletePopup ID={completeId} setID={setcompleteId} loading={completeLoading} setLoading={setcompleteLoading} title={'Mark as Complete'} />
            <TaskDetailModal id={detailId} setId={setDetailId} />

            {
                taskDetails &&
                <StatusModal onUpdate={fetchList} setDataSet={setTaskDetails} dataSet={taskDetails} setOpen={setStatusOpen} Open={statusOpen} />
            }

            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <h2>Task</h2>
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
                                                            Title
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Assigned To
                                                        </Typography>
                                                    </TableCell>
                                                    {/* <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Reviewer
                                                        </Typography>
                                                    </TableCell> */}
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Due Date
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Priority
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Status
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    list?.data?.map((obj, index) => (
                                                        <TableRow key={obj?.id}>
                                                            <TableCell onClick={() => handleDetailOpen(obj?.id)} sx={{ cursor: 'pointer' }}>{obj?.title}</TableCell>
                                                            <TableCell>{obj?.assignedToUser?.name}</TableCell>
                                                            {/* <TableCell >{obj?.reviewer?.name}</TableCell> */}
                                                            <TableCell >{moment(obj?.due_date).format('DD-MM-YYYY')}</TableCell>
                                                            <TableCell >{obj.priority}</TableCell>
                                                            <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleStatusChange(obj)}>{obj.status}</TableCell>
                                                            <TableCell >
                                                                <Tooltip title={'Mark Task as Complete'}>
                                                                    <CheckCircleOutline style={{cursor:'pointer'}} onClick={() => completeOpen(obj?.id)} />
                                                                </Tooltip>
                                                            </TableCell>
                                                            <TableCell ><Button style={{ textTransform: 'none' }} onClick={() => handleEdit(obj?.id)}><Edit fontSize='small' /></Button></TableCell>    </TableRow>
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
                                    <h4>No Task Found</h4>
                            }
                        </div>
                }

            </div>
        </>
    )
}

export default LeadTask

const loadTable = () => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {[...Array(3)].map((_, index) => (
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
                                [...Array(3)]?.map((_, colindex) => (
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
