import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Shield, Wallet } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 text-primary dark:text-primary-dark">
          <Wallet className="h-8 w-8" />
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">ExpenseTrack</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium">Log in</Link>
          <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium transition-colors">Sign up</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
          Master Your Money <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Shape Your Future
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-12">
          Track expenses, analyze spending habits, and take control of your financial life with our beautifully designed analytics dashboard.
        </p>
        
        <Link to="/register" className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-lg font-semibold transition-transform hover:scale-105">
          <span>Get Started for Free</span>
          <ArrowRight className="h-5 w-5" />
        </Link>

        <div className="grid md:grid-cols-3 gap-12 mt-32 text-left">
          <FeatureCard 
            icon={<Wallet className="h-6 w-6 text-primary" />}
            title="Smart Tracking"
            desc="Easily log your daily expenses and income streams with intuitive categories."
          />
          <FeatureCard 
            icon={<BarChart3 className="h-6 w-6 text-secondary" />}
            title="Deep Analytics"
            desc="Visualize your financial trends with interactive, beautiful charts."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-warning" />}
            title="Secure & Private"
            desc="Your financial data is encrypted and stored securely on cloud servers."
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
    <div className="h-12 w-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
