import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ amount: '', type: 'expense', category: '', date: '', notes: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [page, filterType]);

  const fetchTransactions = async () => {
    try {
      const res = await api.get(`/api/transactions?page=${page}&type=${filterType}`);
      setTransactions(res.data.transactions);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data);
      if (res.data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: res.data[0]._id }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/transactions/${editingId}`, formData);
        toast.success('Transaction updated');
      } else {
        await api.post('/api/transactions', formData);
        toast.success('Transaction added');
      }
      setIsModalOpen(false);
      fetchTransactions();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/api/transactions/${id}`);
        toast.success('Transaction deleted');
        fetchTransactions();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const openEditModal = (tx) => {
    setEditingId(tx._id);
    setFormData({
      amount: tx.amount,
      type: tx.type,
      category: tx.category._id,
      date: new Date(tx.date).toISOString().split('T')[0],
      notes: tx.notes || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ amount: '', type: 'expense', category: categories.length > 0 ? categories[0]._id : '', date: '', notes: '' });
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium text-right">Amount</th>
                <th className="pb-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-4 text-slate-600 dark:text-slate-300">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="py-4 text-slate-900 dark:text-white font-medium">{tx.notes || '-'}</td>
                  <td className="py-4 text-slate-600 dark:text-slate-300">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {tx.category?.name}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tx.type === 'income' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`py-4 text-right font-medium ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button onClick={() => openEditModal(tx)} className="p-1 text-slate-400 hover:text-primary transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(tx._id)} className="p-1 text-slate-400 hover:text-danger transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && transactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm disabled:opacity-50 text-slate-700 dark:text-slate-300"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm disabled:opacity-50 text-slate-700 dark:text-slate-300"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {editingId ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <select 
                    value={formData.type} 
                    onChange={(e) => setFormData({...formData, type: e.target.value, category: categories.find(c => c.type === e.target.value)?._id || ''})}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount ($)</label>
                  <input 
                    type="number" step="0.01" min="0.01" required
                    value={formData.amount} 
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select 
                  required
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                >
                  <option value="" disabled>Select category</option>
                  {filteredCategories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input 
                  type="date" required
                  value={formData.date} 
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                <input 
                  type="text" 
                  value={formData.notes} 
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                  placeholder="Dinner at restaurant..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
