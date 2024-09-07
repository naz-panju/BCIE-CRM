import React, { useState } from 'react'
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import EventsTable from './EventsTable';
import CreateEvent from './Create/create';
import { Grid } from 'rsuite';
import { Clear, EventOutlined, Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';


const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function EventsIndex() {

  const router = useRouter();

  const pageNumber = parseInt(router?.asPath?.split("=")[1] || 1);


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [createModal, setCreateModal] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [editId, setEditId] = useState()

  const [page, setPage] = React.useState(pageNumber);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateNew = () => {
    setEditId(0)
  }

  const handleRefresh = () => {
    if (page != 1) {
      setPage(1)
    }
    setRefresh(!refresh)
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setsearching] = useState(false)

  const handleSearch = () => {
    if (searchTerm) {
      setsearching(!searching)
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (searchTerm) {
      setsearching(!searching)
    }
  };

  return (

    <>
      <CreateEvent editId={editId} setEditId={setEditId} refresh={refresh} setRefresh={setRefresh} handleRefresh={handleRefresh} />
      <section>
        <div className='page-title-block'>
          <div className='page-title-block-content justify-between'>
            <h1>Events</h1>
            <Grid className='flex justify-end' >
              <TextField
              style={{marginLeft:'auto'}}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search event'
                variant='outlined'
                size='small'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Clear onClick={handleClear} sx={{ cursor: 'pointer' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <div onClick={handleSearch} className='flex justify-center items-center border p-1 bg-sky-200 hover:cursor-pointer hover:bg-sky-300' style={{ marginRight: 20 }}> <Search /></div>
              <Button style={{marginLeft:'auto'}} sx={{ mr: 2, textTransform: 'none' }} variant='outlined' onClick={handleCreateNew} className='add_lead_btn'>
                <EventOutlined fontSize='small' /> Add Event
              </Button>
            </Grid>

          </div>

          {/* <div className='page-title-block-right'>
            <Button sx={{ textTransform: 'none' }} onClick={handleCreateNew} size='small' variant='outlined'>Add</Button>
          </div> */}
        </div>


        <div className='content-block lead-table-cntr'>
          <EventsTable createOpen={editId} searchTerm={searchTerm} searching={searching} editId={editId} setEditId={setEditId} refresh={refresh} setRefresh={setRefresh} page={page} setPage={setPage} />
        </div>
      </section>
    </>

  )
}

