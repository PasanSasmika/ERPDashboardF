import React, { useState } from 'react';
import { BanknotesIcon, PlayIcon } from "@heroicons/react/24/solid";
import { runPayroll } from '../../../services/financeService';
import toast from 'react-hot-toast';

function PayrollRun() {
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [year, setYear] = useState(new Date().getFullYear());

  const handleRunPayroll = async () => {
    if (!window.confirm(`Are you sure you want to process payroll for ${month} ${year}? This will post expenses to the General Ledger.`)) return;
    
    setLoading(true);
    try {
      await runPayroll(month, year);
      toast.success(`Payroll for ${month} ${year} processed successfully!`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Payroll failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-second">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BanknotesIcon className="h-7 w-7 text-[#4A90E2]" /> HR & Payroll
        </h1>
        <p className="text-sm text-gray-500">Process salaries and generate GL entries</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="h-20 w-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <BanknotesIcon className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Run Monthly Payroll</h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          This action will calculate salaries for all active employees, deduct taxes (8%), and post the records to the General Ledger automatically.
        </p>

        <div className="flex justify-center gap-4 mb-6">
          <select className="border p-2 rounded-lg" value={month} onChange={e => setMonth(e.target.value)}>
            {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m}>{m}</option>)}
          </select>
          <input type="number" className="border p-2 rounded-lg w-24" value={year} onChange={e => setYear(e.target.value)} />
        </div>

        <button 
          onClick={handleRunPayroll} 
          disabled={loading}
          className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span>Processing...</span>
          ) : (
            <>
              <PlayIcon className="h-5 w-5 mr-2" /> Process Payroll
            </>
          )}
        </button>
      </div>
    </div>
  );
}
export default PayrollRun;