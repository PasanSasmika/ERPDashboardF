import React, { useState, useEffect } from 'react';
import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import { getTrialBalance } from '../../../services/financeService';

function TrialBalance() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getTrialBalance();
        setReport(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchReport();
  }, []);

  const totalDebit = report.reduce((sum, row) => sum + (row.totalDebit || 0), 0);
  const totalCredit = report.reduce((sum, row) => sum + (row.totalCredit || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto font-second">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardDocumentListIcon className="h-7 w-7 text-[#4A90E2]" /> Trial Balance
        </h1>
        <p className="text-sm text-gray-500">Real-time financial standing</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Account</th>
              <th className="px-6 py-3 text-right">Debit</th>
              <th className="px-6 py-3 text-right">Credit</th>
              <th className="px-6 py-3 text-right">Net Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {report.map((row) => (
              <tr key={row._id}>
                <td className="px-6 py-3">
                  <span className="font-mono font-bold text-gray-600 mr-2">{row.code}</span>
                  {row.accountName}
                </td>
                <td className="px-6 py-3 text-right text-gray-600">{row.totalDebit > 0 ? row.totalDebit.toLocaleString() : '-'}</td>
                <td className="px-6 py-3 text-right text-gray-600">{row.totalCredit > 0 ? row.totalCredit.toLocaleString() : '-'}</td>
                <td className={`px-6 py-3 text-right font-bold ${row.netBalance < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                  {row.netBalance.toLocaleString()}
                </td>
              </tr>
            ))}
            
            <tr className="bg-gray-100 font-bold">
              <td className="px-6 py-3">TOTALS</td>
              <td className="px-6 py-3 text-right text-blue-600">{totalDebit.toLocaleString()}</td>
              <td className="px-6 py-3 text-right text-blue-600">{totalCredit.toLocaleString()}</td>
              <td className="px-6 py-3 text-right">{(totalDebit - totalCredit).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default TrialBalance;