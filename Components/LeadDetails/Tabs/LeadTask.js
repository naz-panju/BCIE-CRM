import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Pagination, Paper, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@mui/material'
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
import { Stack } from 'rsuite'
import { useSession } from 'next-auth/react'

function LeadTask({ lead_id, from, app_id, taskRefresh, handleTaskRefresh,detailRefresh }) {

    const session = useSession()


    const [editId, setEditId] = useState()
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [reqId, setReqId] = useState()
    const [refresh, setRefresh] = useState(false)

    const [page, setPage] = useState(1);
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
        if (page != 1) {
            setPage(1)
        }
        handleTaskRefresh()
    }

    const fetchList = async () => {
        setLoading(true)
        let params = {
            lead_id: lead_id,
            limit,
            page: page
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

            <CreateTask lead_id={lead_id} from={from} app_id={app_id} editId={editId} setEditId={setEditId} refresh={refresh} setRefresh={setRefresh} handleRefresh={handleRefresh} detailRefresh={detailRefresh} />
            <TaskCompletePopup getDetails={fetchList} ID={completeId} setID={setcompleteId} loading={completeLoading} setLoading={setcompleteLoading} title={'Mark this Task as Completed'} />
            <TaskDetailModal id={detailId} setId={setDetailId} />

            {/* {
                taskDetails &&
                <StatusModal onUpdate={fetchList} setDataSet={setTaskDetails} dataSet={taskDetails} setOpen={setStatusOpen} Open={statusOpen} />
            } */}

            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <div className='lead-detail-title'>
                        Find Tasks
                    </div>
                    {
                        session?.data?.user?.role?.id != 6 &&
                        <Grid display={'flex'} alignItems={'end'}>
                            <Button className='Request-Document-btn' onClick={handleCreate}><svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 10.5H10.5M10.5 10.5H14M10.5 10.5V14M10.5 10.5V7M3.5 14.7002V6.30017C3.5 5.32008 3.5 4.82967 3.69074 4.45532C3.85852 4.12604 4.12604 3.85852 4.45532 3.69074C4.82967 3.5 5.32008 3.5 6.30017 3.5H14.7002C15.6803 3.5 16.1701 3.5 16.5444 3.69074C16.8737 3.85852 17.1417 4.12604 17.3094 4.45532C17.5002 4.82967 17.5002 5.31971 17.5002 6.29981V14.6998C17.5002 15.6799 17.5002 16.17 17.3094 16.5443C17.1417 16.8736 16.8737 17.1417 16.5444 17.3094C16.1704 17.5 15.6813 17.5 14.7031 17.5H6.29729C5.31912 17.5 4.8293 17.5 4.45532 17.3094C4.12604 17.1417 3.85852 16.8737 3.69074 16.5444C3.5 16.1701 3.5 15.6803 3.5 14.7002Z" stroke="#3D405D" strokeWidth="1.4" strokeLinecap="round" stroke-linejoin="round" />
                            </svg> Add Task</Button>
                        </Grid>
                    }
                </div>
                {
                    loading ?
                        loadTable()
                        :
                        <div className='no-follw-up-block app_tab_cntr'>


                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow style={{ backgroundColor: '#232648' }}>
                                            <TableCell>

                                                <Typography style={{ color: '#ffffff' }} className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                    Title
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography style={{ color: '#ffffff' }} className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                    Assigned To
                                                </Typography>
                                            </TableCell>
                                            {/* <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Reviewer
                                                        </Typography>
                                                    </TableCell> */}
                                            <TableCell>
                                                <Typography style={{ color: '#ffffff' }} className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                    Due Date
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography style={{ color: '#ffffff' }} className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                    Status
                                                </Typography>
                                            </TableCell>
                                            <TableCell>

                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {
                                        list?.data?.length > 0 ?
                                            <TableBody>
                                                {
                                                    list?.data?.map((obj, index) => (
                                                        <TableRow key={obj?.id}>
                                                            <TableCell onClick={() => handleDetailOpen(obj?.id)} sx={{ cursor: 'pointer' }}>{obj?.title}</TableCell>
                                                            <TableCell>{obj?.assignedToUser?.name}</TableCell>
                                                            {/* <TableCell >{obj?.reviewer?.name}</TableCell> */}
                                                            <TableCell >
                                                                {
                                                                    obj?.due_date ?
                                                                        moment(obj?.due_date).format('DD-MM-YYYY')
                                                                        : 'NA'
                                                                }
                                                            </TableCell>
                                                            {/* <TableCell >{obj.priority}</TableCell> */}
                                                            {/* <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleStatusChange(obj)}>{obj.status}</TableCell> */}
                                                            <TableCell sx={{ width: 180 }}>
                                                                {
                                                                    obj?.status == 'Completed' ?
                                                                        <Tooltip title={obj?.status_note}>
                                                                            Completed
                                                                        </Tooltip>
                                                                        :

                                                                        session?.data?.user?.role?.id != 6 &&
                                                                        <Button onClick={() => completeOpen(obj?.id)} size='small' variant='outlined' sx={{ textTransform: 'none' }}>Mark as Completed</Button>
                                                                }

                                                                {/* <Button sx={{ textTransform: 'none', }} onClick={() => handleEdit(obj?.id)}><Edit fontSize='small' /></Button> */}
                                                            </TableCell>
                                                            <TableCell >
                                                                {
                                                                    session?.data?.user?.role?.id != 6 &&
                                                                    obj?.status !== 'Completed' &&
                                                                    <Button sx={{ textTransform: 'none' }} onClick={() => handleEdit(obj?.id)}><Edit fontSize='small' /></Button>
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }

                                            </TableBody>
                                            :
                                            (
                                                <TableBody>
                                                    <TableRow sx={{ height: 250, color: 'transparent' }}>
                                                        <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                                                            No Data Available
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            )}
                                </Table>
                            </TableContainer>

                            {
                                list?.data?.length > 0 &&
                                <div className='table-pagination d-flex justify-content-end align-items-center'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div className='select-row-box'>
                                            <Select value={limit} onChange={handleChangeRowsPerPage} inputprops={{ 'aria-label': 'Rows per page' }}>
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
