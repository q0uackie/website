import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminHeader() {
  const { signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-blue-800 text-white border-b border-blue-700 sticky top-0 z-50 h-16">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button 
            className="lg:hidden mr-4 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
          <Link to="/admin/dashboard" className="flex items-center">
            <span className="text-xl font-bold">Admin Dashboard</span>
          </Link>
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={() => signOut()}
            className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-blue-700"
          >
            <LogOut size={18} />
            <span>Abmelden</span>
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="lg:hidden bg-blue-800 border-b border-blue-700 absolute w-full">
          <nav className="px-2 pt-2 pb-4">
            <Link 
              to="/admin/dashboard" 
              className="block px-3 py-2 rounded-md text-white hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/software/new" 
              className="block px-3 py-2 rounded-md text-white hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Software hinzufügen
            </Link>
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-white hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Zum Software Store
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}