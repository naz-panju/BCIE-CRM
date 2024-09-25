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
import { useState } from 'react';
import { TaskApi } from '@/data/Endpoints/Task';
import moment from 'moment';
import { Button, FormControlLabel, FormGroup, Grid, MenuItem, Pagination, Select, Stack, TextField } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import AsyncSelect from "react-select/async";
import ReactSelector from 'react-select';
import { useForm } from 'react-hook-form';
import TaskDetailModal from '../TaskDetails/Modal';
import LoadingTable from '../Common/Loading/LoadingTable';
import StatusModal from './StatusModal';
import { useSession } from 'next-auth/react';
import TaskCompletePopup from '../LeadDetails/Modals/TaskCompleteModal';



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
    id: 'tasks.title',
    numeric: false,
    disablePadding: true,
    label: 'Title',
  },
  {
    id: 'assignedToUser.name',
    numeric: true,
    disablePadding: false,
    label: 'Assigned To ',
  },
  {
    id: 'createdBy.name',
    numeric: true,
    disablePadding: false,
    label: 'Created By',
  },
  {
    id: 'tasks.due_date',
    numeric: true,
    disablePadding: false,
    label: 'Due Date',
  },

  {
    id: 'tasks.status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'leads.name',
    numeric: true,
    disablePadding: false,
    label: 'Student',
  },
  {
    id: 'universities.name',
    numeric: true,
    disablePadding: false,
    label: 'University',
  },
  {
    id: 'icon',
    numeric: true,
    disablePadding: false,
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

export default function TaskTable({ refresh, editId, setEditId, page, setPage, archiveRefresh }) {

  const { watch, setValue, register } = useForm()

  const session = useSession()

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  // const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [limit, setLimit] = React.useState(50);
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  const [selectedUser, setselectedUser] = useState()
  const [selectedCreatedUser, setSelectedCreatedUser] = useState()
  const [selectedStatus, setSelectedStatus] = useState('Not Started')

  const [taskDetails, setTaskDetails] = useState()
  const [statusOpen, setStatusOpen] = useState(false)

  const [archived, setArchived] = useState(false)

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
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleEdit = (id) => {
    setEditId(id)
  }

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * limit - list?.meta?.total?.length) : 0;

  // const visibleRows = React.useMemo(
  //   () =>
  //     stableSort(list?.data, getComparator(order, orderBy))?.slice(
  //       page * rowsPerPage,
  //       page * rowsPerPage + rowsPerPage,
  //     ),
  //   [order, orderBy, page, rowsPerPage],
  // );

  const fetchUser = (e) => {
    return ListingApi.permissionUser({ keyword: e }).then(response => {
      if (typeof response?.data?.data !== "undefined") {
        return response.data.data;
      } else {
        return [];
      }
    })
  }

  const Status = [
    { id: 1, name: "Completed", value: "Completed" },
    { id: 2, name: "Not Completed", value: "Not Started" },
  ]

  const Options = [
    { id: 1, name: "Yes", value: "Yes" },
    { id: 2, name: "No", value: "No" },
  ]

  const fetchTable = () => {
    setLoading(true)
    let params = {
      limit: limit,
      assigned_to_user: selectedUser,
      created_by: selectedCreatedUser,
      status: selectedStatus,
      keyword: watch('title'),
      sort_field: field,
      sort_order: sortOrder ? 'asc' : 'desc',
      page: page
    }
    if (archived) {
      params['archived'] = 1
    } else {
      params['archived'] = ''
    }

    if (overDue) {
      params['overdue'] = 1
    } else {
      params['overdue'] = ''
    }

    TaskApi.list(params).then((response) => {
      // console.log(response);
      setList(response?.data)
      setLoading(false)
    }).catch((error) => {
      console.log(error);
      setLoading(false)
    })
  }

  const handleUserSelect = (e) => {
    setselectedUser(e?.id || '');
    setValue('assigned_to', e || '')
  }
  const handleCreateSelect = (e) => {
    setSelectedCreatedUser(e?.id || '');
    setValue('created_by', e || '')
  }
  const handleStatusSelect = (e) => {
    setSelectedStatus(e?.value || '');
    setValue('status', e?.value || '')
  }

  const handleArchiveSelect = (e) => {
    if (e?.value == 'Yes') {
      setArchived(true);
    } else {
      setArchived(false);
    }
    setValue('archived', e?.value || '')
  }

  const [overDue, setoverDue] = useState(false)
  const handleOverDueSelect = (e) => {
    if (e?.value == 'Yes') {
      setoverDue(true);
    } else {
      setoverDue(false);
    }
    setValue('over_due', e?.value || '')
  }


  const handleDetailOpen = (id) => {
    setDetailId(id)
  }

  const handleStatusChange = (data) => {
    setStatusOpen(true)
    setTaskDetails(data)
  }

  const handleArchived = (event) => {
    // setArchived('archived');
    if (event.target.checked) {
      setArchived(true)
    } else {
      setArchived(false)
    }
  };

  const handleOverDue = (event) => {
    // setArchived('archived');
    if (event.target.checked) {
      setoverDue(true)
    } else {
      setoverDue(false)
    }
  };

  const [searchRefresh, setsearchRefresh] = useState(false)

  const onSearch = () => {
    if (page == 1) {
      setsearchRefresh(!searchRefresh)
    } else {
      setPage(1)
    }
  }
  const handleClearSearch = (from) => {
    // if (watch('nameSearch') || watch('emailSearch') || watch('numberSearch') || watch('lead_id_search') || watch('assignedTo') || watch('stage')) {
    setValue('title', '')
    setValue('created_by', '')
    setValue('assigned_to', '')
    setValue('status', '')

    setArchived(false)
    setValue('archived', 'No')

    setoverDue(false);
    setValue('over_due', 'No')

    setselectedUser()
    setSelectedCreatedUser()
    setSelectedStatus()

    onSearch()
  }



  const [completeId, setcompleteId] = useState()
  const [completeLoading, setcompleteLoading] = useState(false)

  const completeOpen = (id) => {
    setcompleteId(id)
  }


  useEffect(() => {
    setValue('status','Not Started')
    fetchTable()
  }, [page, refresh, limit, searchRefresh, sortOrder])


  return (
    <>

      <TaskDetailModal id={detailId} setId={setDetailId} archiveRefresh={archiveRefresh} />
      <TaskCompletePopup getDetails={fetchTable} ID={completeId} setID={setcompleteId} loading={completeLoading} setLoading={setcompleteLoading} title={'Mark this Task as Completed'} />

      {
        taskDetails &&
        <StatusModal onUpdate={fetchTable} setDataSet={setTaskDetails} dataSet={taskDetails} setOpen={setStatusOpen} Open={statusOpen} />
      }

      <div className="filter_sec">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div>
            <div className='form-group'>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" className='sear-ic'>
                <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <TextField
                fullWidth
                {...register('title')}
                size='small'
                id="outlined-name"
                placeholder={`Search by Title`}
              />
            </div>
          </div>

          <div>
            <div className='form-group' >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none" className='sear-ic'>
                <path d="M13 17C14.1046 17 15.0454 16.0899 14.7951 15.0141C14.1723 12.338 12.0897 11 8 11C3.91032 11 1.8277 12.338 1.20492 15.0141C0.954552 16.0899 1.89543 17 3 17H13Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8 8C10 8 11 7 11 4.5C11 2 10 1 8 1C6 1 5 2 5 4.5C5 7 6 8 8 8Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <AsyncSelect
                isClearable
                defaultOptions
                loadOptions={fetchUser}
                name='created_by'
                value={watch('created_by')}
                defaultValue={watch('created_by')}
                getOptionLabel={(e) => e.name}
                getOptionValue={(e) => e.id}
                placeholder={<div>Created By</div>}
                onChange={handleCreateSelect}
              />
            </div>
          </div>

          <div>
            <div className='form-group' >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none" className='sear-ic'>
                <path d="M13 17C14.1046 17 15.0454 16.0899 14.7951 15.0141C14.1723 12.338 12.0897 11 8 11C3.91032 11 1.8277 12.338 1.20492 15.0141C0.954552 16.0899 1.89543 17 3 17H13Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8 8C10 8 11 7 11 4.5C11 2 10 1 8 1C6 1 5 2 5 4.5C5 7 6 8 8 8Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <AsyncSelect
                name='assigned_to'
                value={watch('assigned_to')}
                defaultValue={watch('assigned_to')}
                isClearable
                defaultOptions
                loadOptions={fetchUser}
                getOptionLabel={(e) => e.name}
                getOptionValue={(e) => e.id}
                placeholder={<div>Assigned To</div>}
                onChange={handleUserSelect}
              />
            </div>
          </div>

          <div>
            <div className='form-group' >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" fill="none" className='sear-ic'>
                <path d="M19 9.00012L10 13.0001L1 9.00012M19 5.00012L10 9.00012L1 5.00012L10 1.00012L19 5.00012Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <ReactSelector
                placeholder={'Status'}
                onInputChange={Status}
                styles={{ menu: provided => ({ ...provided, zIndex: 9999 }) }}
                options={Status}
                getOptionLabel={option => option.name}
                getOptionValue={option => option.value}
                value={
                  Status.filter(options =>
                    options?.value == watch('status')
                  )
                }
                name='status'
                isClearable
                defaultValue={(watch('status'))}
                onChange={(selectedOption) => handleStatusSelect(selectedOption)}
              />
            </div>
          </div>

          <div>
            {/* <div className='form-group' >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" fill="none" className='sear-ic'>
                <path d="M19 9.00012L10 13.0001L1 9.00012M19 5.00012L10 9.00012L1 5.00012L10 1.00012L19 5.00012Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <ReactSelector
                placeholder={'Archived'}
                onInputChange={Options}
                styles={{ menu: provided => ({ ...provided, zIndex: 9999 }) }}
                options={Options}
                getOptionLabel={option => option.name}
                getOptionValue={option => option.value}
                value={
                  Options.filter(options =>
                    options?.name == watch('archived')
                  )
                }
                name='archived'
                isClearable={false}
                defaultValue={(watch('archived'))}
                onChange={(selectedOption) => handleArchiveSelect(selectedOption)}
              />
            </div> */}
            <div style={{ paddingLeft: '8px' }} className='form-group' >
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={archived} onChange={handleArchived} />} label="Archived" />
              </FormGroup>
            </div>
          </div>

          <div>
            {/* <div className='form-group' >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" fill="none" className='sear-ic'>
                <path d="M19 9.00012L10 13.0001L1 9.00012M19 5.00012L10 9.00012L1 5.00012L10 1.00012L19 5.00012Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <ReactSelector
                placeholder={'Over Due'}
                onInputChange={Options}
                styles={{ menu: provided => ({ ...provided, zIndex: 9999 }) }}
                options={Options}
                getOptionLabel={option => option.name}
                getOptionValue={option => option.value}
                value={
                  Options.filter(options =>
                    options?.name == watch('over_due')
                  )
                }
                name='over_due'
                isClearable={false}
                defaultValue={(watch('over_due'))}
                onChange={(selectedOption) => handleOverDueSelect(selectedOption)}
              />
            </div> */}
            <div style={{ paddingLeft: '8px' }} className='form-group' >
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={overDue} onChange={handleOverDue} />} label="Over Due" />
              </FormGroup>
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
      </div >


      {/* <Grid item md={5} display={'flex'} justifyContent={'end'}>

        <FormGroup>
          <FormControlLabel control={<Checkbox checked={archived} onChange={handleArchived} />} label="Archived Task" />
        </FormGroup>
      </Grid> */}


      {
        loading ?
          <LoadingTable columns={6} columnWidth={80} columnHeight={20} rows={10} rowWidth={200} rowHeight={20} />
          :
          <Box sx={{ width: '100%' }}>

            <Paper sx={{ width: '100%', mb: 2 }}>
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
                    rowCount={list?.meta?.total}
                  />
                  <TableBody>
                    {
                      list?.data?.length > 0 ?
                        list?.data?.map((row, index) => {
                          const isItemSelected = isSelected(row.id);
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <TableRow className='table-custom-tr'
                              hover
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.id}
                              selected={isItemSelected}
                              sx={{ cursor: 'pointer' }}
                            >

                              <TableCell
                                onClick={() => handleDetailOpen(row?.id)}
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                                className='reg-name a_hover'
                              >
                                {row?.title}
                              </TableCell>
                              <TableCell align="left">{row?.assignedToUser?.name}</TableCell>
                              <TableCell align="left">{row?.createdBy?.name}</TableCell>
                              <TableCell align="left">{row?.due_date ?
                                moment(row?.due_date).format('DD-MM-YYYY')
                                :
                                'NA'}
                              </TableCell>
                              <TableCell align="left">
                                {
                                  row?.status == 'Completed' ?
                                    <Tooltip title={row?.status_note}>
                                      Completed
                                    </Tooltip>
                                    :

                                    session?.data?.user?.id == row?.assignedToUser?.id ?
                                      <Button onClick={() => completeOpen(row?.id)} size='small' variant='outlined' sx={{ textTransform: 'none' }}>Mark as Completed</Button>
                                      :
                                      row?.status
                                }
                              </TableCell>
                              <TableCell align="left"><a target='_blank' href={`/lead/${row?.lead?.id}`}>{row?.lead?.name || 'NA'}</a></TableCell>
                              <TableCell align="left">{row?.applicaion?.university?.name || 'NA'}</TableCell>
                              <TableCell align="left">
                                {
                                  session?.data?.user?.id == row?.createdBy?.id &&
                                  row?.status != 'Completed' &&
                                  <Button style={{ textTransform: 'none' }} onClick={() => handleEdit(row?.id)}>
                                    <Edit style={{ color: 'blue' }} fontSize='small' />
                                  </Button>
                                }
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
                            <TableCell colSpan={8} align="center">
                              <div className='no-table-ask-block'>
                                <h4 style={{ color: 'grey' }}>No Task Found</h4>
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

      }


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
  );
}