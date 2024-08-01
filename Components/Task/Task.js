import React, { useState } from 'react'
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import TaskTable from './TaskTable';
import CreateTask from './Create/Create';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';


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

export default function TaskIndex() {

  const router = useRouter();
  const pageNumber = parseInt(router?.asPath?.split("=")[1] || 1);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [createModal, setCreateModal] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const [editId, setEditId] = useState()
  const [page, setPage] = useState(pageNumber)

  const handleCreate = () => {
    setEditId(0)
  }

  const handleRefresh = () => {
    if (page != 1) {
      setPage(1)
    }
    setRefresh(!refresh)
  }

  const archiveRefresh = () => {
    setRefresh(!refresh)
  }

  const [isActive, setIsActive] = useState(false); // State to manage whether the active className should be applied

  const toggleActive = () => {
    setIsActive(!isActive); // Toggle the state value
  };

  // console.log(refresh);

  return (

    <>
      <CreateTask editId={editId} setEditId={setEditId} refresh={refresh} setRefresh={setRefresh} handleRefresh={handleRefresh} />
      <section>
        <div className='page-title-block'>
          <div className='page-title-block-content justify-between'>
            <h1>Task Manager</h1>

            <Grid className=' flex justify-end'>

              {/* <Tooltip title={'Add Lead'}> */}
              <Button onClick={toggleActive} className='search_btn'>
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 20L15.6569 15.6569M15.6569 15.6569C17.1046 14.2091 18 12.2091 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C12.2091 18 14.2091 17.1046 15.6569 15.6569Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
              <Button sx={{ mr: 2 }} variant='outlined' onClick={handleCreate} className='add_lead_btn'>
                Add Task
              </Button>

            </Grid>
          </div>

          {/* <div className='page-title-block-right'>
            <Button sx={{ textTransform: 'none' }} onClick={handleCreate} size='small' variant='outlined'>Add</Button>
          </div> */}
        </div>


        <div className={`content-block lead-table-cntr ${isActive ? 'active' : ''}`}>
          <TaskTable page={page} setPage={setPage} editId={editId} setEditId={setEditId} refresh={refresh} archiveRefresh={archiveRefresh} />
        </div>
      </section>
    </>

  )
}

