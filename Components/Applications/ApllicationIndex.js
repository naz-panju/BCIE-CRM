import React, { useEffect, useState } from 'react'
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import ApplicationTable from './ApplicationTable';
import { useForm } from 'react-hook-form';
import { Grid, InputAdornment, TextField } from '@mui/material';
import { Close, Search } from '@mui/icons-material';
import ReactSelector from 'react-select';


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

export default function ApplicationIndex() {

  const router = useRouter();

  const pageNumber = parseInt(router?.asPath?.split("=")[1] || 1);

  const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()
  const searchOptions = [
    { name: 'Email' },
    { name: 'Name' },
    { name: 'Mobile' },
    { name: 'Lead Id' }
  ]

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [createModal, setCreateModal] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [editId, setEditId] = useState()

  const [nameSearch, setnameSearch] = useState()

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

  const handleClearSearch = (from) => {
    if (from == 'email') {
      // setValue('emailSearch', '')
      // setemailSearch('')
    } else if (from == 'name') {
      setValue('nameSearch', '')
      setnameSearch('')
      sessionStorage.removeItem('applicationType')
      sessionStorage.removeItem('applicationSearch')
    } else if (from == 'mobile') {
      // setValue('mobileSearch', '')
      // setphoneSearch('')
    }
  }

  const handleTypeChange = (type) => {
    setValue('searchType', type)
    sessionStorage.setItem('applicationType', type)
    setnameSearch('')
  }

  const handleNameSearch = () => {
    setnameSearch(watch('nameSearch'))
    sessionStorage.setItem('applicationSearch', watch('nameSearch'))
  }

  const getInitialValue = () => {
    let getSearch = sessionStorage.getItem('applicationSearch')
    if (getSearch) {
      let getSearchType = sessionStorage.getItem('applicationType')
      setValue('searchType', getSearchType)
      setValue('nameSearch', getSearch)
      // setnameSearch(getSearch)
    }
  }

  const [isActive, setIsActive] = useState(false); // State to manage whether the active class should be applied
  const [searchActive, setsearchActive] = useState(false)

  const toggleActive = () => {
    setIsActive(!isActive); // Toggle the state value
  };

  useEffect(() => {
    setValue('searchType', searchOptions[0]?.name)
    // getInitialValue()
  }, [])

  return (

    <>
      <section>
        <div className='page-title-block'>
          <div className='page-title-block-content justify-between'>
            <h1>Applications</h1>
            <Grid display={'flex'} >

              <Grid display={'flex'}>
                <Button onClick={toggleActive} className='search_btn'>
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 20L15.6569 15.6569M15.6569 15.6569C17.1046 14.2091 18 12.2091 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C12.2091 18 14.2091 17.1046 15.6569 15.6569Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </Button>
              </Grid>
              {/* disabled={selected?.length == 0} */}

              {/* <Button className='bg-sky-500' disabled={selected?.length == 0} sx={{ textTransform: 'none' }} onClick={handleCreateassign} size='small' variant='contained'>Assign</Button> */}
            </Grid>

          </div>

          {/* <div className='page-title-block-right'>
            <Button sx={{ textTransform: 'none' }} onClick={handleCreateNew} size='small' variant='outlined'>Add</Button>
          </div> */}
        </div>


        <div className={`content-block lead-table-cntr app ${isActive ? 'active' : ''}`}>
          <ApplicationTable editId={editId} setEditId={setEditId} refresh={refresh} setRefresh={setRefresh} page={page} setPage={setPage} searchType={watch('searchType')} nameSearch={nameSearch} searchActive={searchActive} />
        </div>
      </section>
    </>

  )
}

