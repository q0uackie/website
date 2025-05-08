import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const location = useLocation();
  const isTutorialsPage = location.pathname.startsWith('/tutorials');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className={`flex-1 ${isTutorialsPage ? '' : 'p-6'} bg-gray-100 overflow-auto h-[calc(100vh-64px)]`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}