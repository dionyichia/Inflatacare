import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-100 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Inflatacare</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`text-lg font-medium ${location.pathname === '/' ? 'text-blue-900 border-b-2 border-blue-700' : 'text-blue-700 hover:text-blue-900'}`}
            >
              Home
            </Link>
            <Link 
              to="/control" 
              className={`text-lg font-medium ${location.pathname === '/control' ? 'text-blue-900 border-b-2 border-blue-700' : 'text-blue-700 hover:text-blue-900'}`}
            >
              Control Panel
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-blue-800"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-blue-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`text-lg font-medium py-2 ${location.pathname === '/' ? 'text-blue-900 bg-blue-50 rounded-lg px-3' : 'text-blue-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/control" 
                className={`text-lg font-medium py-2 ${location.pathname === '/control' ? 'text-blue-900 bg-blue-50 rounded-lg px-3' : 'text-blue-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Control Panel
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;