import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Grid, IconButton } from '@mui/material';
import { useEffect } from 'react';
import { Close, Refresh } from '@mui/icons-material';
import CreateTabs from './Tabmenus';
import { useState } from 'react';

export default function CreateLead({ editId, setEditId, refresh, setRefresh,handleRefresh }) {
    const [state, setState] = React.useState({
        right: false,
    });

    const [open, setOpen] = useState(false)

    const handleDrawerClose = (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        // Check if the close icon was clicked
        if (event.target.tagName === 'svg') {
            setOpen(false);
            setEditId()
        }
    };

    const handleClose = () => {
        setEditId()
        setOpen(false)
    }


    const anchor = 'right'; // Set anchor to 'right'

    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
        }
        if (editId == 0) {
            setOpen(true)
        }
    }, [editId])


    return (
        <div>
            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleDrawerClose}
            >
                <Grid width={650}>
                    <Grid className='modal_title'>
                        <a className='back_modal'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                        <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        </a>
                    

                        <a>{editId > 0 ? `Edit Lead ` : `Add Quick Lead`}</a>
                        <IconButton
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                    <hr />
                    <CreateTabs handleClose={handleClose} editId={editId} refresh={refresh} setRefresh={setRefresh} handleRefresh={handleRefresh} />
                </Grid>
            </Drawer>
        </div>
    );
}
