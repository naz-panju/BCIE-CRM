import React, { useState } from 'react'
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import LeadTable from './LeadTable';
import CreateLead from './Create/Create';
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import AssignLeadModal from './Modal/AssignModal';
import { DownloadOutlined, GroupsOutlined, ImportExportOutlined, PersonAddAlt1Outlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import BulkUpload from './Modal/Bulkupload';



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

  // const session=useSession()

  // console.log(session?.data?.user)

  const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm()

  const pageNumber = parseInt(router?.asPath?.split("=")[1] || 1);

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

  const [selected, setSelected] = React.useState([]);

  const [page, setPage] = React.useState(pageNumber);

  const [assignId, setAssignId] = useState()

  const [singleAssign, setsingleAssign] = useState(false)
  const [assignToUser, setassignToUser] = useState()

  const [nameSearch, setnameSearch] = useState()
  const [phoneSearch, setphoneSearch] = useState()
  const [emailSearch, setemailSearch] = useState()
  const [userIdSearch, setuserIdSearch] = useState()

  const [searchActive, setsearchActive] = useState(false)

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleClick = (event) => {
    if (selected?.length > 0) {
      setAnchorEl(event.currentTarget);
    }
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
    setassignToUser(detail)
    setsingleAssign(true)
  }

  const handleRefresh = () => {
    if (page != 1) {
      setPage(1)
    }
    setRefresh(!refresh)
  }

  const [isActive, setIsActive] = useState(false); // State to manage whether the active className should be applied

  const toggleActive = () => {
    setIsActive(!isActive); // Toggle the state value
  };

  const noPageRefresh = () => {
    setRefresh(!refresh)
  }

  const handleClearSearch = (from) => {
    if (from == 'email') {
      setValue('emailSearch', '')
      setemailSearch('')
    } else if (from == 'name') {
      setValue('nameSearch', '')
      setnameSearch('')
      sessionStorage.removeItem('leadType')
      sessionStorage.removeItem('leadSearch')
    } else if (from == 'mobile') {
      setValue('mobileSearch', '')
      setphoneSearch('')
    }
  }

  const handleTypeChange = (type) => {
    setValue('searchType', type)
    sessionStorage.setItem('leadType', type)
    setnameSearch('')
    // setValue('emailSearch', '')
    // setValue('mobileSearch', '')
    // setValue('nameSearch', '')

    // setnameSearch('')
    // setemailSearch('')
    // setphoneSearch('')
    // setuserIdSearch('')
  }

  const handleNameSearch = () => {
    setnameSearch(watch('nameSearch'))
    sessionStorage.setItem('leadSearch', watch('nameSearch'))

  }
  const handleEmailSearch = () => {
    setemailSearch(watch('emailSearch'))
  }
  const handlePhoneSearch = () => {
    setphoneSearch(watch('phoneSearch'))
  }
  const handleUserIdSearch = () => {
    setuserIdSearch(watch('userIdSearch'))
  }

  const getInitialValue = () => {
    let getSearch = sessionStorage.getItem('leadSearch')
    let getSearchType = sessionStorage.getItem('leadType')

    if (getSearchType) {
      setValue('searchType', getSearchType)
    }
    if (getSearch) {
      // console.log(getSearchType);
      setValue('nameSearch', getSearch)
      // setnameSearch(getSearch)
    }
  }

  const [uploadId, setuploadId] = useState()
  const handleUploadOpen = () => {
    setuploadId(0)
  }

  useEffect(() => {
    setValue('searchType', searchOptions[0]?.name)
    // getInitialValue()
  }, [])



  return (

    <>
      <CreateLead from='lead' editId={editId} setEditId={setEditId} refresh={refresh} setRefresh={setRefresh} handleRefresh={handleRefresh} />
      <AssignLeadModal assignToUser={assignToUser} setassignToUser={setassignToUser} single={singleAssign} setsingle={setsingleAssign} selected={selected} setSelected={setSelected} editId={assignId} setEditId={setAssignId} handleRefresh={handleRefresh} handlePopClose={handleClose} />
      <BulkUpload editId={uploadId} setEditId={setuploadId} />
      <section>
        <div className='page-title-block'>
          <div className='page-title-block-content justify-between'>
            <h1>Lead Manager</h1>

            <Grid display={'flex'} >

              <Grid display={'flex'}>

                {/* <Tooltip title={'Add Lead'}> */}
                <Button onClick={toggleActive} className='search_btn'>
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 20L15.6569 15.6569M15.6569 15.6569C17.1046 14.2091 18 12.2091 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C12.2091 18 14.2091 17.1046 15.6569 15.6569Z" stroke="black" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" />
                  </svg>
                </Button>
                <Button sx={{ mr: 2 ,textTransform:'none'}} variant='outlined' onClick={handleCreateNew} className='add_lead_btn'>
                  <PersonAddAlt1Outlined fontSize='small' /> Add Lead
                </Button>

                <Button sx={{ mr: 2,textTransform:'none' }} variant='outlined' onClick={handleUploadOpen} className='add_lead_btn'>
                  <DownloadOutlined fontSize='small' /> Import Leads
                </Button>

                <Tooltip title={selected?.length === 0 && 'Please select one or more Lead'}>

                  <span>
                    <Button disabled={selected?.length == 0} variant='outlined' onClick={handleCreateassign} className={`assign_btn ${selected?.length > 0 ? 'box_checked' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7H15M9 7V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7M9 7H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>  Assign
                      {
                        selected?.length > 0 ?
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <circle cx="5" cy="5" r="5" fill="#46F863" />
                          </svg>
                          :
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <circle cx="5" cy="5" r="5" fill="#808080" />
                          </svg>
                      }
                    </Button>
                  </span>
                </Tooltip>
                {/* </Tooltip> */}
                {/* <Button sx={{ textTransform: 'none', mr: 1 }} onClick={handleCreateNew} size='small' variant='outlined'>Add</Button> */}

              </Grid>
              {/* disabled={selected?.length == 0} */}

              {/* <Button className='bg-sky-500' disabled={selected?.length == 0} sx={{ textTransform: 'none' }} onClick={handleCreateassign} size='small' variant='contained'>Assign</Button> */}
            </Grid>
          </div>

        </div>

        <div className={`content-block lead-table-cntr ${isActive ? 'active' : ''}`}>
          <LeadTable handleEditAssign={handleEditAssign} openAssign={handleSigleAssign} refresh={refresh} setRefresh={setRefresh} page={page} setPage={setPage} selected={selected} setSelected={setSelected} searchType={watch('searchType')} nameSearch={nameSearch} emailSearch={emailSearch} phoneSearch={phoneSearch} userIdSearch={userIdSearch} searchActive={searchActive} />
        </div>
      </section>
    </>

  )
}

