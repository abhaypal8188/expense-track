import React, { useState } from 'react';
import api from '../api';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    setLoading(true);
    try {
      // Fetch all transactions for the report
      const res = await api.get('/api/transactions?limit=1000');
      const transactions = res.data.transactions;

      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('Financial Report', 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      // Table Data
      const tableColumn = ["Date", "Description", "Category", "Type", "Amount"];
      const tableRows = [];

      let totalIncome = 0;
      let totalExpense = 0;

      transactions.forEach(tx => {
        if (tx.type === 'income') totalIncome += tx.amount;
        if (tx.type === 'expense') totalExpense += tx.amount;

        const transactionData = [
          new Date(tx.date).toLocaleDateString(),
          tx.notes || '-',
          tx.category?.name || '-',
          tx.type,
          `$${tx.amount.toFixed(2)}`
        ];
        tableRows.push(transactionData);
      });

      // Summary
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 14, 45);
      doc.text(`Total Expense: $${totalExpense.toFixed(2)}`, 14, 52);
      doc.text(`Net Balance: $${(totalIncome - totalExpense).toFixed(2)}`, 14, 59);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] } // Primary color
      });

      doc.save('expense_report.pdf');
      toast.success('Report generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Export your financial data</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <FileText className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Comprehensive Financial Report</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
          Download a complete PDF report of all your transactions, including a summary of your total income, expenses, and net balance.
        </p>
        
        <button
          onClick={generatePDF}
          disabled={loading}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
        >
          <Download className="h-5 w-5" />
          <span>{loading ? 'Generating...' : 'Download PDF Report'}</span>
        </button>
      </div>
    </div>
  );
};

export default Reports;
