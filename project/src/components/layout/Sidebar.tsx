import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Apple as Apps, Book } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const { pathname } = location;

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path === '/tutorials' && pathname.startsWith('/tutorials')) return true;
    return false;
  };

  return (
    <aside className="hidden lg:block w-64 bg-sidebar border-r border-gray-200 sticky top-16 h-[calc(100vh-64px)]">
      <nav className="p-4">
        <div className="mb-8">
          <Link 
            to="/" 
            className={`sidebar-link ${isActive('/') ? 'active' : ''}`}
          >
            <Home size={20} className="mr-3" />
            <span>Home</span>
          </Link>

          <Link 
            to="/apps" 
            className={`sidebar-link ${pathname === '/apps' ? 'active' : ''}`}
          >
            <Apps size={20} className="mr-3" />
            <span>Apps</span>
          </Link>
          
          <Link 
            to="/tutorials" 
            className={`sidebar-link ${isActive('/tutorials') ? 'active' : ''}`}
          >
            <Book size={20} className="mr-3" />
            <span>Tutorials</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}