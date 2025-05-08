import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { SearchBar } from '../shared/SearchBar';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-16">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button 
            className="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">KL - Software</span>
          </Link>
        </div>
        
        <div className="hidden md:block w-2/5">
          <SearchBar />
        </div>
      </div>
      <div className="md:hidden px-4 py-2 pb-3 border-t border-gray-200">
        <SearchBar />
      </div>
      
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 absolute w-full">
          <nav className="px-2 pt-2 pb-4">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/?category=all" 
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Alle Apps
            </Link>
            <Link 
              to="/?category=installed" 
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Installiert
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}