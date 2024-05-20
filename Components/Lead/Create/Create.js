import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Grid, IconButton } from '@mui/material';
import { useEffect } from 'react';
import { Close, Refresh } from '@mui/icons-material';
import CreateTabs from './Tabmenus';
import { useState } from 'react';

export default function CreateLead({ editId, setEditId, refresh, setRefresh, handleRefresh, from }) {
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
                    <Grid className='modal_title d-flex align-items-center justify-content-between '>
                        <div className='d-flex align-items-center'>
                            <a className='back_modal' onClick={handleClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                    <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>

                            {
                                from == 'app' ?
                                    <a className='back_modal_head'>  Submit Applicant Data</a>
                                    : <a className='back_modal_head'> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 11H8M5.5 13.5V8.5M14.5 14C18.2966 14 20.2305 15.3374 20.8093 18.0121C21.0429 19.0917 20.1046 20 19 20H10C8.89543 20 7.95709 19.0917 8.19071 18.0121C8.76953 15.3374 10.7034 14 14.5 14ZM14.5 10C16.1667 10 17 9.14286 17 7C17 4.85714 16.1667 4 14.5 4C12.8333 4 12 4.85714 12 7C12 9.14286 12.8333 10 14.5 10Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg> {editId > 0 ? `Edit Lead ` : `Add Quick Lead`}</a>

                            }
                      
                        </div>

                        <p>Fill below fileds with students detail.</p>

                    </Grid>
                    <hr />
                    <CreateTabs handleClose={handleClose} editId={editId} refresh={refresh} setRefresh={setRefresh} handleRefresh={handleRefresh} from={from} />
                </Grid>
            </Drawer>
        </div>
    );
}
