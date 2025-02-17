import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid, List, ListItem, ListItemText, MenuItem, Pagination, Popover, Select, Stack, TextField, styled } from '@mui/material';
import LoadingTable from '../Common/Loading/LoadingTable';
import { ApplicationApi } from '@/data/Endpoints/Application';
import 'reactjs-popup/dist/index.css';
import { ListingApi } from '@/data/Endpoints/Listing';
import AsyncSelect from "react-select/async";
import ApplicationStageChangeModal from '../LeadDetails/Tabs/application/modals/stageChange';
import DeferIntake from '../LeadDetails/Tabs/application/modals/deferIntake';
import ViewDocumentModal from '../LeadDetails/Tabs/application/modals/viewDocModal';
import SendUniversityMail from '../LeadDetails/Tabs/application/modals/mailToUniversity';
import UniversityDeposit from '../LeadDetails/Tabs/application/modals/universityDepost';
import { Add, AssignmentReturn, Autorenew, DeleteOutline, EditOutlined, InfoOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import ConfirmPopup from '../Common/Popup/confirm';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import ReactSelector from 'react-select';
import ReturnPopup from '../Applications/Modals/returnModal';
import DownloadDocumentModal from '../Applications/Modals/downloadDocument';
import ApplicationDetail from '../Applications/Modals/Details';
import { Divider } from 'rsuite';
import SubmitToUniversityModal from '../Applications/Modals/UniversitySubmit';
import SaveApplicationSumber from '../Applications/Modals/ApplicationId';
import UniversityInfoModal from '../Applications/Modals/UniversityInfo';
import PortalPermissionModal from '../Applications/Modals/PortalPermissions';
import EditPaymentModal from '../Applications/Modals/editPaymentModal';



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
        id: 'applications.id',
        numeric: false,
        disablePadding: true,
        label: 'Student Id',
        noSort: false
    },

    {
        id: 'leads.student_code',
        numeric: false,
        disablePadding: false,
        label: 'Student',
        noSort: false
    },

    {
        id: 'leads.date_of_birth',
        numeric: false,
        disablePadding: false,
        label: 'Student DOB',
        noSort: false
    },

    {
        id: 'countries.name',
        numeric: false,
        disablePadding: false,
        label: 'Country',
        noSort: false
    },
    {
        id: 'universities.name',
        numeric: false,
        disablePadding: false,
        label: 'University',
        noSort: false
    },
    {
        id: 'course_levels.name',
        numeric: false,
        disablePadding: false,
        label: 'Course Level',
        noSort: false
    },
    {
        id: 'course',
        numeric: false,
        disablePadding: false,
        label: 'Course',
        noSort: false
    },

    {
        id: ['intakes.year', 'intakes.month'],
        numeric: false,
        disablePadding: false,
        label: 'Intake',
        noSort: false
    },
    {
        id: 'stages.name',
        numeric: false,
        disablePadding: false,
        label: 'Stage',
        noSort: false
    },
    {
        id: 'submitted_to_university_on',
        numeric: false,
        disablePadding: false,
        label: 'Submited to University',
        noSort: false
    },
    {
        id: 'users.name',
        numeric: false,
        disablePadding: false,
        label: 'Counsellor',
        noSort: false
    },
    {
        id: 'applications.deposit_amount_paid',
        numeric: false,
        disablePadding: false,
        label: 'Uni.Deposit',
        noSort: false
    },

    {
        id: 'icons',
        numeric: false,
        disablePadding: false,
        label: '',
        noSort: true
    },
];

let field = ''
let sortOrder = true


function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property?.id);
        field = property?.id
    };


    return (
        <TableHead>
            <TableRow>

                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'left' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {
                            !headCell?.noSort &&
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? sortOrder ? 'asc' : 'desc' : 'asc'}
                                onClick={createSortHandler(headCell)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {sortOrder ? 'sorted ascending' : 'sorted descending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        }
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

export default function ApplicationSubmittedTable({ refresh, editId, setEditId, page, setPage, setRefresh, searchType, nameSearch, searchActive }) {

    const router = useRouter();

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()

    const session = useSession()
    // const pageNumber = parseInt(router?.asPath?.split("=")[1] - 1 || 0);


    // console.log(router);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    // const [page, setPage] = React.useState(pageNumber);
    const [dense, setDense] = React.useState(false);
    const [limit, setLimit] = React.useState(50);
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
        handlePopoverClose()
    }
    const handleDeferOpen = (data) => {
        setDetails(data)
        setdeferId(0)
        handlePopoverClose()
    }
    const handleDocOpen = (data) => {
        setDetails(data)
        setdocumentId(data?.id)
        handlePopoverClose()
    }
    const handleDepositOpen = (data) => {
        setDetails(data)
        setdepositId(0)
    }
    const handleDepositEdit = (data) => {
        setDetails(data)
        setdepositId(data?.id)
        handlePopoverClose()
    }


    const fetchCountry = (e) => {
        return ListingApi.universityCountries({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const fetchUniversity = (e) => {
        return ListingApi.universities({ keyword: e, country: selectedCountry }).then(response => {
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
                const allIntakes = response?.data?.data
                const defualtIntake = allIntakes?.find(obj => obj?.is_default == 1)
                setValue('intake', defualtIntake || '')
                setselectedIntake(defualtIntake?.id)
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

    const fetchCourseLevel = (e) => {
        return ListingApi.courseLevel({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }
    const fetchStage = (e) => {
        return ListingApi.stages({ keyword: e, type: 'application', }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }
    const fetchCoordinator = (e) => {
        return ListingApi.users({ keyword: e, role_id: 6, office_id: selectedBranch }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const fetchCounsellors = (e) => {
        return ListingApi.counsellors({ keyword: e, office_id: selectedBranch }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const fetchBranches = (e) => {
        return ListingApi.office({ keyword: e, }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }


    const handleRequestSort = (event, property) => {
        sortOrder = !sortOrder
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
        router.replace(`/applications-submitted?page=${newPage}`);
        // router.push(`/lead?page=${newPage + 1}`);
    };


    const handleEdit = (id) => {
        setEditId(id)
    }

    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value));
        setPage(1);
        router.replace(`/applications-submitted?page=1`);
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
        setMailId(data?.id)
        handlePopoverClose()
    }
    const handleStageOpen = (row) => {
        setDetails(row)
        setStageId(row?.id)
        handlePopoverClose()
    }

    const handleCountryChange = (data) => {
        setValue('country', data || '')
        setselectedCountry(data?.id)
        setValue('university', '')
        setselectedUniversity()
    }

    const handleUniversityChange = (data) => {
        setValue('university', data || '')
        setselectedUniversity(data?.id)
    }

    const [showAllIntake, setshowAllIntake] = useState(false)
    const handleIntakeChange = (data) => {
        if (data) {
            setshowAllIntake(false)
            setValue('intake', data || '')
            setselectedIntake(data?.id)
        } else {
            setshowAllIntake(true)
            setValue('intake', '')
            setselectedIntake()
        }
    }

    const handleStreamChange = (data) => {
        setValue('subjectarea', data || '')
        setselectedStream(data?.id)
    }

    const [selectedcourselevel, setselectedcourselevel] = useState()
    const handleCourseChange = (data) => {
        setValue('course_level_id', data || '')
        setselectedcourselevel(data?.id)

    }

    const [selectedstage, setselectedstage] = useState()
    const handleStageChange = (data) => {
        setValue('stage', data || '')
        setselectedstage(data?.id)

    }

    const [selectedcoordinator, setselectedcoordinator] = useState()
    const handleAppCoordinatorChange = (data) => {
        setValue('app_coordinator', data || '')
        setselectedcoordinator(data?.id)
    }

    const [selectedCreatedBy, setselectedCreatedBy] = useState()
    const handleCreatedByChangeChange = (data) => {
        setValue('created_by', data || '')
        setselectedCreatedBy(data?.id)
    }

    const [selectedStatus, setselectedStatus] = useState()
    const handleStatusChange = (data) => {
        setValue('status', data || '')
        setselectedStatus(data?.name)
    }

    const [selectedDeposit, setselectedDeposit] = useState()
    const handleDepositChange = (data) => {
        setValue('deposit', data || '')
        setselectedDeposit(data?.name)
    }

    const [selectedBranch, setselectedBranch] = useState()
    const handleSelectBranch = (e) => {
        setselectedBranch(e?.id || '');
        setValue('branch', e || '')
        setselectedCreatedBy();
        setValue('created_by', '')
        setValue('app_coordinator', '')
        setselectedcoordinator()
    }

    const [searchRefresh, setsearchRefresh] = useState(false)

    const onSearch = () => {
        if (page == 1) {
            setsearchRefresh(!searchRefresh)
        } else {
            setPage(1)
            router.replace(`/applications-submitted?page=${1}`);
        }
    }

    const fetchSource = (e) => {
        return ListingApi.leadSource({ keyword: e, }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const [selectedSource, setselectedSource] = useState()
    const handleSelectSource = (e) => {
        setselectedSource(e?.id || '');
        setValue('source', e || '')

        setValue('agency', '')
        setValue('referred_student', '')
        setValue('referred_university', '')
        setValue('events', '')
        setValue('campaigns', '')
    }

    const handleClearSearch = (from) => {

        // reset()

        setValue('nameSearch', '')
        setValue('emailSearch', '')
        setValue('numberSearch', '')

        setValue('country', '')
        setValue('university', '')
        setValue('subjectarea', '')
        // setValue('intake', '')
        setValue('course_level_id', '')
        setValue('stage', '')
        setValue('app_coordinator', '')
        setValue('created_by', '')
        setValue('status', '')
        setValue('deposit', '')
        setValue('student_code', '')
        setValue('application_number', '')
        setValue('course', '')

        setValue('agency', '')
        setValue('referred_student', '')
        setValue('referred_university', '')
        setValue('events', '')
        setValue('campaigns', '')

        setselectedCountry()
        // setselectedIntake()
        setselectedUniversity()
        setselectedStream()
        setselectedcourselevel()
        setselectedstage()
        setselectedcoordinator()
        setselectedCreatedBy()
        setselectedStatus()
        setselectedDeposit()

        setValue('branch', '')
        setselectedBranch();

        setValue('source', '')
        setselectedSource()

        onSearch()
    }

    const fetchTable = () => {
        setLoading(true)

        let params = {
            sort_field: field,
            sort_order: sortOrder ? 'asc' : 'desc',

            name: watch('nameSearch'),
            email: watch('emailSearch'),
            phone_number: watch('numberSearch'),

            limit: limit,
            deposit_not_paid: 1,
            source_id: selectedSource,

            ...((selectedSource == 1 || selectedSource == 2) ? { lead_campaign_id: watch('campaigns')?.id } : {}),
            ...(selectedSource == 5 ? { referred_student_id: watch('referred_student')?.id } : {}),
            ...(selectedSource == 6 ? { agency: watch('agency')?.id } : {}),
            ...(selectedSource == 7 ? { referral_university_id: watch('referred_university')?.id } : {}),
            ...(selectedSource == 11 ? { event_id: watch('events')?.id } : {}),
            // application statuses:unsubmitted,
            // status: 'Admission Completed',
            submitted: 1,
            country_id: selectedCountry,
            university_id: selectedUniversity,
            intake_id: selectedIntake,
            // intake_id: 'All'
            subject_area_id: selectedStream,
            course_level_id: selectedcourselevel,
            app_coordinator_id: selectedcoordinator,
            stage_id: selectedstage,
            assigned_to_counsellor_id: selectedCreatedBy,
            assign_to_office_id: selectedBranch,
            course: watch('course'),
            application_number: watch('application_number'),
            student_code: watch('student_code'),
            page: page
        }

        if (showAllIntake) {
            params['intake_id'] = 'All'
        } else {
            params['intake_id'] = selectedIntake
        }


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

    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverRowId, setPopoverRowId] = useState(null);

    const handlePopoverClick = (event, rowId) => {
        setAnchorEl(event.currentTarget);
        setPopoverRowId(rowId);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setPopoverRowId(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [submitId, setsubmitId] = useState()
    const [submitLoading, setsubmitLoading] = useState(false)
    const handleSubmitOpen = (id) => {
        setsubmitId(id)
        handlePopoverClose()
    }
    const handleClickSubmit = () => {
        setsubmitLoading(true)
        ApplicationApi.submitToCordinator({ id: submitId }).then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response?.data?.message)
                setsubmitLoading(false)
                setsubmitId()
                fetchTable()
            } else {
                toast.error(response?.response?.data?.message)
                setsubmitLoading(false)
            }
        }).catch((error) => {
            toast.error(error?.response?.data?.message)
            setdeleteLoading(false)
        })
    }

    const [uniSubmitId, setuniSubmitId] = useState()
    const handleUniSubmitId = (row) => {
        setDetails(row)
        setuniSubmitId(row?.id)
    }

    const [unId, setUniId] = useState()
    const handleUniId = (row, edit) => {
        setDetails(row)
        if (edit) {
            setUniId(row?.id)
        } else {
            setUniId(0)
        }
    }

    const [uniInfoId, setuniInfoId] = useState()
    const handlUniInfoOpen = (obj) => {
        setDetails(obj)
        setuniInfoId(obj?.id)
    }

    const [PortalId, setPortalId] = useState()
    const handlePortalOpen = (obj) => {
        setDetails(obj)
        setPortalId(obj?.id)
        handlePopoverClose()
    }

    const [editPaymentId, seteditPaymentId] = useState()
    const handleEditPaymentOpen = (obj) => {
        // setDetails(obj)
        seteditPaymentId(obj?.id)
    }

    const [deleteAmount, setdeleteAmount] = useState()
    const handleDeletePaymentOpen = (obj) => {
        setdeleteAmount(obj?.id)
    }
    const handleDeleteAmount = () => {
        setsubmitLoading(true)
        ApplicationApi.deletePayment({ id: deleteAmount }).then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response?.data?.message)
                setsubmitLoading(false)
                setdeleteAmount()
                fetchTable()
            } else {
                toast.error(response?.response?.data?.message)
                setsubmitLoading(false)
            }
        }).catch((error) => {
            toast.error(error?.response?.data?.message)
            setdeleteLoading(false)
        })
    }

    useEffect(() => {
        fetchTable()
    }, [page, refresh, limit, searchRefresh, sortOrder])

    const fetchStudents = (e) => {
        return ListingApi.students({ keyword: e }).then(response => {

            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data?.data
            } else {
                return [];
            }

        })
    }

    const fetchAgencies = (e) => {
        return ListingApi.agencies({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }

    const fetchUniversities = (e) => {
        return ListingApi.universities({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }

    const fetchAgency = (e) => {
        return ListingApi.agencies({ keyword: e, }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }


    const fetchEvents = (e) => {
        return ListingApi.events({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }

    const fetchCampaigns = (e) => {
        return ListingApi.campaigns({ keyword: e, source_id: selectedSource }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }


    return (

        <>
            {/* <EmailTemplateDetailModal id={detailId} setId={setDetailId} /> */}
            <DownloadDocumentModal editId={downloadId} setEditId={setDownloadId} />
            <ApplicationStageChangeModal editId={stageId} setEditId={setStageId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />
            <DeferIntake editId={deferId} setEditId={setdeferId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />
            <ViewDocumentModal appSubmit={true} editId={documentId} setEditId={setdocumentId} details={details} setDetails={setDetails} handleUniDocOpen={handleUniDocOpen} fetchTable={fetchTable} />
            <SendUniversityMail from={'lead'} details={details} lead_id={details?.lead_id} editId={mailId} setEditId={setMailId} />
            <UniversityDeposit editId={depositId} setEditId={setdepositId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />

            <ReturnPopup getDetails={handleFirstPage} loading={confirmLoading} ID={returnId} setID={setreturnId} setLoading={setconfirmLoading} title={`Do you want to return this Application to the Counsellor?`} />

            <ApplicationDetail id={detailId} setId={setDetailId} />
            <ConfirmPopup loading={submitLoading} ID={submitId} setID={setsubmitId} clickFunc={handleClickSubmit} title={`Do you want to Submit this Application to the App Cordinator?`} />

            {/* <SubmitToUniversityModal editId={uniSubmitId} setEditId={setuniSubmitId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} /> */}
            <SaveApplicationSumber editId={unId} setEditId={setUniId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />
            <UniversityInfoModal editId={uniInfoId} setEditId={setuniInfoId} details={details} setDetails={setDetails} />
            <PortalPermissionModal editId={PortalId} setEditId={setPortalId} details={details} setDetails={setDetails} />

            <EditPaymentModal editId={editPaymentId} setEditId={seteditPaymentId} refresh={fetchTable} />
            <ConfirmPopup loading={submitLoading} ID={deleteAmount} setID={setdeleteAmount} clickFunc={handleDeleteAmount} title={`Do you want to Delete Deposit Amount?`} />


            <div className="filter_sec">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none" className='sear-ic'>
                                <path d="M13 17C14.1046 17 15.0454 16.0899 14.7951 15.0141C14.1723 12.338 12.0897 11 8 11C3.91032 11 1.8277 12.338 1.20492 15.0141C0.954552 16.0899 1.89543 17 3 17H13Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M8 8C10 8 11 7 11 4.5C11 2 10 1 8 1C6 1 5 2 5 4.5C5 7 6 8 8 8Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                                <path d="M19 9.00012L10 13.0001L1 9.00012M19 5.00012L10 9.00012L1 5.00012L10 1.00012L19 5.00012Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <AsyncSelect
                                isClearable
                                defaultOptions
                                name='university'
                                // isMulti
                                key={selectedCountry}
                                value={watch('university')}
                                defaultValue={watch('university')}
                                isDisabled={!selectedCountry}
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
                                <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                                <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                                placeholder={<div>Subject Area</div>}
                                onChange={handleStreamChange}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" className='sear-ic'>
                                <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <AsyncSelect
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                isClearable
                                defaultOptions
                                name='course_level_id'
                                value={watch('course_level_id')}
                                defaultValue={watch('course_level_id')}
                                loadOptions={fetchCourseLevel}
                                getOptionLabel={(e) => e.name}
                                getOptionValue={(e) => e.id}
                                placeholder={<div>Course Level</div>}
                                onChange={handleCourseChange}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" className='sear-ic'>
                                <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <AsyncSelect
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                isClearable
                                defaultOptions
                                name='stage'
                                value={watch('stage')}
                                defaultValue={watch('stage')}
                                loadOptions={fetchStage}
                                getOptionLabel={(e) => e.name}
                                getOptionValue={(e) => e.id}
                                placeholder={<div>Stage</div>}
                                onChange={handleStageChange}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='form-group'>

                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" fill="none" className='sear-ic'>
                                <path d="M19 9.00012L10 13.0001L1 9.00012M19 5.00012L10 9.00012L1 5.00012L10 1.00012L19 5.00012Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <AsyncSelect
                                isClearable
                                defaultOptions
                                name='branch'
                                value={watch('branch')}
                                defaultValue={watch('branch')}
                                loadOptions={fetchBranches}
                                getOptionLabel={(e) => e.name}
                                getOptionValue={(e) => e.id}
                                placeholder={<div>Select Branch</div>}
                                onChange={handleSelectBranch}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" className='sear-ic'>
                                <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <AsyncSelect
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                isClearable
                                isDisabled={!selectedBranch}
                                key={selectedBranch}
                                defaultOptions
                                name='app_coordinator'
                                value={watch('app_coordinator')}
                                defaultValue={watch('app_coordinator')}
                                loadOptions={fetchCoordinator}
                                getOptionLabel={(e) => e.name}
                                getOptionValue={(e) => e.id}
                                placeholder={<div>App Coordinator</div>}
                                onChange={handleAppCoordinatorChange}
                            />
                        </div>
                    </div>


                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" className='sear-ic'>
                                <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <AsyncSelect
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                isClearable
                                defaultOptions
                                isDisabled={!selectedBranch}
                                key={selectedBranch}
                                name='created_by'
                                value={watch('created_by')}
                                defaultValue={watch('created_by')}
                                loadOptions={fetchCounsellors}
                                getOptionLabel={(e) => e.name}
                                getOptionValue={(e) => e.id}
                                placeholder={<div>Counsellors</div>}
                                onChange={handleCreatedByChangeChange}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='form-group'>

                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" fill="none" className='sear-ic'>
                                <path d="M19 9.00012L10 13.0001L1 9.00012M19 5.00012L10 9.00012L1 5.00012L10 1.00012L19 5.00012Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <AsyncSelect
                                isClearable
                                defaultOptions
                                name='source'
                                value={watch('source')}
                                defaultValue={watch('source')}
                                loadOptions={fetchSource}
                                getOptionLabel={(e) => e.name}
                                getOptionValue={(e) => e.id}
                                placeholder={<div>Select Source</div>}
                                onChange={handleSelectSource}
                            />
                        </div>
                    </div>

                    {
                        (watch('source')?.id == 1 || watch('source')?.id == 2) &&
                        <div>
                            <div className='form-group'>

                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" fill="none" className='sear-ic'>
                                    <path d="M19 9.00012L10 13.0001L1 9.00012M19 5.00012L10 9.00012L1 5.00012L10 1.00012L19 5.00012Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <AsyncSelect
                                    isClearable
                                    defaultOptions
                                    name='campaigns'
                                    value={watch('campaigns')}
                                    defaultValue={watch('campaigns')}
                                    loadOptions={fetchCampaigns}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    placeholder={<div>Select Campaign</div>}
                                    onChange={(options) => setValue('campaigns', options)}
                                />
                            </div>
                        </div>
                    }

                    {
                        watch('source')?.id == 5 &&
                        <div>
                            <div className='form-group'>

                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" fill="none" className='sear-ic'>
                                    <path d="M19 9.00012L10 13.0001L1 9.00012M19 5.00012L10 9.00012L1 5.00012L10 1.00012L19 5.00012Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <AsyncSelect
                                    isClearable
                                    defaultOptions
                                    name='referred_student'
                                    value={watch('referred_student')}
                                    defaultValue={watch('referred_student')}
                                    loadOptions={fetchStudents}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    placeholder={<div>Select Referred Student</div>}
                                    onChange={(options) => setValue('referred_student', options)}
                                />
                            </div>
                        </div>
                    }

                    {
                        watch('source')?.id == 6 &&
                        <div>
                            <div className='form-group'>

                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" fill="none" className='sear-ic'>
                                    <path d="M19 9.00012L10 13.0001L1 9.00012M19 5.00012L10 9.00012L1 5.00012L10 1.00012L19 5.00012Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <AsyncSelect
                                    isClearable
                                    defaultOptions
                                    name='agency'
                                    value={watch('agency')}
                                    defaultValue={watch('agency')}
                                    loadOptions={fetchAgency}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    placeholder={<div>Select Agency</div>}
                                    // onChange={handleSelectAgency}
                                    onChange={(options) => setValue('agency', options)}
                                />
                            </div>
                        </div>
                    }

                    {
                        watch('source')?.id == 7 &&
                        <div>
                            <div className='form-group'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" fill="none" className='sear-ic'>
                                    <path d="M19 9.00012L10 13.0001L1 9.00012M19 5.00012L10 9.00012L1 5.00012L10 1.00012L19 5.00012Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <AsyncSelect
                                    isClearable
                                    defaultOptions
                                    name='referred_university'
                                    value={watch('referred_university')}
                                    defaultValue={watch('referred_university')}
                                    loadOptions={fetchUniversities}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    placeholder={<div>Select Referred University</div>}
                                    onChange={(options) => setValue('referred_university', options)}
                                />
                            </div>
                        </div>
                    }

                    {
                        watch('source')?.id == 11 &&
                        <div>
                            <div className='form-group'>

                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" fill="none" className='sear-ic'>
                                    <path d="M19 9.00012L10 13.0001L1 9.00012M19 5.00012L10 9.00012L1 5.00012L10 1.00012L19 5.00012Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <AsyncSelect
                                    isClearable
                                    defaultOptions
                                    name='events'
                                    value={watch('events')}
                                    defaultValue={watch('events')}
                                    loadOptions={fetchEvents}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    placeholder={<div>Select Event</div>}
                                    // onChange={handleSelectEvent}
                                    onChange={(options) => setValue('events', options)}

                                />
                            </div>
                        </div>
                    }

                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className='sear-ic'>
                                <path d="M2.625 7L9.3906 11.5104C10.0624 11.9583 10.9376 11.9583 11.6094 11.5104L18.375 7M4.625 16.625H16.375C17.4796 16.625 18.375 15.7296 18.375 14.625V6.375C18.375 5.27043 17.4796 4.375 16.375 4.375H4.625C3.52043 4.375 2.625 5.27043 2.625 6.375V14.625C2.625 15.7296 3.52043 16.625 4.625 16.625Z" stroke="#0B0D23" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <TextField
                                fullWidth
                                {...register('application_number')}
                                size='small'
                                id="outlined-name"
                                placeholder={`Application Id`}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" className='sear-ic'>
                                <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <TextField
                                fullWidth
                                {...register('student_code')}
                                size='small'
                                id="outlined-name"
                                placeholder={`Student Id`}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className='sear-ic'>
                                <path d="M12 9.7998V19.9998M12 9.7998C12 8.11965 12 7.27992 12.327 6.63818C12.6146 6.0737 13.0732 5.6146 13.6377 5.32698C14.2794 5 15.1196 5 16.7998 5H19.3998C19.9599 5 20.2401 5 20.454 5.10899C20.6422 5.20487 20.7948 5.35774 20.8906 5.5459C20.9996 5.75981 21 6.04004 21 6.6001V15.4001C21 15.9601 20.9996 16.2398 20.8906 16.4537C20.7948 16.6419 20.6425 16.7952 20.4543 16.8911C20.2406 17 19.961 17 19.402 17H16.5693C15.6301 17 15.1597 17 14.7334 17.1295C14.356 17.2441 14.0057 17.4317 13.701 17.6821C13.3568 17.965 13.096 18.3557 12.575 19.1372L12 19.9998M12 9.7998C12 8.11965 11.9998 7.27992 11.6729 6.63818C11.3852 6.0737 10.9263 5.6146 10.3618 5.32698C9.72004 5 8.87977 5 7.19961 5H4.59961C4.03956 5 3.75981 5 3.5459 5.10899C3.35774 5.20487 3.20487 5.35774 3.10899 5.5459C3 5.75981 3 6.04004 3 6.6001V15.4001C3 15.9601 3 16.2398 3.10899 16.4537C3.20487 16.6419 3.35774 16.7952 3.5459 16.8911C3.7596 17 4.03901 17 4.59797 17H7.43073C8.36994 17 8.83942 17 9.26569 17.1295C9.64306 17.2441 9.99512 17.4317 10.2998 17.6821C10.6426 17.9638 10.9017 18.3526 11.4185 19.1277L12 19.9998" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <TextField
                                fullWidth
                                type='text'
                                {...register('course')}
                                size='small'
                                id="outlined-name"
                                placeholder={`Course`}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='form-group'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" className='sear-ic'>
                                <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                                <path d="M2.625 7L9.3906 11.5104C10.0624 11.9583 10.9376 11.9583 11.6094 11.5104L18.375 7M4.625 16.625H16.375C17.4796 16.625 18.375 15.7296 18.375 14.625V6.375C18.375 5.27043 17.4796 4.375 16.375 4.375H4.625C3.52043 4.375 2.625 5.27043 2.625 6.375V14.625C2.625 15.7296 3.52043 16.625 4.625 16.625Z" stroke="#0B0D23" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
                                <path d="M12 9.7998V19.9998M12 9.7998C12 8.11965 12 7.27992 12.327 6.63818C12.6146 6.0737 13.0732 5.6146 13.6377 5.32698C14.2794 5 15.1196 5 16.7998 5H19.3998C19.9599 5 20.2401 5 20.454 5.10899C20.6422 5.20487 20.7948 5.35774 20.8906 5.5459C20.9996 5.75981 21 6.04004 21 6.6001V15.4001C21 15.9601 20.9996 16.2398 20.8906 16.4537C20.7948 16.6419 20.6425 16.7952 20.4543 16.8911C20.2406 17 19.961 17 19.402 17H16.5693C15.6301 17 15.1597 17 14.7334 17.1295C14.356 17.2441 14.0057 17.4317 13.701 17.6821C13.3568 17.965 13.096 18.3557 12.575 19.1372L12 19.9998M12 9.7998C12 8.11965 11.9998 7.27992 11.6729 6.63818C11.3852 6.0737 10.9263 5.6146 10.3618 5.32698C9.72004 5 8.87977 5 7.19961 5H4.59961C4.03956 5 3.75981 5 3.5459 5.10899C3.35774 5.20487 3.20487 5.35774 3.10899 5.5459C3 5.75981 3 6.04004 3 6.6001V15.4001C3 15.9601 3 16.2398 3.10899 16.4537C3.20487 16.6419 3.35774 16.7952 3.5459 16.8911C3.7596 17 4.03901 17 4.59797 17H7.43073C8.36994 17 8.83942 17 9.26569 17.1295C9.64306 17.2441 9.99512 17.4317 10.2998 17.6821C10.6426 17.9638 10.9017 18.3526 11.4185 19.1277L12 19.9998" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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


                    <div>
                        <div className='form-btn-cntr d-flex align-items-center justify-content-between '>
                            <Button className='fill-btn' onClick={onSearch} > <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M20 5.6001C20 5.04005 19.9996 4.75981 19.8906 4.5459C19.7948 4.35774 19.6423 4.20487 19.4542 4.10899C19.2403 4 18.9597 4 18.3996 4H5.59961C5.03956 4 4.75981 4 4.5459 4.10899C4.35774 4.20487 4.20487 4.35774 4.10899 4.5459C4 4.75981 4 5.04005 4 5.6001V6.33736C4 6.58195 4 6.70433 4.02763 6.81942C4.05213 6.92146 4.09263 7.01893 4.14746 7.1084C4.20928 7.20928 4.29591 7.29591 4.46875 7.46875L9.53149 12.5315C9.70443 12.7044 9.79044 12.7904 9.85228 12.8914C9.90711 12.9808 9.94816 13.0786 9.97266 13.1807C10 13.2946 10 13.4155 10 13.6552V18.411C10 19.2682 10 19.6971 10.1805 19.9552C10.3382 20.1806 10.5814 20.331 10.8535 20.3712C11.1651 20.4172 11.5487 20.2257 12.3154 19.8424L13.1154 19.4424C13.4365 19.2819 13.5966 19.2013 13.7139 19.0815C13.8176 18.9756 13.897 18.8485 13.9453 18.7084C14 18.5499 14 18.37 14 18.011V13.6626C14 13.418 14 13.2958 14.0276 13.1807C14.0521 13.0786 14.0926 12.9808 14.1475 12.8914C14.2089 12.7911 14.2947 12.7053 14.4653 12.5347L14.4688 12.5315L19.5315 7.46875C19.7044 7.2958 19.7904 7.20932 19.8523 7.1084C19.9071 7.01893 19.9482 6.92146 19.9727 6.81942C20 6.70551 20 6.58444 20 6.3448V5.6001Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg> Filter</Button>
                            <Button className='fill-btn-clear' onClick={handleClearSearch} ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M14 14L8.00002 8.00002M8.00002 8.00002L2 2M8.00002 8.00002L14 2M8.00002 8.00002L2 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                        <Grid zIndex={1} sx={{ width: '100%' }}>
                            <Grid sx={{ width: '100%', mb: 2 }}>
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

                                                                <TableCell
                                                                    component="th"
                                                                    id={labelId}
                                                                    scope="row"
                                                                    padding="none"
                                                                >
                                                                    {row?.lead?.student_code}
                                                                    <br />
                                                                    {
                                                                        row?.application_number && row?.application_number != 'undefined' ?
                                                                            <span style={{ fontSize: '13px', color: 'grey' }}>UNI ID:<span onClick={() => handleUniId(row, true)} style={{ color: 'black' }}> {row?.application_number && row?.application_number != 'undefined' ? row?.application_number : 'NA'}</span></span>
                                                                            :
                                                                            <Button onClick={() => handleUniId(row)} size='small' variant='outlined'>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                                                                    <path d="M6.33268 9.50008H9.49935M9.49935 9.50008H12.666M9.49935 9.50008V12.6667M9.49935 9.50008V6.33341M3.16602 13.3002V5.70024C3.16602 4.81349 3.16602 4.36978 3.33859 4.03109C3.49039 3.73316 3.73243 3.49112 4.03035 3.33932C4.36905 3.16675 4.81275 3.16675 5.6995 3.16675H13.2995C14.1863 3.16675 14.6294 3.16675 14.9681 3.33932C15.266 3.49112 15.5085 3.73316 15.6603 4.03109C15.8329 4.36978 15.8329 4.81316 15.8329 5.69991V13.2999C15.8329 14.1867 15.8329 14.6301 15.6603 14.9687C15.5085 15.2667 15.266 15.5092 14.9681 15.661C14.6297 15.8334 14.1872 15.8334 13.3022 15.8334H5.6969C4.81189 15.8334 4.36872 15.8334 4.03035 15.661C3.73243 15.5092 3.49039 15.2667 3.33859 14.9688C3.16602 14.6301 3.16602 14.187 3.16602 13.3002Z" stroke="#0B0D23" strokeLinecap="round" strokeLinejoin="round" />
                                                                                </svg> UNI ID</Button>
                                                                    }
                                                                </TableCell>
                                                                <TableCell align="left">
                                                                    <span onClick={() => window.open(`/lead/${row?.lead_id}`, '_blank')}
                                                                        className='a_hover text-sky-600'> {row?.lead?.name} </span>
                                                                </TableCell>
                                                                <TableCell align="left">
                                                                    {row?.lead?.date_of_birth?moment(row?.lead?.date_of_birth).format('DD-MM-YYYY'):'NA'}
                                                                </TableCell>
                                                                {/* <TableCell align="left">{row?.student?.email}</TableCell>
                                                                <TableCell align="left">{row?.student?.phone_number}</TableCell> */}
                                                                <TableCell align="left"> {row?.country?.name}</TableCell>
                                                                <TableCell align="left">
                                                                    <div className='d-flex justify-between items-center'>
                                                                        <span onClick={() => handlUniInfoOpen(row)} className='a_hover text-sky-600'> {row?.university?.name}</span>
                                                                        {/* <HtmlTooltip
                                                                            title={
                                                                                <React.Fragment>
                                                                                    <Typography color="inherit">University Info</Typography>
                                                                                    {row?.university?.extra_university_info}
                                                                                    <Divider sx={{ mt: 1 }} />
                                                                                    <Typography mt={1} color="inherit">Scholorship Info</Typography>
                                                                                    {row?.university?.extra_scholarship_info}
                                                                                </React.Fragment>
                                                                            }
                                                                        >
                                                                            <InfoOutlined fontSize='small' sx={{ color: '#689df6' }} />
                                                                        </HtmlTooltip> */}

                                                                    </div>
                                                                </TableCell>
                                                                <TableCell align="left"> {row?.course_level?.name}</TableCell>
                                                                <TableCell align="left"> {row?.course}</TableCell>
                                                                {/* <TableCell align="left"> {row?.subject_area?.name}</TableCell> */}
                                                                <TableCell><Tooltip title={row?.differ_intake_note}>{row?.intake?.name}</Tooltip></TableCell>
                                                                <TableCell className='stage-colm' align="left"><Tooltip title={row?.stage_note}><span style={{ backgroundColor: row?.stage?.colour }} className='stage-span'>{row?.stage?.name}</span></Tooltip></TableCell>
                                                                <TableCell align="left">
                                                                    {row?.submitted_to_university_on ? moment(row?.submitted_to_university_on).format('DD-MM-YYYY') : 'NA'}
                                                                </TableCell>
                                                                <TableCell align="left">{row?.lead?.assignedToCounsellor?.name}</TableCell>
                                                                <TableCell align="left">
                                                                    {
                                                                        row?.deposit_amount_paid ?
                                                                            <HtmlTooltip
                                                                                title={
                                                                                    <React.Fragment>
                                                                                        <div style={{ borderCollapse: 'collapse', width: '100%', padding: 3, display: 'flex', flexDirection: 'column' }}>
                                                                                            <span style={{ fontSize: '13px', color: 'grey', marginBottom: 3 }}>Payment Date :<sapn style={{ color: 'black' }} >{moment(row?.deposit_paid_on).format('DD-MM-YYYY') || 'NA'}</sapn></span>
                                                                                            <hr />
                                                                                            <span style={{ fontSize: '13px', color: 'grey', marginTop: 3 }}>Payment Mode :<span style={{ color: 'black' }}>{row?.deposit_mode_of_payment || 'NA'}</span></span>
                                                                                        </div>
                                                                                    </React.Fragment>
                                                                                }
                                                                            >
                                                                                {row?.deposit_amount_paid}
                                                                                <EditOutlined style={{ cursor: 'pointer' }} onClick={() => handleEditPaymentOpen(row)} className='ml-2' fontSize='small' />
                                                                                <DeleteOutline style={{ cursor: 'pointer' }} onClick={() => handleDeletePaymentOpen(row)} className='ml-2' fontSize='small' />

                                                                            </HtmlTooltip>
                                                                            : 'NA'
                                                                    }

                                                                </TableCell>


                                                                <TableCell align="left">
                                                                    <Grid display={'flex'} alignItems={'center'}>
                                                                        {
                                                                            row?.withdrawn != 1 &&
                                                                            <IconButton onClick={(event) => handlePopoverClick(event, row.id)}>
                                                                                <MoreHorizOutlined sx={{ color: 'blue' }} />
                                                                            </IconButton>
                                                                        }

                                                                        <Popover
                                                                            id={popoverRowId === row.id ? `popover-${row.id}` : undefined}
                                                                            open={popoverRowId === row.id && open}
                                                                            anchorEl={anchorEl}
                                                                            onClose={handlePopoverClose}
                                                                            anchorOrigin={{
                                                                                vertical: 'bottom',
                                                                                horizontal: 'center',
                                                                            }}
                                                                            transformOrigin={{
                                                                                vertical: 'top',
                                                                                horizontal: 'center',
                                                                            }}
                                                                        >
                                                                            <List>
                                                                                {/* {
                                                                                    (session?.data?.user?.role?.id == 6 && row?.app_coordinator_status == 'Submitted') &&
                                                                                    <ListItem button onClick={() => handleReturnPopupOpen(row?.id)}>
                                                                                        Return Application
                                                                                    </ListItem>
                                                                                } */}
                                                                                {/* {
                                                                                    (session?.data?.user?.role?.id == 5 && row?.app_coordinator_status == null) &&
                                                                                    <ListItem button onClick={() => handleSubmitOpen(row?.id)}>
                                                                                        Submit Application
                                                                                    </ListItem>
                                                                                } */}
                                                                                <ListItem button onClick={() => handleStageOpen(row)}>
                                                                                    Change Stage
                                                                                </ListItem>
                                                                                <ListItem button onClick={() => handleDeferOpen(row)}>
                                                                                    Defer Intake
                                                                                </ListItem>
                                                                                <ListItem button onClick={() => handleMailOpen(row)}>
                                                                                    Mail to University
                                                                                </ListItem>
                                                                                <ListItem button onClick={() => handleDocOpen(row)}>
                                                                                    Documents
                                                                                </ListItem>
                                                                                {
                                                                                    session?.data?.user?.role?.id != 5 &&
                                                                                    <ListItem button onClick={() => handlePortalOpen(row)}>
                                                                                        Portal Permissions
                                                                                    </ListItem>
                                                                                }
                                                                            </List>
                                                                        </Popover>

                                                                    </Grid>
                                                                </TableCell>

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
                                                            <TableCell colSpan={13} align="center">
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

                            </Grid>
                        </Grid>
                        <div className='table-pagination d-flex justify-content-end align-items-center'>

                            {
                                list?.data?.length > 0 &&
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className='select-row-box'>
                                        <Select value={limit} onChange={handleChangeRowsPerPage} inputprops={{ 'aria-label': 'Rows per page' }}>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            <MenuItem value={150}>150</MenuItem>
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