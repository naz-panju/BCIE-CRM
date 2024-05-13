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
import { Button, Grid, InputAdornment, MenuItem, Pagination, Select, Stack, TextField } from '@mui/material';
import LoadingTable from '../Common/Loading/LoadingTable';
import { ListingApi } from '@/data/Endpoints/Listing';
import AsyncSelect from "react-select/async";
import { Close, PersonAdd, PersonAddAlt, PersonOutline, Search } from '@mui/icons-material';
import ReactSelector from 'react-select';
import { useForm } from 'react-hook-form';
import UserProfile from '../Common/Profile';




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
    label: 'Registered Name',
  },
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: 'Registered Email ',
  },
  {
    id: 'mobile',
    numeric: true,
    disablePadding: false,
    label: 'Registered Mobile',
  },
  {
    id: 'assigned_to',
    numeric: true,
    disablePadding: false,
    label: 'Assigned To',
  },
  {
    id: 'stage',
    numeric: false,
    disablePadding: false,
    label: 'Stage',
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
          <div className="form-group">
            <input id='html2'
              type='checkbox'
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              // checked={rowCount > 0 && numSelected === rowCount}
              checked={numSelected > 0}
              onChange={onSelectAllClick}
              inputprops={{
                'aria-label': 'select all desserts',
              }}
            />
            <label htmlFor="html2"> </label>
          </div>
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

export default function EnhancedTable({ refresh, page, setPage, selected, setSelected, openAssign, handleEditAssign }) {

  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()


  // const pageNumber = parseInt(router?.asPath?.split("=")[1] - 1 || 0);


  // console.log(router);

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');

  // const [selected, setSelected] = React.useState([]);  //recieving props from parent lead componnet
  // const [page, setPage] = React.useState(pageNumber);
  const [dense, setDense] = React.useState(false);
  const [limit, setLimit] = React.useState(10);
  const [list, setList] = useState([])
  const [lastPage, setlastPage] = useState()
  const [current_page, setCurrent_page] = useState()

  const pageNumber = parseInt(router?.asPath?.split("=")[1] || 1);
  // console.log(pageNumber); 

  const handlePreviousPage = () => {
    router.push(`/lead?page=${current_page - 1}`)
    setPage(current_page - 1)
  }
  const handleNextPage = () => {
    router.push(`/lead?page=${current_page + 1}`)
    setPage(current_page + 1)
  }

  const handleByPageNumber = (index) => {
    router.push(`/lead?page=${index + 1}`)
    setPage(index + 1)
  }



  const [loading, setLoading] = useState(false)

  const [selectedAssignedTo, setSelectedAssignedTo] = useState()
  const [selectedStage, setSelectedStage] = useState()
  // const [searchType, setsearchType] = useState(second)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {

    // if (event.target.checked) {
    //   const newSelected = list?.data?.map((n) => n.id);
    //   setSelected(newSelected);
    //   return;
    // }
    // setSelected([]);
    if (event.target.checked && selected?.length != list?.data?.length) {
      const newSelected = list?.data?.map((n) => n.id);
      setSelected(newSelected);
      return;
    }

    // Uncheck all if all are checked
    if (selected?.length === list?.data?.length) {
      setSelected([]);
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
    // router.push(`/lead?page=${newPage + 1}`);
    router.replace(`/lead?page=${newPage}`);
  };

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
    page > 0 ? Math.max(0, (1 + page) * limit - list?.meta?.total?.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(list?.data, getComparator(order, orderBy))?.slice(
        page * limit,
        page * limit + limit,
      ),
    [order, orderBy, page, limit],
  );

  const fetchUser = (e) => {
    return ListingApi.users({ keyword: e }).then(response => {
      if (typeof response?.data?.data !== "undefined") {
        return response.data.data;
      } else {
        return [];
      }
    })
  }

  const fetchStage = (e) => {
    return ListingApi.stages({ keyword: e }).then(response => {
      if (typeof response?.data?.data !== "undefined") {
        return response.data.data;
      } else {
        return [];
      }
    })
  }

  const searchOptions = [
    { name: 'Email' },
    { name: 'Name' },
    { name: 'Mobile' },
    { name: 'Lead Id' }
  ]

  const handleAssignedTo = (e) => {
    setSelectedAssignedTo(e?.id || '');
    setValue('assignedTo', e || '')
  }
  const handleSelectStage = (e) => {
    setSelectedStage(e?.id || '');
    setValue('stage', e || '')
  }

  const fetchTable = () => {
    setLoading(true)
    let params = {
      limit: limit,
      assigned_to: selectedAssignedTo,
      stage: selectedStage,
      name: watch('nameSearch'),
      email: watch('emailSearch'),
      phone_number: watch('numberSearch'),
      lead_id: watch('lead_id_search'),
      page: page
    }
    // if (watch('searchType') == 'Name') {
    //   params['name'] = nameSearch
    // } else if (watch('searchType') == 'Email') {
    //   params['email'] = nameSearch
    // } else if (watch('searchType') == 'Mobile') {
    //   params['phone_number'] = nameSearch
    // } else if (watch('searchType') == 'Lead Id') {
    //   params['lead_id'] = nameSearch
    // }

    LeadApi.list(params).then((response) => {
      // console.log(response);
      setList(response?.data)
      setLoading(false)
    }).catch((error) => {
      console.log(error);
      setLoading(false)
    })
  }

  const [nameSearch, setnameSearch] = useState()
  const [phoneSearch, setphoneSearch] = useState()
  const [emailSearch, setemailSearch] = useState()
  const [userIdSearch, setuserIdSearch] = useState()

  const handleClearSearch = (from) => {
    setValue('nameSearch', '')
    setValue('emailSearch', '')
    setValue('numberSearch', '')
    setValue('lead_id_search', '')

    setValue('assignedTo', null)
    setValue('stage', '')

    setSelectedAssignedTo()
    setSelectedStage()

    setsearchRefresh(!searchRefresh)

    // if (from == 'email') {
    //   setValue('emailSearch', '')
    //   setemailSearch('')
    // } else if (from == 'name') {
    //   setValue('nameSearch', '')
    //   setnameSearch('')
    //   sessionStorage.removeItem('leadType')
    //   sessionStorage.removeItem('leadSearch')
    // } else if (from == 'mobile') {
    //   setValue('mobileSearch', '')
    //   setphoneSearch('')
    // }
  }

  const handleTypeChange = (type) => {
    setValue('searchType', type)
    sessionStorage.setItem('leadType', type)
    setnameSearch('')
  }

  const handleNameSearch = () => {
    setnameSearch(watch('nameSearch'))
    sessionStorage.setItem('leadSearch', watch('nameSearch'))

  }

  const [searchRefresh, setsearchRefresh] = useState(false)
  const onSearch = () => {
    setsearchRefresh(!searchRefresh)
  }

  useEffect(() => {
    setValue('searchType', searchOptions[0]?.name)
    // getInitialValue()
  }, [])

  useEffect(() => {
    fetchTable()
  }, [page, refresh, limit, searchRefresh])

  return (
    <>
      <Grid p={1} pl={0} mb={1} container display={'flex'}>
        <Grid mr={1} item md={2.8}>
          <AsyncSelect
            isClearable
            defaultOptions
            name='assignedTo'
            value={watch('assignedTo')}
            defaultValue={watch('assignedTo')}
            loadOptions={fetchUser}
            getOptionLabel={(e) => e.name}
            getOptionValue={(e) => e.id}
            placeholder={<div>Assigned To</div>}
            onChange={handleAssignedTo}
          />
        </Grid>

        <Grid mr={1} item md={2.8}>
          <AsyncSelect
            isClearable
            defaultOptions
            name='stage'
            value={watch('stage')}
            defaultValue={watch('stage')}
            loadOptions={fetchStage}
            getOptionLabel={(e) => e.name}
            getOptionValue={(e) => e.id}
            placeholder={<div>Select Stage</div>}
            onChange={handleSelectStage}
          />
        </Grid>

        <Grid mr={1} item md={2.8}>
          <TextField
            fullWidth
            {...register('nameSearch')}
            size='small'
            id="outlined-name"
            placeholder={`search by Name`}
          />
        </Grid>

        <Grid mr={1} item md={2.8}>
          <TextField
            fullWidth
            {...register('emailSearch')}
            size='small'
            id="outlined-name"
            placeholder={`search by Email`}
          />
        </Grid>


      </Grid>

      <Grid p={1} pl={0} mb={1} container display={'flex'}>

        <Grid mr={1} item md={2.8}>
          <TextField
            fullWidth
            type='number'
            {...register('numberSearch')}
            size='small'
            id="outlined-name"
            placeholder={`search by Mobile`}
          />
        </Grid>

        <Grid mr={1} item md={2.8}>
          <TextField
            fullWidth
            type='number'
            {...register('lead_id_search')}
            size='small'
            id="outlined-name"
            placeholder={`search by Lead Id`}
          />
        </Grid>

        <Grid mr={1} item md={2.8}>

        </Grid>

        <Grid mr={1} item md={2.8} display={'flex'} justifyContent={'end'} alignItems={'center'}>
          <Button onClick={onSearch} variant='contained' size='small' className='bg-sky-500' sx={{ height: '30px', textTransform: 'none', mr: 2 }}>Filter</Button>
          <Button onClick={handleClearSearch} variant='contained' size='small' className='bg-sky-300' sx={{ height: '30px', textTransform: 'none' }}>Clear</Button>
        </Grid>
      </Grid>
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

                            // console.log(row);

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
                                <TableCell className='checkbox-tb' padding="checkbox">
                                  <div className="form-group">
                                    <input
                                      type='checkbox'
                                      id={row?.id}
                                      onClick={(event) => handleClick(event, row.id)}
                                      color="primary"
                                      checked={isItemSelected}
                                      inputprops={{
                                        'aria-labelledby': labelId,
                                      }}
                                    />
                                    <label htmlFor={row?.id}> </label>
                                  </div>


                                </TableCell>
                                <TableCell
                                  component="th"
                                  id={labelId}
                                  scope="row"
                                  padding="none"
                                  className='reg-name'
                                >
                                  <a target='_blank' href={`/lead/${row?.id}`}>{row.name}</a>
                                </TableCell>
                                <TableCell align="left">{row?.email}</TableCell>
                                <TableCell align="left">{row?.phone_country_code} {row?.phone_number}</TableCell>
                                <TableCell align="left">
                                  {
                                    row?.assignedToCounsellor ?
                                      <Button onClick={() => handleEditAssign(row)} style={{ color: 'blue', textTransform: 'none' }} >{row?.assignedToCounsellor?.name}</Button>
                                      :
                                      <Button onClick={() => openAssign(row?.id)}><PersonOutline sx={{ color: 'blue', cursor: 'pointer' }} /></Button>
                                  }
                                  {/* {row?.assignedToUser?.name} */}
                                </TableCell>
                                <TableCell align="left">{row?.stage?.name}</TableCell>
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
                                  <h4 style={{ color: 'grey' }}>No Lead Found</h4>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                      }
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* <TablePagination
                  rowsPerPageOptions={[10, 15, 25]}
                  component="div"
                  count={list?.meta?.total || 0}
                  rowsPerPage={list?.meta?.per_page || 0}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
              </Paper>
            </Box>
            <div className='table-pagination d-flex justify-content-between align-items-center'>
              <div className='d-flex  align-items-center'>
                <UserProfile />

              </div>
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