import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Grid, IconButton } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import WhatsAppTemplateDetailTabs from './TabMenus';



export default function WhatsAppTemplateDetailModal({ id, setId }) {
    const [state, setState] = React.useState({
        right: false,
    });
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const anchor = 'right'; // Set anchor to 'right'


    const handleClose = () => {
        setOpen(false)
        setId()
    }

    const handleDrawerClose = (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        // Check if the close icon was clicked
        if (event.target.tagName === 'svg') {
            handleClose();
        }
    };


    useEffect(() => {
        if (id > 0) {
            setOpen(true)
        }
    }, [id])


    return (
        <div>
            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleDrawerClose}
            >
                <Grid width={650}>
                    
                    <Grid>
                        <WhatsAppTemplateDetailTabs id={id} setId={setId} close={handleClose} />
                    </Grid>

                </Grid>
            </Drawer>
        </div>
    );
}