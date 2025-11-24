import React, { useState, useEffect } from 'react';
import { PlusIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { getAccounts, createAccount } from '../../../services/financeService';
import toast from 'react-hot-toast';

function ChartOfAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newAccount, setNewAccount] = useState({
    code: '', name: '', type: 'Asset', description: ''
  });

  useEffect(() => { loadAccounts(); }, []);

  const loadAccounts = async () => {
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (error) { toast.error("Failed to load accounts"); } 
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAccount(newAccount);
      toast.success("Account created!");
      setShowModal(false);
      setNewAccount({ code: '', name: '', type: 'Asset', description: '' });
      loadAccounts();
    } catch (error) { toast.error("Failed to create account"); }
  };

  const typeColors = {
    'Asset': 'bg-blue-100 text-blue-800',
    'Liability': 'bg-red-100 text-red-800',
    'Equity': 'bg-purple-100 text-purple-800',
    'Income': 'bg-green-100 text-green-800',
    'Expense': 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-second">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TableCellsIcon className="h-7 w-7 text-[#4A90E2]" /> Chart of Accounts
        </h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#4A90E2] text-white px-4 py-2 rounded-lg hover:bg-[#357ABD]">
          <PlusIcon className="h-5 w-5" /> Add Account
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? <tr><td colSpan="3" className="p-4 text-center">Loading...</td></tr> : 
             accounts.map((acc) => (
              <tr key={acc._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm font-bold text-gray-700">{acc.code}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{acc.name}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${typeColors[acc.type]}`}>{acc.type}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Add Ledger Account</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input className="w-full border p-2 rounded" placeholder="Code (e.g. 1200)" value={newAccount.code} onChange={e => setNewAccount({...newAccount, code: e.target.value})} required />
              <input className="w-full border p-2 rounded" placeholder="Name (e.g. Accounts Receivable)" value={newAccount.name} onChange={e => setNewAccount({...newAccount, name: e.target.value})} required />
              <select className="w-full border p-2 rounded" value={newAccount.type} onChange={e => setNewAccount({...newAccount, type: e.target.value})}>
                {Object.keys(typeColors).map(t => <option key={t}>{t}</option>)}
              </select>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1 text-gray-600">Cancel</button>
                <button type="submit" className="px-3 py-1 bg-[#4A90E2] text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default ChartOfAccounts;