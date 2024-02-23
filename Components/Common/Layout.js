import React from 'react';
import SessionLoader from '../Auth/SessionLoader';
import Header from './Header';
import Footer from './Footer';
import Dashboard from '../Dashboard/dashboard';

const Layout = ({ title, children }) => {
    return (
        <SessionLoader>
            <div>
                <div className="">
                    {/* <Header /> */}
                    <Dashboard />
                    {children}
                    <Footer />
                </div>
            </div>
        </SessionLoader>
    );
};

export default Layout;
