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
                    <Grid p={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>{editId > 0 ? `Edit Lead ` : `Add Quick Lead`}</a>
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
