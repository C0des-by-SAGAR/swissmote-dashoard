import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-dark-blue">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-dark-blue text-white">
          <main className="container mx-auto px-6 py-8">
            <div className="relative">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
