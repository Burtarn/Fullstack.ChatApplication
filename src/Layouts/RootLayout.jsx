import React from 'react';
import Sidebar from '../components/Sidebar/sideBar';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: '200px', padding: '20px', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
