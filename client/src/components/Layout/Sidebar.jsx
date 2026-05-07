import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  FileText, 
  Settings, 
  X,
  CreditCard
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: Wallet },
    { name: 'Analytics', href: '/analytics', icon: PieChart },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Profile', href: '/profile', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar component */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2 text-primary dark:text-primary-dark">
            <CreditCard className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ExpenseTrack</span>
          </div>
          <button 
            className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark' 
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50'
                  }
                `}
              >
                <Icon className={`mr-3 h-5 w-5 flex-shrink-0`} aria-hidden="true" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
