import React, { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LeadTable from './LeadTable';
import CreateLead from './Create/Create';
import { useRouter } from 'next/router';
import { Grid, IconButton, Popover, Typography, TextField } from '@mui/material';
import AssignLeadModal from './Modal/AssignModal';
import { MoreVert, PersonAddAlt1Outlined } from '@mui/icons-material';
import ReactSelector from 'react-select';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';



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

export default function CustomizedMenus() {

  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()

  const pageNumber = parseInt(router?.asPath?.split("=")[1] - 1 || 0);

  const searchOptions = [
    { name: 'Email' },
    { name: 'Name' },
    { name: 'Mobile' },
  ]


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [createModal, setCreateModal] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [editId, setEditId] = useState()

  const [selected, setSelected] = React.useState([]);

  const [page, setPage] = React.useState(pageNumber);

  const [assignId, setAssignId] = useState()

  const [singleAssign, setsingleAssign] = useState(false)
  const [assignToUser, setassignToUser] = useState()

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateNew = () => {
    setEditId(0)
  }

  const handleCreateassign = () => {
    setAssignId(0)
  }

  const handleSigleAssign = (id) => {
    setAssignId(0)
    setSelected([id])
    setsingleAssign(true)
  }

  const handleEditAssign = (detail) => {
    setAssignId(2)
    setSelected([detail?.id])
    setassignToUser(detail?.assignedToUser)
    setsingleAssign(true)
  }

  const handleRefresh = () => {
    if (page != 0) {
      setPage(0)
    }
    setRefresh(!refresh)
  }

  const noPageRefresh = () => {
    setRefresh(!refresh)
  }

  useEffect(() => {
    setValue('searchType', searchOptions[0]?.name)
  }, [])


  return (

    <>
      <CreateLead editId={editId} setEditId={setEditId} refresh={refresh} setRefresh={setRefresh} handleRefresh={handleRefresh} />
      <AssignLeadModal assignToUser={assignToUser} setassignToUser={setassignToUser} single={singleAssign} setsingle={setsingleAssign} selected={selected} setSelected={setSelected} editId={assignId} setEditId={setAssignId} handleRefresh={handleRefresh} handlePopClose={handleClose} />
      <section>
        <div className='page-title-block'>
          <div className='page-title-block-content justify-between'>
            <h1>Lead Manager</h1>

            {/* <div className='quick-view-block'>
              <p>Quick View : </p>

              <Button className='quick-view-btn' id="demo-customized-button" aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                System default View
              </Button>
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem className='active' onClick={handleClose} disableRipple>
                  System default View
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                  Hot Leads
                </MenuItem>

              </StyledMenu>
            </div> */}

            <Grid display={'flex'} >

              <Grid display={'flex'}>
                <Grid width={200}>
                  <ReactSelector
                    onInputChange={searchOptions}
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 })
                    }}
                    options={searchOptions}
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.name}

                    // inputValue={inProject}
                    value={
                      searchOptions.find(options =>
                        options.name === watch('searchType')
                      )
                    }
                    name='searchType'

                    defaultValue={(watch('searchType'))}
                    onChange={(selectedOption) => setValue('searchType', selectedOption?.name)}
                  />
                </Grid>
                {
                  watch('searchType') == 'Email' &&
                  <TextField
                    {...register('emailSearch')}
                    style={{ width: 300, marginRight: 10 }}
                    size='small'
                    id="outlined-name"
                    placeholder='search by email'
                  // label="Search Tasks"
                  />
                }
                {
                  watch('searchType') == 'Mobile' &&
                  <TextField
                    {...register('mobileSearch')}
                    style={{ width: 300, marginRight: 10 }}
                    size='small'
                    id="outlined-name"
                    placeholder='search by mobile'
                  // label="Search Tasks"
                  />
                }
                {
                  watch('searchType') == 'Name' &&
                  <TextField
                    {...register('nameSearch')}
                    style={{ width: 300, marginRight: 10 }}
                    size='small'
                    id="outlined-name"
                    placeholder='search by name'
                  // label="Search Tasks"
                  />
                }

                <Tooltip title={'Add Lead'}>
                  <IconButton onClick={handleCreateNew}>
                    <PersonAddAlt1Outlined fontSize='small' sx={{ color: 'grey', cursor: 'pointer' }} />
                  </IconButton>
                </Tooltip>
                {/* <Button sx={{ textTransform: 'none', mr: 1 }} onClick={handleCreateNew} size='small' variant='outlined'>Add</Button> */}

              </Grid>
              {/* disabled={selected?.length == 0} */}
              <IconButton onClick={handleClick}>
                <MoreVert fontSize='small' sx={{ color: 'grey', cursor: 'pointer' }} />
              </IconButton>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                {
                  selected?.length > 0 &&
                  <Typography onClick={handleCreateassign} sx={{ p: 1, pl: 2, pr: 2, cursor: 'pointer' }}>Assign</Typography>
                }
              </Popover>

              {/* <Button className='bg-sky-500' disabled={selected?.length == 0} sx={{ textTransform: 'none' }} onClick={handleCreateassign} size='small' variant='contained'>Assign</Button> */}
            </Grid>
          </div>

        </div>

        <div className='content-block'>
          <LeadTable handleEditAssign={handleEditAssign} openAssign={handleSigleAssign} refresh={refresh} setRefresh={setRefresh} page={page} setPage={setPage} selected={selected} setSelected={setSelected} />
        </div>
      </section>
    </>

  )
}

