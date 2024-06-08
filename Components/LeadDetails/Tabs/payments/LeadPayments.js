import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Pagination, Paper, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { LeadApi } from '@/data/Endpoints/Lead'
import moment from 'moment'
import { Edit } from '@mui/icons-material'
import { blue } from '@mui/material/colors'
import LeadPaymentModal from './create'
import { PaymentApi } from '@/data/Endpoints/Payments'
import { Stack } from 'rsuite'
import { useSession } from 'next-auth/react'

function LeadPayments({ lead_id, from, app_id }) {

    const session = useSession()

    const [editId, setEditId] = useState()
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value));
        setPage(1);
    };


    const handleCreate = () => {
        setEditId(0)
    }

    const handleEditDocument = (id) => {
        setEditId(id)
    }

    const handleRefresh = () => {
        if (page != 1) {
            setPage(1)
        }
        setRefresh(!refresh)
    }

    const fetchList = async () => {
        setLoading(true)
        let params = {
            lead_id,
            limit,
            page: page
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        const response = await PaymentApi.list(params)
        setList(response?.data)
        setLoading(false)
    }

    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }


    useEffect(() => {
        fetchList()
    }, [refresh, page])

    return (
        <>
            <LeadPaymentModal lead_id={lead_id} from={from} app_id={app_id} editId={editId} setEditId={setEditId} handleRefresh={handleRefresh} />

            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <div className='lead-detail-title'>
                        Find payments and invoice
                    </div>
                    {
                        session?.data?.user?.role?.id != 6 &&
                        <Grid display={'flex'} alignItems={'end'}>
                            <Button sx={{ textTransform: 'none' }} onClick={handleCreate} className='Request-Document-btn' ><svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 10.5H10.5M10.5 10.5H14M10.5 10.5V14M10.5 10.5V7M3.5 14.7002V6.30017C3.5 5.32008 3.5 4.82967 3.69074 4.45532C3.85852 4.12604 4.12604 3.85852 4.45532 3.69074C4.82967 3.5 5.32008 3.5 6.30017 3.5H14.7002C15.6803 3.5 16.1701 3.5 16.5444 3.69074C16.8737 3.85852 17.1417 4.12604 17.3094 4.45532C17.5002 4.82967 17.5002 5.31971 17.5002 6.29981V14.6998C17.5002 15.6799 17.5002 16.17 17.3094 16.5443C17.1417 16.8736 16.8737 17.1417 16.5444 17.3094C16.1704 17.5 15.6813 17.5 14.7031 17.5H6.29729C5.31912 17.5 4.8293 17.5 4.45532 17.3094C4.12604 17.1417 3.85852 16.8737 3.69074 16.5444C3.5 16.1701 3.5 15.6803 3.5 14.7002Z" stroke="#3D405D" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                                Add Payment</Button>
                        </Grid>
                    }
                </div>

                {
                    loading ?
                        loadTable()
                        :
                        <div className='no-follw-up-block app_tab_cntr'>
                            {
                                list?.data?.length > 0 ?

                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>

                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            <Typography className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                                <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.25 0.25C4.66421 0.25 5 0.585786 5 1V1.47554C6.90313 1.77296 8.5 3.18172 8.5 5.08275C8.5 5.49696 8.16421 5.83275 7.75 5.83275C7.33579 5.83275 7 5.49696 7 5.08275C7 4.00932 5.90354 2.91725 4.25 2.91725C2.59646 2.91725 1.5 4.00932 1.5 5.08275C1.5 6.15819 2.59678 7.25 4.25 7.25C6.46459 7.25 8.5 8.7712 8.5 10.9172C8.5 12.8183 6.90313 14.227 5 14.5245V15C5 15.4142 4.66421 15.75 4.25 15.75C3.83579 15.75 3.5 15.4142 3.5 15V14.5245C1.59687 14.227 0 12.8183 0 10.9172C0 10.503 0.335786 10.1672 0.75 10.1672C1.16421 10.1672 1.5 10.503 1.5 10.9172C1.5 11.9907 2.59646 13.0828 4.25 13.0828C5.90354 13.0828 7 11.9907 7 10.9172C7 9.8433 5.90291 8.75 4.25 8.75C2.03572 8.75 0 7.23081 0 5.08275C0 3.18172 1.59687 1.77296 3.5 1.47554V1C3.5 0.585786 3.83579 0.25 4.25 0.25Z" fill="#232648" />
                                                                </svg>
                                                                Amount
                                                            </Typography>
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Payment Mode
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M2.75 4.74999H2.76759M2.76759 4.74999H19.2325M2.76759 4.74999C2.75 5.05127 2.75 5.42266 2.75 5.90018V15.1002C2.75 16.1736 2.75 16.7096 2.94982 17.1196C3.12559 17.4802 3.40585 17.7742 3.75081 17.958C4.14261 18.1667 4.65575 18.1667 5.68053 18.1667L16.3195 18.1667C17.3443 18.1667 17.8567 18.1667 18.2484 17.958C18.5934 17.7742 18.8746 17.4802 19.0504 17.1196C19.25 16.71 19.25 16.1743 19.25 15.1029L19.25 5.89703C19.25 5.42102 19.25 5.05061 19.2325 4.74999M2.76759 4.74999C2.78954 4.37403 2.83889 4.10724 2.94982 3.87963C3.12559 3.51899 3.40585 3.22599 3.75081 3.04223C4.14299 2.83333 4.65675 2.83333 5.68351 2.83333H16.3168C17.3436 2.83333 17.8563 2.83333 18.2484 3.04223C18.5934 3.22599 18.8746 3.51899 19.0504 3.87963C19.1613 4.10724 19.2106 4.37403 19.2325 4.74999M19.2325 4.74999H19.25M13.75 9.54166L10.0833 13.375L8.25 11.4583" stroke="#232648" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                            Paid Date
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Typography className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M1.5 5.25H15M12 1.5L15.75 5.25L12 9M16.5 12.75H3M6 9L2.25 12.75L6 16.5" stroke="black" stroke-width="1.5" />
                                                            </svg>
                                                            Details
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M13.125 16.625C13.125 14.692 10.7745 13.125 7.875 13.125C4.9755 13.125 2.625 14.692 2.625 16.625M18.375 8.75L14.875 12.25L13.125 10.5M7.875 10.5C5.942 10.5 4.375 8.933 4.375 7C4.375 5.067 5.942 3.5 7.875 3.5C9.808 3.5 11.375 5.067 11.375 7C11.375 8.933 9.808 10.5 7.875 10.5Z" stroke="#0B0D23" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                            Date & Creator
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M15.0694 16.6854C15.3462 16.4087 15.4894 16.0778 15.4994 15.6631C15.4894 16.0532 15.3454 16.4027 15.0666 16.6816C14.7765 16.9716 14.4099 17.1159 14.0006 17.116L15.0694 16.6854ZM15.0694 16.6854C14.7823 16.9726 14.4368 17.116 14 17.116L15.0694 16.6854ZM15.2739 1.116L15.5 0.958283V1.116H15.2739ZM13.4231 0.604554L14.1799 1.116H12.6669L13.4231 0.604554ZM10.808 0.604482L11.5649 1.116H10.0511L10.808 0.604482ZM8.19211 0.603768L8.94917 1.116H7.43563L8.19211 0.603768ZM5.57711 0.603768L6.33417 1.116H4.82063L5.57711 0.603768ZM3.5 0.958232L3.72666 1.116H3.5V0.958232ZM12.5 17.116V16.616V15.616C12.5 16.0255 12.6442 16.3923 12.9344 16.6826C13.223 16.9711 13.5872 17.1153 13.9939 17.116H12.5ZM1.95635 17.1155C1.54005 17.1062 1.20804 16.9629 0.930553 16.6854C0.642323 16.3972 0.5 16.0542 0.5 15.625V15.616C0.5 16.0255 0.644231 16.3923 0.934447 16.6826C1.21409 16.9622 1.56481 17.1062 1.95635 17.1155ZM12.885 4.886C12.818 4.886 12.7633 4.86715 12.6986 4.80245C12.6338 4.73774 12.615 4.68296 12.615 4.616C12.615 4.54904 12.6338 4.49426 12.6986 4.42955C12.7633 4.36485 12.818 4.346 12.885 4.346C12.9519 4.346 13.0059 4.36475 13.0697 4.42878C13.1343 4.49368 13.1538 4.54934 13.154 4.61761C13.1542 4.68326 13.136 4.73716 13.0712 4.80168C13.0047 4.86793 12.9502 4.886 12.885 4.886ZM12.884 7.886C12.8182 7.886 12.7636 7.8675 12.6986 7.80245C12.6338 7.73774 12.615 7.68296 12.615 7.616C12.615 7.54904 12.6338 7.49426 12.6986 7.42955C12.7633 7.36485 12.818 7.346 12.885 7.346C12.9519 7.346 13.0059 7.36475 13.0697 7.42878C13.1343 7.49368 13.1538 7.54934 13.154 7.61761C13.1542 7.68326 13.136 7.73716 13.0712 7.80168C13.0052 7.86741 12.9499 7.886 12.884 7.886Z" fill="black" stroke="black" />
                                                            </svg>
                                                            Reciept
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
                                                            <TableCell>{obj?.created_by?.name}<br />{moment(obj?.created_at).format('DD-MM-YYYY')}</TableCell>
                                                            <TableCell><a href={obj?.receipt_file} target='_blank' style={{ color: blue[700], textDecoration: 'underLine' }} ><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M4.1582 10.5093L10.478 4.18953C12.3574 2.31013 15.4045 2.31013 17.2839 4.18953C19.1633 6.06893 19.1631 9.1162 17.2837 10.9956L9.99166 18.2876C8.73873 19.5406 6.70767 19.5404 5.45473 18.2875C4.2018 17.0345 4.2015 15.0033 5.45443 13.7504L12.7465 6.45837C13.3729 5.83191 14.3892 5.83191 15.0156 6.45837C15.6421 7.08484 15.6417 8.1003 15.0152 8.72676L8.69543 15.0465" stroke="#0B0D23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                            </a></TableCell>

                                                            <TableCell><Edit onClick={() => handleEditDocument(obj?.id)} sx={{ color: blue[400], cursor: 'pointer' }} fontSize='small' /></TableCell>
                                                        </TableRow>
                                                    ))
                                                }

                                            </TableBody>
                                        </Table>

                                    </TableContainer>


                                    :
                                    <h4>No Payments Found</h4>
                            }
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
