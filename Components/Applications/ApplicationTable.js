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
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useEffect } from 'react';
import { LeadApi } from '@/data/Endpoints/Lead';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Grid } from '@mui/material';
import LoadingTable from '../Common/Loading/LoadingTable';
import { TemplateApi } from '@/data/Endpoints/Template';
import { Edit, MoreHorizOutlined } from '@mui/icons-material';
import EmailTemplateDetailModal from '../EmailTemplateDetail/Modal';
import { ApplicationApi } from '@/data/Endpoints/Application';
import { StudentApi } from '@/data/Endpoints/Student';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import DownloadDocumentModal from './Modals/downloadDocument';
import ApplicationStageChangeModal from './Modals/stageChange';
import { ListingApi } from '@/data/Endpoints/Listing';
import AsyncSelect from "react-select/async";


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
        label: 'Student Name',
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
        id: 'subject_area',
        numeric: false,
        disablePadding: false,
        label: 'Subject Area',
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

export default function ApplicationTable({ refresh, editId, setEditId, page, setPage, setRefresh, searchType, nameSearch }) {

    const router = useRouter();

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

    const [detailId, setDetailId] = useState()

    const [downloadId, setDownloadId] = useState()
    const [stageId, setStageId] = useState()

    const [details, setDetails] = useState()

    const [selectedCountry, setselectedCountry] = useState()
    const [selectedUniversity, setselectedUniversity] = useState()
    const [selectedIntake, setselectedIntake] = useState()
    const [selectedStream, setselectedStream] = useState()


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
        router.replace(`/applications?page=${newPage + 1}`);
        // router.push(`/lead?page=${newPage + 1}`);
    };


    const handleEdit = (id) => {
        setEditId(id)
    }

    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };


    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * limit - list?.meta?.total?.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(list?.data, getComparator(order, orderBy))?.slice(
                page * limit,
                page * limit + limit,
            ),
        [order, orderBy, page, limit],
    );

    const handleDetailOpen = (id) => {
        setDetailId(id)
    }

    const handleDownloadOpen = (id) => {
        setDownloadId(id)
    }

    const handleStageOpen = (row) => {
        setStageId(row?.id)
        setDetails(row)
    }

    const handleCountryChange = (data) => {
        setselectedCountry(data?.id)
    }

    const handleUniversityChange = (data) => {
        setselectedUniversity(data?.id)
    }

    const handleIntakeChange = (data) => {
        setselectedIntake(data?.id)
    }

    const handleStreamChange = (data) => {
        setselectedStream(data?.id)
    }


    const fetchTable = () => {
        setLoading(true)

        let params = {
            limit: limit,
            // status: 'Admission Completed',
            country_id: selectedCountry,
            university_id: selectedUniversity,
            intake_id: selectedIntake,
            page: page + 1
        }

        if (searchType == 'Name') {
            params['name'] = nameSearch
        } else if (searchType == 'Email') {
            params['email'] = nameSearch
        } else if (searchType == 'Mobile') {
            params['phone_number'] = nameSearch
        } else if (searchType == 'Lead Id') {
            params['lead_id'] = nameSearch
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

    console.log(list);

    useEffect(() => {
        fetchTable()
    }, [page, refresh, limit, selectedCountry, selectedUniversity, selectedIntake, selectedStream, nameSearch])


    return (

        <>
            {/* <EmailTemplateDetailModal id={detailId} setId={setDetailId} /> */}
            <DownloadDocumentModal editId={downloadId} setEditId={setDownloadId} />
            <ApplicationStageChangeModal editId={stageId} setEditId={setStageId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />

            <Grid p={1} pl={0} mb={1} container display={'flex'} >
                <Grid mr={1} item md={2}>
                    <AsyncSelect
                        isClearable
                        defaultOptions
                        loadOptions={fetchCountry}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        placeholder={<div>Country</div>}
                        onChange={handleCountryChange}
                    />
                </Grid>

                <Grid mr={1} item md={2}>
                    <AsyncSelect
                        isClearable
                        defaultOptions
                        loadOptions={fetchUniversity}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        placeholder={<div>University</div>}
                        onChange={handleUniversityChange}
                    />
                </Grid>

                <Grid mr={1} item md={2}>
                    <AsyncSelect
                        isClearable
                        defaultOptions
                        loadOptions={fetchIntakes}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        placeholder={<div>Intake</div>}
                        onChange={handleIntakeChange}
                    />
                </Grid>

                <Grid mr={1} item md={2}>
                    <AsyncSelect
                        isClearable
                        defaultOptions
                        loadOptions={fetchSubjectAreas}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        placeholder={<div> subject Area</div>}
                        onChange={handleStreamChange}
                    />
                </Grid>

            </Grid>

            {

                loading ?
                    <LoadingTable columns={7} columnWidth={80} columnHeight={20} rows={10} rowWidth={130} rowHeight={20} />
                    :
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
                                                            onClick={(event) => {
                                                                // handle the click event here
                                                                window.open(`lead/${row?.lead_id}?app_id=${row?.id}`, '_blank');
                                                            }}
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
                                                                onClick={() => handleDetailOpen(row?.id)}
                                                                component="th"
                                                                id={labelId}
                                                                scope="row"
                                                                padding="none"
                                                                className='reg-name'
                                                            >
                                                                <a target='_blank' href={`applications/${row?.id}`}> {row?.student?.name}</a>
                                                                {/* {row?.first_name  } {row?.last_name} */}
                                                            </TableCell>
                                                            {/* <TableCell align="left">{row?.student?.email}</TableCell>
                                                            <TableCell align="left">{row?.student?.phone_number}</TableCell> */}
                                                            <TableCell align="left"> {row?.country?.name}</TableCell>
                                                            <TableCell align="left"> {row?.university?.name}</TableCell>
                                                            <TableCell align="left"> {row?.course_level?.name}</TableCell>
                                                            <TableCell align="left"> {row?.subject_area?.name}</TableCell>
                                                            {/* <TableCell align="left"><Button style={{ textTransform: 'none' }} onClick={() => handleEdit(row?.id)}><Edit fontSize='small' /></Button></TableCell> */}
                                                            <Popup trigger={<TableCell align="left"><IconButton style={{ textTransform: 'none' }} ><MoreHorizOutlined fontSize='small' /></IconButton></TableCell>}
                                                                position="left center">
                                                                <div className='app-table-container'>
                                                                    <ul className='app-table-options'>
                                                                        <li onClick={() => handleDownloadOpen(row?.id)}> Download Document</li>
                                                                        <li onClick={() => handleStageOpen(row)}> Change Application Stage</li>
                                                                    </ul>

                                                                </div>

                                                            </Popup>
                                                            {/* <PopupState variant="popper" popupId="demo-popup-popper">
                                                                {(popupState) => (
                                                                    <div>
                                                                        <TableCell align="left"><IconButton style={{ textTransform: 'none' }} {...bindToggle(popupState)}><MoreHorizOutlined fontSize='small' /></IconButton></TableCell>
                                                                        <Popper {...bindPopper(popupState)} transition>
                                                                            {({ TransitionProps }) => (
                                                                                <Fade {...TransitionProps} timeout={350}>
                                                                                    <Paper>
                                                                                        <Typography sx={{ p: 2 }}>The content of the Popper.</Typography>
                                                                                    </Paper>
                                                                                </Fade>
                                                                            )}
                                                                        </Popper>
                                                                    </div>
                                                                )}
                                                            </PopupState> */}

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
                            <TablePagination
                                rowsPerPageOptions={[10, 15, 25]}
                                component="div"
                                count={list?.meta?.total || 0}
                                rowsPerPage={list?.meta?.per_page || 0}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Box>
            }
        </>
    );
}