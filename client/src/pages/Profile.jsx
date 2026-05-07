import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-8 sm:p-10 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-4xl text-white font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left pt-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-2 mt-1">
              <Mail className="h-4 w-4" />
              {user?.email}
            </p>
            <div className="mt-4 inline-flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
              <Shield className="h-4 w-4" />
              <span>Active Account</span>
            </div>
          </div>
        </div>
        
        <div className="p-8 sm:p-10 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
              <div className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white">
                {user?.name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
              <div className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white">
                {user?.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
