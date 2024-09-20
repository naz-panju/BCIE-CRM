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
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid, MenuItem, Pagination, Select, Stack, TableSortLabel } from '@mui/material';
import LoadingTable from '../Common/Loading/LoadingTable';
import { TemplateApi } from '@/data/Endpoints/Template';
import { Edit } from '@mui/icons-material';
import EmailTemplateDetailModal from '../EmailTemplateDetail/Modal';
import { visuallyHidden } from '@mui/utils';


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
        label: 'Template Name',
    },
    {
        id: 'subject',
        numeric: false,
        disablePadding: false,
        label: 'Subject ',
    },
    {
        id: 'default_cc',
        numeric: false,
        disablePadding: false,
        label: 'Default CC',
    },
    {
        id: 'edit',
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
                {/* <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell> */}
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

export default function TemplateTable({ refresh, editId, setEditId, page, setPage, searchTerm, searching }) {

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
        // router.replace(`/lead?page=${newPage + 1}`);
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
        if (!editId) {
            setDetailId(id)
        }
    }

    const fetchTable = () => {
        setLoading(true)
        TemplateApi.list({ limit: limit, page: page, keyword: searchTerm , sort_field: field,sort_order: sortOrder ? 'asc' : 'desc',}).then((response) => {
            setList(response?.data)
            setLoading(false)
        }).catch((error) => {
            console.log(error);
            setLoading(false)
        })
    }
    useEffect(() => {
        fetchTable()
    }, [page, refresh, limit, searching,sortOrder])

    return (

        <>
            <EmailTemplateDetailModal id={detailId} setId={setDetailId} />

            {

                loading ?
                    <LoadingTable columns={3} columnWidth={100} columnHeight={20} rows={10} rowWidth={200} rowHeight={20} />
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
                                                        let mainEmail = emails.shift();

                                                        return (
                                                            <TableRow className='table-custom-tr'
                                                                hover
                                                                // onClick={(event) => handleClick(event, row.id)}
                                                                role="checkbox"
                                                                aria-checked={isItemSelected}
                                                                tabIndex={-1}
                                                                key={row.id}
                                                                selected={isItemSelected}
                                                                sx={{ cursor: 'pointer' }}
                                                            >
                                                                {/* <TableCell className='checkbox-tb' padding="checkbox">
                                                                    <Checkbox
                                                                        onClick={(event) => handleClick(event, row.id)}
                                                                        color="primary"
                                                                        checked={isItemSelected}
                                                                        inputProps={{
                                                                            'aria-labelledby': labelId,
                                                                        }}
                                                                    />
                                                                </TableCell> */}
                                                                <TableCell
                                                                    onClick={() => handleDetailOpen(row?.id)}
                                                                    component="th"
                                                                    id={labelId}
                                                                    scope="row"
                                                                    padding="none"
                                                                    className='reg-name a_hover'
                                                                >
                                                                    {row.name}
                                                                </TableCell>
                                                                <TableCell align="left">{row?.subject}</TableCell>
                                                                <TableCell align="left"> {mainEmail}
                                                                    {emails.length > 0 && (
                                                                        <Tooltip title={emails.join(', ')}>
                                                                            <span style={{ color: 'grey' }}> +{emails.length}</span>
                                                                        </Tooltip>
                                                                    )}</TableCell>
                                                                <TableCell align="left"><Button style={{ textTransform: 'none' }} onClick={() => handleEdit(row?.id)}><Edit fontSize='small' /></Button></TableCell>

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
                                                                    <h4 style={{ color: 'grey' }}>No Template Found</h4>
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