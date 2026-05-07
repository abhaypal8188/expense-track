import React, { useState, useEffect } from 'react';
import api from '../api';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];

const Dashboard = () => {
  const [summary, setSummary] = useState({
    balance: 0,
    totalIncome: 0,
    totalExpense: 0,
    recentTransactions: []
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, monthlyRes, categoryRes] = await Promise.all([
          api.get('/api/analytics/summary'),
          api.get('/api/analytics/monthly'),
          api.get('/api/analytics/category-expenses')
        ]);
        
        setSummary(summaryRes.data);
        setMonthlyData(monthlyRes.data);
        setCategoryData(categoryRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20 text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Balance" 
          amount={summary.balance} 
          icon={<Wallet className="h-6 w-6 text-primary" />} 
          trend="up" 
        />
        <StatCard 
          title="Total Income" 
          amount={summary.totalIncome} 
          icon={<ArrowUpRight className="h-6 w-6 text-success" />} 
          trend="up" 
        />
        <StatCard 
          title="Total Expense" 
          amount={summary.totalExpense} 
          icon={<ArrowDownRight className="h-6 w-6 text-danger" />} 
          trend="down" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Income vs Expense</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Expenses by Category</h3>
          <div className="h-72">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentTransactions.map((tx) => (
                <tr key={tx._id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                  <td className="py-4 text-slate-900 dark:text-white font-medium">{tx.notes || tx.category?.name}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{tx.category?.name}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className={`py-4 text-right font-medium ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {summary.recentTransactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">No recent transactions</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, amount, icon, trend }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center">
    <div className="h-14 w-14 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
        ${amount.toFixed(2)}
      </h4>
    </div>
  </div>
);

export default Dashboard;
