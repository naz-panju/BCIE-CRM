import React from 'react';
import SessionLoader from '../../Components/Auth/SessionLoader';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { Grid } from '@mui/material';

const Layout = ({ title, children }) => {
    return (
        <SessionLoader>
            <Grid display={'flex'}>
                <div className='bg-sky-200' >

                    <Sidebar />
                    {/* <Dashboard /> */}

                </div>
                <div style={{width:'100%'}}>
                    <Header />
                    {children}
                    <Footer />
                </div>
            </Grid>
        </SessionLoader>
    );
};

export default Layout;
