import React, { useState, useEffect } from 'react';
import { PlusIcon, ReceiptPercentIcon } from "@heroicons/react/24/solid";
import { getExpenses, createExpense, getAccounts } from '../../../services/financeService';
import toast from 'react-hot-toast';

function ExpenseManagement() {
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]); // For dropdown
  const [showModal, setShowModal] = useState(false);
  
  const [newExpense, setNewExpense] = useState({
    description: '', vendor: '', amount: 0, taxAmount: 0,
    expenseAccount: '', paymentAccount: '' 
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [expData, accData] = await Promise.all([getExpenses(), getAccounts()]);
    setExpenses(expData);
    setAccounts(accData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const total = Number(newExpense.amount) + Number(newExpense.taxAmount);
      await createExpense({ ...newExpense, totalAmount: total });
      toast.success("Expense recorded & GL updated!");
      setShowModal(false);
      loadData();
    } catch (err) { toast.error("Failed to record expense"); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-second">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ReceiptPercentIcon className="h-7 w-7 text-[#4A90E2]" /> Expense Tracker
        </h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#4A90E2] text-white px-4 py-2 rounded-lg hover:bg-[#357ABD]">
          <PlusIcon className="h-5 w-5" /> Record Expense
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((exp) => (
              <tr key={exp._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{exp.vendor}<br/><span className="text-xs text-gray-400">{exp.description}</span></td>
                <td className="px-6 py-4 text-sm text-gray-500">{exp.expenseAccount?.name}</td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">{exp.totalAmount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Record Business Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input className="border p-2 rounded" placeholder="Vendor (e.g. AWS)" onChange={e => setNewExpense({...newExpense, vendor: e.target.value})} required />
                <input className="border p-2 rounded" placeholder="Description" onChange={e => setNewExpense({...newExpense, description: e.target.value})} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Expense Category</label>
                  <select className="w-full border p-2 rounded" onChange={e => setNewExpense({...newExpense, expenseAccount: e.target.value})} required>
                    <option value="">Select Account...</option>
                    {accounts.filter(a => a.type === 'Expense').map(a => <option key={a._id} value={a._id}>{a.code} - {a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Paid From</label>
                  <select className="w-full border p-2 rounded" onChange={e => setNewExpense({...newExpense, paymentAccount: e.target.value})} required>
                    <option value="">Select Account...</option>
                    {accounts.filter(a => a.type === 'Asset').map(a => <option key={a._id} value={a._id}>{a.code} - {a.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="number" className="border p-2 rounded" placeholder="Amount" onChange={e => setNewExpense({...newExpense, amount: e.target.value})} required />
                <input type="number" className="border p-2 rounded" placeholder="Tax (if any)" onChange={e => setNewExpense({...newExpense, taxAmount: e.target.value})} />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#4A90E2] text-white rounded">Post to GL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default ExpenseManagement;