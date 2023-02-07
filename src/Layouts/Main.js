import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation/Navigation';

const Main = () => {
    return (
        <>
            <Navigation/>
            <Outlet/> 
        </>
    );
};

export default Main;