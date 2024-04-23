import React, { useEffect, useState } from 'react'
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import { useRouter } from 'next/router';
import ArchiveTable from './ArchiveTable';
import { useForm } from 'react-hook-form';
import { Grid, InputAdornment, TextField } from '@mui/material';
import { Close, Search } from '@mui/icons-material';
import SearchInput from '@/utils/SearchInput';
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

export default function ArchiveIndex() {

  const router = useRouter();

  const pageNumber = parseInt(router?.asPath?.split("=")[1] - 1 || 0);

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
    if (page != 0) {
      setPage(0)
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
      sessionStorage.removeItem('archiveType')
      sessionStorage.removeItem('archiveSearch')
    } else if (from == 'mobile') {
      // setValue('mobileSearch', '')
      // setphoneSearch('')
    }
  }

  const handleTypeChange = (type) => {
    setValue('searchType', type)
    sessionStorage.setItem('archiveType', type)
    setnameSearch('')
  }

  const handleNameSearch = () => {
    setnameSearch(watch('nameSearch'))
    sessionStorage.setItem('archiveSearch', watch('nameSearch'))
  }

  const getInitialValue = () => {
    let getSearch = sessionStorage.getItem('archiveSearch')
    if (getSearch) {
      let getSearchType = sessionStorage.getItem('archiveType')
      setValue('searchType', getSearchType)
      setValue('nameSearch', getSearch)
      // setnameSearch(getSearch)
    }
  }

  useEffect(() => {
    setValue('searchType', searchOptions[0]?.name)
    // getInitialValue()
  }, [])

  return (

    <>
      <section>
        <div className='page-title-block'>
          <div className='page-title-block-content justify-between'>
            <h1>Archives</h1>
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
                    value={
                      searchOptions.find(options =>
                        options.name === watch('searchType')
                      )
                    }
                    name='searchType'

                    defaultValue={(watch('searchType'))}
                    onChange={(selectedOption) => handleTypeChange(selectedOption?.name)}
                  />
                </Grid>

                <form onSubmit={handleSubmit(handleNameSearch)}>
                  <TextField
                    {...register('nameSearch')}
                    style={{ width: 300, marginRight: 10 }}
                    size='small'
                    id="outlined-name"
                    placeholder={`search by ${watch('searchType')?.toLowerCase()}`}
                    InputProps={{
                      endAdornment: (
                        <>
                          <InputAdornment position="end">
                            <Search onClick={handleNameSearch} sx={{ cursor: 'pointer' }} fontSize='small' />
                          </InputAdornment>
                          <InputAdornment onClick={() => handleClearSearch('name')} sx={{ backgroundColor: '#eeeded', height: '100%', cursor: 'pointer', p: 0.5 }} position="end">
                            <Close fontSize='small' />
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                </form>

              </Grid>
            </Grid>
          </div>

          {/* <div className='page-title-block-right'>
            <Button sx={{ textTransform: 'none' }} onClick={handleCreateNew} size='small' variant='outlined'>Add</Button>
          </div> */}
        </div>


        <div className='content-block'>
          <ArchiveTable editId={editId} setEditId={setEditId} refresh={refresh} setRefresh={setRefresh} page={page} setPage={setPage} searchType={watch('searchType')} nameSearch={nameSearch} />
        </div>
      </section>
    </>

  )
}

