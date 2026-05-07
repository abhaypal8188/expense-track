import React, { useContext } from 'react';
import { Menu, Sun, Moon, Bell, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setSidebarOpen, darkMode, setDarkMode }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 transition-colors duration-200">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 mr-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 lg:hidden focus:outline-none rounded-md"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden lg:block text-xl font-bold text-slate-800 dark:text-white">
          Overview
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400 rounded-full transition-colors"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400 rounded-full transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger"></span>
        </button>

        <div className="relative group">
          <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 hidden group-hover:block transition-all">
            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Profile Settings
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
