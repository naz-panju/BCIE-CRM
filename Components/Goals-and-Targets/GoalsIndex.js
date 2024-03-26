import React, { useState } from 'react'
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import GoalsTable from './GoalsTable';


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

export default function GoalsIndex() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [createModal, setCreateModal] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const [editId, setEditId] = useState()
    const [page, setPage] = useState(0)

    const handleCreate = () => {
        setEditId(0)
    }

    const handleRefresh = () => {
        if (page != 0) {
            setPage(0)
        }
        setRefresh(!refresh)
    }

    const archiveRefresh = () => {
        setRefresh(!refresh)
    }


    // console.log(refresh);

    return (

        <>

            <section>
                <div className='page-title-block'>
                    <div className='page-title-block-content'>
                        <h1>My Goals</h1>
                    </div>
                </div>

                <div className='content-block'>
                    <GoalsTable />
                </div>
            </section>
        </>

    )
}

