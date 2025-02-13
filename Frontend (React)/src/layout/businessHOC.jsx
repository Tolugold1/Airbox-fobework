import React from 'react';
import { Outlet } from 'react-router-dom';
import BusinessSideBar from '../pages/businessSideBar';

const BusinessHOC = () => {
  return (
    <div className='flex flex-row min-h-screen w-full'>
        <BusinessSideBar />
        <Outlet />
    </div>
  )
}

export default BusinessHOC;