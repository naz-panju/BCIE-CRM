import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid, MenuItem, Pagination, Select, Stack, TextField, styled } from '@mui/material';
import LoadingTable from '../Common/Loading/LoadingTable';
import { ApplicationApi } from '@/data/Endpoints/Application';
import 'reactjs-popup/dist/index.css';
import DownloadDocumentModal from './Modals/downloadDocument';
import { ListingApi } from '@/data/Endpoints/Listing';
import AsyncSelect from "react-select/async";
import ApplicationStageChangeModal from '../LeadDetails/Tabs/application/modals/stageChange';
import DeferIntake from '../LeadDetails/Tabs/application/modals/deferIntake';
import ViewDocumentModal from '../LeadDetails/Tabs/application/modals/viewDocModal';
import SendUniversityMail from '../LeadDetails/Tabs/application/modals/mailToUniversity';
import UniversityDeposit from '../LeadDetails/Tabs/application/modals/universityDepost';
import { AssignmentReturn, Autorenew, InfoOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import ReturnPopup from './Modals/returnModal';
import ApplicationDetail from './Modals/Details';


function createData(id, name, calories, fat, carbs, protein) {
    return {
        id,
        name,
        calories,
        fat,
        carbs,
        protein,
    };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array?.map((el, index) => [el, index]);
    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis?.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    // {
    //     id: 'email',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'email ',
    // },
    // {
    //     id: 'phone',
    //     numeric: true,
    //     disablePadding: false,
    //     label: 'Phone Number ',
    // },
    {
        id: 'country',
        numeric: false,
        disablePadding: false,
        label: 'Country',
    },
    {
        id: 'university',
        numeric: false,
        disablePadding: false,
        label: 'University',
    },
    {
        id: 'course_level',
        numeric: false,
        disablePadding: false,
        label: 'Course Level',
    },
    {
        id: 'course',
        numeric: false,
        disablePadding: false,
        label: 'Course',
    },
    {
        id: 'subject_area',
        numeric: false,
        disablePadding: false,
        label: 'Subject Area',
    },
    {
        id: 'intake',
        numeric: false,
        disablePadding: false,
        label: 'Intake',
    },
    {
        id: 'stage',
        numeric: false,
        disablePadding: false,
        label: 'Stage',
    },
    {
        id: 'deposit',
        numeric: false,
        disablePadding: false,
        label: 'Uni.Deposit',
    },
    {
        id: 'return',
        numeric: false,
        disablePadding: false,
        label: '',
    },
    {
        id: 'icons',
        numeric: false,
        disablePadding: false,
        label: '',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };


    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'left' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Nutrition
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip placement="right" {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

export default function ApplicationUnsubmittedTable({ refresh, editId, setEditId, page, setPage, setRefresh, searchType, nameSearch, searchActive }) {

    const router = useRouter();

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()


    // const pageNumber = parseInt(router?.asPath?.split("=")[1] - 1 || 0);


    // console.log(router);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    // const [page, setPage] = React.useState(pageNumber);
    const [dense, setDense] = React.useState(false);
    const [limit, setLimit] = React.useState(10);
    const [list, setList] = useState([])

    const [loading, setLoading] = useState(false)

    const [details, setDetails] = useState()

    const [selectedCountry, setselectedCountry] = useState()
    const [selectedUniversity, setselectedUniversity] = useState()
    const [selectedIntake, setselectedIntake] = useState()
    const [selectedStream, setselectedStream] = useState()

    const [stageId, setStageId] = useState()
    const [uniDocId, setuniDocId] = useState()
    const [applicationId, setapplicationId] = useState()
    const [downloadId, setDownloadId] = useState()
    const [mailId, setMailId] = useState()
    const [depositId, setdepositId] = useState()
    const [deferId, setdeferId] = useState()
    const [documentId, setdocumentId] = useState()

    const handleUniDocOpen = (id) => {
        setuniDocId(0)
        setapplicationId(id)
    }
    const handleDeferOpen = (data) => {
        setDetails(data)
        setdeferId(0)
    }
    const handleDocOpen = (data) => {
        setDetails(data)
        setdocumentId(data?.id)
    }
    const handleDepositOpen = (data) => {
        setDetails(data)
        setdepositId(0)
    }
    const handleDepositEdit = (data) => {
        setDetails(data)
        setdepositId(data?.id)
    }


    const fetchCountry = (e) => {
        return ListingApi.country({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const fetchUniversity = (e) => {
        return ListingApi.universities({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const fetchIntakes = (e) => {
        return ListingApi.intakes({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const fetchSubjectAreas = (e) => {
        return ListingApi.subjectAreas({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = list?.data?.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected?.slice(1));
        } else if (selectedIndex === selected?.length - 1) {
            newSelected = newSelected.concat(selected?.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected?.slice(0, selectedIndex),
                selected?.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        // console.log(newPage);
        router.replace(`/applications?page=${newPage}`);
        // router.push(`/lead?page=${newPage + 1}`);
    };


    const handleEdit = (id) => {
        setEditId(id)
    }

    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value));
        setPage(1);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };


    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 1 ? Math.max(0, (page) * limit - list?.meta?.total?.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(list?.data, getComparator(order, orderBy))?.slice(
                page * limit,
                page * limit + limit,
            ),
        [order, orderBy, page, limit],
    );

   

    const handleDownloadOpen = (id) => {
        setDownloadId(id)
    }


    const handleMailOpen = (data) => {
        setDetails(data)
        setMailId(0)
    }
    const handleStageOpen = (row) => {
        setDetails(row)
        setStageId(row?.id)
    }

    const handleCountryChange = (data) => {
        setValue('country', data || '')
        setselectedCountry(data?.id)
    }

    const handleUniversityChange = (data) => {
        setValue('university', data || '')
        setselectedUniversity(data?.id)
    }

    const handleIntakeChange = (data) => {
        setValue('intake', data || '')
        setselectedIntake(data?.id)
    }

    const handleStreamChange = (data) => {
        setValue('subjectarea', data || '')
        setselectedStream(data?.id)
    }

    const [searchRefresh, setsearchRefresh] = useState(false)

    const onSearch = () => {
        setsearchRefresh(!searchRefresh)
    }
    const handleClearSearch = (from) => {
        // if (watch('nameSearch') || watch('emailSearch') || watch('numberSearch') || watch('lead_id_search') || watch('assignedTo') || watch('stage')) {
        setValue('nameSearch', '')
        setValue('emailSearch', '')
        setValue('numberSearch', '')
        setValue('lead_id_search', '')

        setValue('assignedTo', null)
        setValue('country', '')
        setValue('university', '')
        setValue('subjectarea', '')
        setValue('intake', '')

        setselectedCountry()
        setselectedIntake()
        setselectedUniversity()
        setselectedStream()

        setsearchRefresh(!searchRefresh)
    }


    const fetchTable = () => {
        setLoading(true)

        let params = {
            limit: limit,
            // application statuses:unsubmitted,
            unsubmitted: 1,
            // status: 'Admission Completed',
            country_id: selectedCountry,
            university_id: selectedUniversity,
            intake_id: selectedIntake,
            name: watch('nameSearch'),
            email: watch('emailSearch'),
            phone_number: watch('numberSearch'),
            lead_id: watch('lead_id_search'),
            page: page
        }
        params['application statuses'] = 'unsubmitted'
        ApplicationApi.list(params).then((response) => {
            console.log(response);
            setList(response?.data)
            setLoading(false)
        }).catch((error) => {
            console.log(error);
            setLoading(false)
        })
    }

    const handleRefresh = () => {
        setRefresh(!refresh)
    }

    const [confirmLoading, setconfirmLoading] = useState(false)
    const [returnId, setreturnId] = useState()
    const handleReturnPopupOpen = (id) => {
        setreturnId(id)
    }
    const handleFirstPage = () => {
        setPage(1)
    }

    const [detailId, setDetailId] = useState()
    const handleDetailOpen = (id) => {
        setDetailId(id)
    }

    


    useEffect(() => {
        fetchTable()
    }, [page, refresh, limit, searchRefresh])


    return (

        <>
            {/* <EmailTemplateDetailModal id={detailId} setId={setDetailId} /> */}
            <DownloadDocumentModal editId={downloadId} setEditId={setDownloadId} />
            <ApplicationStageChangeModal editId={stageId} setEditId={setStageId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />
            <DeferIntake editId={deferId} setEditId={setdeferId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />
            <ViewDocumentModal editId={documentId} setEditId={setdocumentId} details={details} setDetails={setDetails} handleUniDocOpen={handleUniDocOpen} fetchTable={fetchTable} />
            <SendUniversityMail from={'lead'} details={details} lead_id={details?.lead_id} editId={mailId} setEditId={setMailId} />
            <UniversityDeposit editId={depositId} setEditId={setdepositId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />

            <ReturnPopup getDetails={handleFirstPage} loading={confirmLoading} ID={returnId} setID={setreturnId} setLoading={setconfirmLoading} title={`Do you want to return this Application to the Counsellor?`} />

            <ApplicationDetail id={detailId} setId={setDetailId} />

            <div className="filter_sec">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none" className='sear-ic'>
                                <path d="M13 17C14.1046 17 15.0454 16.0899 14.7951 15.0141C14.1723 12.338 12.0897 11 8 11C3.91032 11 1.8277 12.338 1.20492 15.0141C0.954552 16.0899 1.89543 17 3 17H13Z" stroke="#0B0D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 8C10 8 11 7 11 4.5C11 2 10 1 8 1C6 1 5 2 5 4.5C5 7 6 8 8 8Z" stroke="#0B0D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <AsyncSelect
                                isClearable
                                defaultOptions
                                name='country'
                                value={watch('country')}
                                defaultValue={watch('country')}
                                loadOptions={fetchCountry}
                                getOptionLabel={(e) => e.name}
                                getOptionValue={(e) => e.id}
                                placeholder={<div>Country</div>}
                                onChange={handleCountryChange}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='form-group'>

                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" fill="none" className='sear-ic'>
                                <path d="M19 9.00012L10 13.0001L1 9.00012M19 5.00012L10 9.00012L1 5.00012L10 1.00012L19 5.00012Z" stroke="#0B0D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <AsyncSelect
                                isClearable
                                defaultOptions
                                name='university'
                                value={watch('university')}
                                defaultValue={watch('university')}
                                loadOptions={fetchUniversity}
                                getOptionLabel={(e) => e.name}
                                getOptionValue={(e) => e.id}
                                placeholder={<div>University</div>}
                                onChange={handleUniversityChange}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" className='sear-ic'>
                                <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <AsyncSelect
                                isClearable
                                defaultOptions
                                name='intake'
                                value={watch('intake')}
                                defaultValue={watch('intake')}
                                loadOptions={fetchIntakes}
                                getOptionLabel={(e) => e.name}
                                getOptionValue={(e) => e.id}
                                placeholder={<div>Intake</div>}
                                onChange={handleIntakeChange}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" className='sear-ic'>
                                <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <AsyncSelect
                                isClearable
                                defaultOptions
                                name='subjectarea'
                                value={watch('subjectarea')}
                                defaultValue={watch('subjectarea')}
                                loadOptions={fetchSubjectAreas}
                                getOptionLabel={(e) => e.name}
                                getOptionValue={(e) => e.id}
                                placeholder={<div> subject Area</div>}
                                onChange={handleStreamChange}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" className='sear-ic'>
                                <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <TextField
                                fullWidth
                                {...register('nameSearch')}
                                size='small'
                                id="outlined-name"
                                placeholder={`Name`}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className='sear-ic'>
                                <path d="M2.625 7L9.3906 11.5104C10.0624 11.9583 10.9376 11.9583 11.6094 11.5104L18.375 7M4.625 16.625H16.375C17.4796 16.625 18.375 15.7296 18.375 14.625V6.375C18.375 5.27043 17.4796 4.375 16.375 4.375H4.625C3.52043 4.375 2.625 5.27043 2.625 6.375V14.625C2.625 15.7296 3.52043 16.625 4.625 16.625Z" stroke="#0B0D23" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <TextField
                                fullWidth
                                {...register('emailSearch')}
                                size='small'
                                id="outlined-name"
                                placeholder={`Email`}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className='sear-ic'>
                                <path d="M12 9.7998V19.9998M12 9.7998C12 8.11965 12 7.27992 12.327 6.63818C12.6146 6.0737 13.0732 5.6146 13.6377 5.32698C14.2794 5 15.1196 5 16.7998 5H19.3998C19.9599 5 20.2401 5 20.454 5.10899C20.6422 5.20487 20.7948 5.35774 20.8906 5.5459C20.9996 5.75981 21 6.04004 21 6.6001V15.4001C21 15.9601 20.9996 16.2398 20.8906 16.4537C20.7948 16.6419 20.6425 16.7952 20.4543 16.8911C20.2406 17 19.961 17 19.402 17H16.5693C15.6301 17 15.1597 17 14.7334 17.1295C14.356 17.2441 14.0057 17.4317 13.701 17.6821C13.3568 17.965 13.096 18.3557 12.575 19.1372L12 19.9998M12 9.7998C12 8.11965 11.9998 7.27992 11.6729 6.63818C11.3852 6.0737 10.9263 5.6146 10.3618 5.32698C9.72004 5 8.87977 5 7.19961 5H4.59961C4.03956 5 3.75981 5 3.5459 5.10899C3.35774 5.20487 3.20487 5.35774 3.10899 5.5459C3 5.75981 3 6.04004 3 6.6001V15.4001C3 15.9601 3 16.2398 3.10899 16.4537C3.20487 16.6419 3.35774 16.7952 3.5459 16.8911C3.7596 17 4.03901 17 4.59797 17H7.43073C8.36994 17 8.83942 17 9.26569 17.1295C9.64306 17.2441 9.99512 17.4317 10.2998 17.6821C10.6426 17.9638 10.9017 18.3526 11.4185 19.1277L12 19.9998" stroke="#0B0D23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <TextField
                                fullWidth
                                type='number'
                                {...register('numberSearch')}
                                size='small'
                                id="outlined-name"
                                placeholder={`Mobile`}
                            />
                        </div>
                    </div>

                    {/* <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className='sear-ic'>
                                <path d="M2 20H4M4 20H15M4 20V14.3682C4 13.8428 4 13.58 4.063 13.335C4.11883 13.1178 4.21073 12.9118 4.33496 12.7252C4.47505 12.5147 4.67114 12.3384 5.06152 11.9877L7.3631 9.91997C8.11784 9.24192 8.49549 8.90264 8.92249 8.77393C9.29894 8.66045 9.7007 8.66045 10.0771 8.77393C10.5045 8.90275 10.8827 9.2422 11.6387 9.92139L13.9387 11.9877C14.3295 12.3388 14.5245 12.5146 14.6647 12.7252C14.7889 12.9118 14.8807 13.1178 14.9365 13.335C14.9995 13.58 15 13.8428 15 14.3682V20M15 20H20M20 20H22M20 20V7.19691C20 6.07899 20 5.5192 19.7822 5.0918C19.5905 4.71547 19.2837 4.40973 18.9074 4.21799C18.4796 4 17.9203 4 16.8002 4H10.2002C9.08009 4 8.51962 4 8.0918 4.21799C7.71547 4.40973 7.40973 4.71547 7.21799 5.0918C7 5.51962 7 6.08009 7 7.2002V10.0002" stroke="#0B0D23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>


                            <TextField
                                fullWidth
                                type='number'
                                {...register('lead_id_search')}
                                size='small'
                                id="outlined-name"
                                placeholder={`Lead Id`}
                            />
                        </div>
                    </div> */}

                    {/* <div>
                        <div >


                        </div>
                    </div> */}


                    <div>
                        <div className='form-btn-cntr d-flex align-items-center justify-content-between '>
                            <Button className='fill-btn' onClick={onSearch} > <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M20 5.6001C20 5.04005 19.9996 4.75981 19.8906 4.5459C19.7948 4.35774 19.6423 4.20487 19.4542 4.10899C19.2403 4 18.9597 4 18.3996 4H5.59961C5.03956 4 4.75981 4 4.5459 4.10899C4.35774 4.20487 4.20487 4.35774 4.10899 4.5459C4 4.75981 4 5.04005 4 5.6001V6.33736C4 6.58195 4 6.70433 4.02763 6.81942C4.05213 6.92146 4.09263 7.01893 4.14746 7.1084C4.20928 7.20928 4.29591 7.29591 4.46875 7.46875L9.53149 12.5315C9.70443 12.7044 9.79044 12.7904 9.85228 12.8914C9.90711 12.9808 9.94816 13.0786 9.97266 13.1807C10 13.2946 10 13.4155 10 13.6552V18.411C10 19.2682 10 19.6971 10.1805 19.9552C10.3382 20.1806 10.5814 20.331 10.8535 20.3712C11.1651 20.4172 11.5487 20.2257 12.3154 19.8424L13.1154 19.4424C13.4365 19.2819 13.5966 19.2013 13.7139 19.0815C13.8176 18.9756 13.897 18.8485 13.9453 18.7084C14 18.5499 14 18.37 14 18.011V13.6626C14 13.418 14 13.2958 14.0276 13.1807C14.0521 13.0786 14.0926 12.9808 14.1475 12.8914C14.2089 12.7911 14.2947 12.7053 14.4653 12.5347L14.4688 12.5315L19.5315 7.46875C19.7044 7.2958 19.7904 7.20932 19.8523 7.1084C19.9071 7.01893 19.9482 6.92146 19.9727 6.81942C20 6.70551 20 6.58444 20 6.3448V5.6001Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg> Filter</Button>
                            <Button className='fill-btn-clear' onClick={handleClearSearch} ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M14 14L8.00002 8.00002M8.00002 8.00002L2 2M8.00002 8.00002L14 2M8.00002 8.00002L2 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg> Clear</Button>
                        </div>
                    </div>


                </div>

            </div>


            {

                loading ?
                    <LoadingTable columns={7} columnWidth={80} columnHeight={20} rows={10} rowWidth={130} rowHeight={20} />
                    :
                    <>
                        <Box sx={{ width: '100%' }}>
                            <Paper sx={{ width: '100%', mb: 2 }}>
                                {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                                <TableContainer>
                                    <Table
                                        sx={{ minWidth: 750 }}
                                        aria-labelledby="tableTitle"
                                        size={dense ? 'small' : 'medium'}
                                    >
                                        <EnhancedTableHead
                                            numSelected={selected.length}
                                            order={order}
                                            orderBy={orderBy}
                                            onSelectAllClick={handleSelectAllClick}
                                            onRequestSort={handleRequestSort}
                                            rowCount={list?.meta?.total || 0}
                                        />

                                        <TableBody>
                                            {
                                                list?.data?.length > 0 ?
                                                    list?.data?.map((row, index) => {
                                                        const isItemSelected = isSelected(row.id);
                                                        const labelId = `enhanced-table-checkbox-${index}`;

                                                        let defaultCC = row?.default_cc || '';
                                                        let emails = defaultCC.split(',').map(email => email.trim());
                                                        // let mainEmail = emails.shift();

                                                        return (
                                                            <TableRow className='table-custom-tr'
                                                                hover
                                                                // onClick={(event) => {
                                                                //     // handle the click event here
                                                                //     window.open(`lead/${row?.lead_id}?app_id=${row?.id}`, '_blank');
                                                                // }}
                                                                // onClick={(event) => handleClick(event, row.id)}
                                                                role="checkbox"
                                                                aria-checked={isItemSelected}
                                                                tabIndex={-1}
                                                                key={row.id}
                                                                selected={isItemSelected}
                                                                sx={{ cursor: 'pointer' }}
                                                            >
                                                                <TableCell className='checkbox-tb' padding="checkbox">
                                                                    <Checkbox
                                                                        onClick={(event) => handleClick(event, row.id)}
                                                                        color="primary"
                                                                        checked={isItemSelected}
                                                                        inputProps={{
                                                                            'aria-labelledby': labelId,
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell
                                                                    // onClick={() => handleDetailOpen(row?.id)}
                                                                    component="th"
                                                                    id={labelId}
                                                                    scope="row"
                                                                    padding="none"
                                                                    className='reg-name'
                                                                >
                                                                    {/* <a target='_blank' href={`lead/${row?.lead_id}?app_id=${row?.id}`}> {row?.student?.name}</a> */}
                                                                    {row?.lead?.name}
                                                                </TableCell>
                                                                {/* <TableCell align="left">{row?.student?.email}</TableCell>
                                                                <TableCell align="left">{row?.student?.phone_number}</TableCell> */}
                                                                <TableCell align="left"> {row?.country?.name}</TableCell>
                                                                <TableCell align="left">
                                                                    <div className='d-flex justify-between items-center'>
                                                                        {row?.university?.name}
                                                                        <HtmlTooltip
                                                                            title={
                                                                                <React.Fragment>
                                                                                    <Typography color="inherit">{row?.university?.name}</Typography>
                                                                                    <em>{"University Details"}</em> <u>{'Detail Content'}</u>.{' '}
                                                                                    {"Display University Details"}
                                                                                </React.Fragment>
                                                                            }
                                                                        >
                                                                            <InfoOutlined fontSize='small' sx={{ color: '#689df6' }} />
                                                                        </HtmlTooltip>

                                                                    </div>
                                                                </TableCell>
                                                                <TableCell align="left"> {row?.course_level?.name}</TableCell>
                                                                <TableCell align="left"> {row?.course}</TableCell>
                                                                <TableCell align="left"> {row?.subject_area?.name}</TableCell>
                                                                <TableCell><Tooltip title={row?.differ_intake_note}>{row?.intake?.name}</Tooltip></TableCell>
                                                                <TableCell align="left"><Tooltip title={row?.stage_note}>{row?.stage?.name}</Tooltip></TableCell>
                                                                <TableCell align="left"> {
                                                                    row?.deposit_amount_paid ?
                                                                        <a className='a_hover' style={{ cursor: 'pointer', }} onClick={() => handleDepositEdit(row)}> {row?.deposit_amount_paid} </a>
                                                                        :
                                                                        <Button variant='outlined' size='small' onClick={() => handleDepositOpen(row)}>  Add</Button>
                                                                }</TableCell>

                                                                <TableCell align="left"> <Tooltip title={'Return Application to Counsellor'}><Button onClick={() => handleReturnPopupOpen(row?.id)} variant='outlined' size='small'> <Autorenew />  </Button></Tooltip></TableCell>

                                                                <TableCell align="left">
                                                                    <Grid display={'flex'} alignItems={'center'}>
                                                                        <Tooltip title={'Change Stage'}>
                                                                            <svg style={{ cursor: 'pointer' }} onClick={() => handleStageOpen(row)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                                <path d="M5 6.00008V13.9044C5 15.0386 5 15.6056 5.1701 15.9526C5.48537 16.5959 6.17631 16.9656 6.88639 16.8711C7.2695 16.8201 7.74136 16.5055 8.68508 15.8764L8.68735 15.8749C9.0614 15.6255 9.24846 15.5008 9.44413 15.4316C9.80351 15.3046 10.1956 15.3046 10.555 15.4316C10.7511 15.5009 10.9389 15.6261 11.3144 15.8765C12.2582 16.5057 12.7305 16.82 13.1137 16.871C13.8237 16.9654 14.5146 16.5959 14.8299 15.9526C15 15.6056 15 15.0384 15 13.9044V5.99734C15 5.06575 15 4.59925 14.8185 4.24308C14.6587 3.92948 14.4031 3.6747 14.0895 3.51491C13.733 3.33325 13.2669 3.33325 12.3335 3.33325H7.66683C6.73341 3.33325 6.26635 3.33325 5.90983 3.51491C5.59623 3.6747 5.34144 3.92948 5.18166 4.24308C5 4.5996 5 5.06666 5 6.00008Z" stroke="#0B0D23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                            </svg>
                                                                        </Tooltip>
                                                                        <Tooltip title={'Defer Intake'}>
                                                                            <svg style={{ cursor: 'pointer', marginLeft: 8 }} onClick={() => handleDeferOpen(row)} xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                                                                                <path d="M1 5.66667H13M1 5.66667V12.5113C1 13.3825 1 13.8178 1.16349 14.1506C1.3073 14.4433 1.5366 14.6815 1.81885 14.8306C2.1394 15 2.55925 15 3.39768 15H10.6023C11.4408 15 11.86 15 12.1805 14.8306C12.4628 14.6815 12.6929 14.4433 12.8367 14.1506C13 13.8182 13 13.3834 13 12.5139V5.66667M1 5.66667V5.0446C1 4.1734 1 3.73748 1.16349 3.40473C1.3073 3.11203 1.5366 2.87424 1.81885 2.7251C2.13972 2.55556 2.56007 2.55556 3.40015 2.55556H4M13 5.66667V5.04204C13 4.17255 13 3.73716 12.8367 3.40473C12.6929 3.11203 12.4628 2.87424 12.1805 2.7251C11.8597 2.55556 11.4402 2.55556 10.6001 2.55556H10M10 1V2.55556M10 2.55556H4M4 1V2.55556" stroke="#232648" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                            </svg>
                                                                        </Tooltip>
                                                                        <Tooltip title={'Mail to University'}>
                                                                            <svg style={{ cursor: 'pointer', marginLeft: 8 }} onClick={() => handleMailOpen(row)} xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                                                                                <path d="M1 3.57143L7.91849 8.01903C8.5773 8.44255 9.4227 8.44255 10.0815 8.01903L17 3.57143M3 13H15C16.1046 13 17 12.1046 17 11V3C17 1.89543 16.1046 1 15 1H3C1.89543 1 1 1.89543 1 3V11C1 12.1046 1.89543 13 3 13Z" stroke="#0B0D23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                            </svg>
                                                                        </Tooltip>
                                                                        <Tooltip title={'Documents'}>
                                                                            <svg style={{ cursor: 'pointer', marginLeft: 8 }} onClick={() => handleDocOpen(row)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                                <path d="M12 9.7998V19.9998M12 9.7998C12 8.11965 12 7.27992 12.327 6.63818C12.6146 6.0737 13.0732 5.6146 13.6377 5.32698C14.2794 5 15.1196 5 16.7998 5H19.3998C19.9599 5 20.2401 5 20.454 5.10899C20.6422 5.20487 20.7948 5.35774 20.8906 5.5459C20.9996 5.75981 21 6.04004 21 6.6001V15.4001C21 15.9601 20.9996 16.2398 20.8906 16.4537C20.7948 16.6419 20.6425 16.7952 20.4543 16.8911C20.2406 17 19.961 17 19.402 17H16.5693C15.6301 17 15.1597 17 14.7334 17.1295C14.356 17.2441 14.0057 17.4317 13.701 17.6821C13.3568 17.965 13.096 18.3557 12.575 19.1372L12 19.9998M12 9.7998C12 8.11965 11.9998 7.27992 11.6729 6.63818C11.3852 6.0737 10.9263 5.6146 10.3618 5.32698C9.72004 5 8.87977 5 7.19961 5H4.59961C4.03956 5 3.75981 5 3.5459 5.10899C3.35774 5.20487 3.20487 5.35774 3.10899 5.5459C3 5.75981 3 6.04004 3 6.6001V15.4001C3 15.9601 3 16.2398 3.10899 16.4537C3.20487 16.6419 3.35774 16.7952 3.5459 16.8911C3.7596 17 4.03901 17 4.59797 17H7.43073C8.36994 17 8.83942 17 9.26569 17.1295C9.64306 17.2441 9.99512 17.4317 10.2998 17.6821C10.6426 17.9638 10.9017 18.3526 11.4185 19.1277L12 19.9998" stroke="#0B0D23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                            </svg>
                                                                        </Tooltip>
                                                                    </Grid>
                                                                </TableCell>
                                                                {/* <TableCell align="left"><Button style={{ textTransform: 'none' }} onClick={() => handleEdit(row?.id)}><Edit fontSize='small' /></Button></TableCell> */}
                                                                {/* <Popup trigger={<TableCell align="left"><IconButton style={{ textTransform: 'none' }} ><MoreHorizOutlined fontSize='small' /></IconButton></TableCell>}
                                                                    position="left center">
                                                                    <div className='app-table-container'>
                                                                        <ul className='app-table-options'>
                                                                            <li onClick={() => handleDownloadOpen(row?.id)}> Download Document</li>
                                                                            <li onClick={() => handleStageOpen(row)}> Change Application Stage</li>
                                                                        </ul>
    
                                                                    </div>
                                                                </Popup> */}
                                                            </TableRow>
                                                        );
                                                    })
                                                    : (
                                                        <TableRow
                                                            style={{
                                                                height: (dense ? 33 : 53) * emptyRows,
                                                                width: '100%',
                                                            }}
                                                        >
                                                            <TableCell colSpan={8} align="center">
                                                                <div className='no-table-ask-block'>
                                                                    <h4 style={{ color: 'grey' }}>No Application Found</h4>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </Paper>
                        </Box>
                        <div className='table-pagination d-flex justify-content-end align-items-center'>

                            {
                                list?.data?.length > 0 &&
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
                            }
                        </div>
                    </>
            }
        </>
    );
}