import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Store, BookOpen } from 'lucide-react';

export function AdminSidebar() {
  const location = useLocation();
  const { pathname } = location;

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <aside className="hidden lg:block w-64 bg-gray-900 text-white sticky top-16 h-[calc(100vh-64px)]">
      <nav className="p-4">
        <div className="mb-8">
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200 ${
              isActive('/admin/dashboard') ? 'bg-gray-800 text-white' : ''
            }`}
          >
            <LayoutDashboard size={20} className="mr-3" />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/admin/software/new" 
            className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200 ${
              isActive('/admin/software/new') ? 'bg-gray-800 text-white' : ''
            }`}
          >
            <PlusCircle size={20} className="mr-3" />
            <span>Add Software</span>
          </Link>

          <Link 
            to="/admin/tutorials/new" 
            className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200 ${
              isActive('/admin/tutorials/new') ? 'bg-gray-800 text-white' : ''
            }`}
          >
            <BookOpen size={20} className="mr-3" />
            <span>Add Tutorial</span>
          </Link>

          <Link 
            to="/" 
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Store size={20} className="mr-3" />
            <span>View Store</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}