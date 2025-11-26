import React, { useState, useEffect } from 'react';
import { 
  BanknotesIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  PlusIcon,
  FunnelIcon 
} from "@heroicons/react/24/solid";
import { addFinanceRecord, getFinanceReport } from '../../../services/financeService';
import toast from 'react-hot-toast';

function FinanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState({ summary: {}, records: [] });
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().substring(0, 10),
    description: '',
    amount: '',
    type: 'Incoming', 
    category: 'General'
  });

  useEffect(() => {
    loadData();
  }, [month, year]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getFinanceReport(month, year);
      setReport(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addFinanceRecord(newRecord);
      toast.success("Transaction added successfully!");
      setShowModal(false);
      setNewRecord({ ...newRecord, description: '', amount: '' }); // Reset fields
      loadData(); // Refresh dashboard
    } catch (error) {
      toast.error("Failed to add transaction");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-second">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BanknotesIcon className="h-7 w-7 text-[#4A90E2]" /> Financial Overview
          </h1>
          <p className="text-sm text-gray-500">Cash flow statement for {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Filter */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <FunnelIcon className="h-4 w-4 text-gray-400 ml-2" />
            <select className="text-sm border-none focus:ring-0 text-gray-600 bg-transparent" value={month} onChange={(e) => setMonth(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
              ))}
            </select>
            <input 
              type="number" 
              className="text-sm border-none focus:ring-0 text-gray-600 bg-transparent w-16" 
              value={year} 
              onChange={(e) => setYear(e.target.value)} 
            />
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#4A90E2] hover:bg-[#357ABD] text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <PlusIcon className="h-5 w-5" /> Add Transaction
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Incoming</p>
              <h3 className="text-2xl font-bold text-emerald-600">
                + {(report.summary.totalIncoming || 0).toLocaleString()}
              </h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Outgoing</p>
              <h3 className="text-2xl font-bold text-red-600">
                - {(report.summary.totalOutgoing || 0).toLocaleString()}
              </h3>
            </div>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <ArrowTrendingDownIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Net Profit</p>
              <h3 className={`text-2xl font-bold ${(report.summary.profit || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {(report.summary.profit || 0).toLocaleString()}
              </h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <BanknotesIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-800">Transaction History</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading transactions...</td></tr>
            ) : report.records.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No transactions found for this month.</td></tr>
            ) : (
              report.records.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {record.description}
                    {record.authorizedBy && <span className="block text-xs text-gray-400 font-normal">Auth by: {record.authorizedBy}</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{record.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.type === 'Incoming' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {record.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${
                    record.type === 'Incoming' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {record.type === 'Incoming' ? '+' : '-'} {record.amount.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Record Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">New Transaction</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Transaction Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setNewRecord({...newRecord, type: 'Incoming'})}
                    className={`py-2 rounded-lg text-sm font-medium border ${newRecord.type === 'Incoming' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Incoming (Income)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewRecord({...newRecord, type: 'Outgoing'})}
                    className={`py-2 rounded-lg text-sm font-medium border ${newRecord.type === 'Outgoing' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Outgoing (Expense)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Client Payment / Server Bill"
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    value={newRecord.amount}
                    onChange={(e) => setNewRecord({...newRecord, amount: e.target.value})}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Utilities"
                    value={newRecord.category}
                    onChange={(e) => setNewRecord({...newRecord, category: e.target.value})}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4A90E2] text-white rounded-lg text-sm font-medium hover:bg-[#357ABD] shadow-sm"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default FinanceDashboard;