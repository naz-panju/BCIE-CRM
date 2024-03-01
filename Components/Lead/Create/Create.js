import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Grid, IconButton } from '@mui/material';
import { useEffect } from 'react';
import { Close, Refresh } from '@mui/icons-material';
import CreateTabs from './Tabmenus';

export default function CreateLead({ open, setOpen, refresh,setRefresh}) {
    const [state, setState] = React.useState({
        right: false,
    });

    const handleClose = () => {
        setOpen(false)
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
            setOpen(false);
        }
    };


    const anchor = 'right'; // Set anchor to 'right'

    useEffect(() => {
        if (open) {

        }
    }, [open])


    return (
        <div>
            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleDrawerClose}
            >
                <Grid width={650}>
                    <Grid p={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <a style={{fontWeight:500,fontSize:'19px'}}>Add Quick Lead</a>
                        <IconButton
                            onClick={() => setOpen(false)}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                    <hr />
                    <CreateTabs setOpen={setOpen} refresh={refresh} setRefresh={setRefresh} />
                </Grid>
            </Drawer>
        </div>
    );
}
