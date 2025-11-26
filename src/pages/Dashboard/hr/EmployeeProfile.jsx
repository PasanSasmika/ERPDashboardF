import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  BriefcaseIcon, 
  BuildingLibraryIcon, 
  BanknotesIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  PhoneIcon
} from "@heroicons/react/24/solid";
import { getEmployeeById, processSalary } from '../../../services/financeService';
import toast from 'react-hot-toast';

function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Payroll State
  const [processing, setProcessing] = useState(false);
  const [payrollData, setPayrollData] = useState({
    month: new Date().toLocaleString('default', { month: 'long' }),
    amount: '',
    authorizedBy: 'Admin'
  });

  // Use the environment variable for image URLs
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const data = await getEmployeeById(id);
        if (!data) throw new Error("No data returned");
        
        setEmployee(data);
        
        // Auto-calculate total salary for the input field
        const base = Number(data.salary) || 0;
        const allow = Number(data.allowances) || 0;
        setPayrollData(prev => ({ ...prev, amount: base + allow }));
        
      } catch (error) {
        console.error(error);
        toast.error("Could not load employee details");
      } finally {
        setLoading(false);
      }
    };
    fetchEmp();
  }, [id]);

  const handleProcessSalary = async () => {
    const payAmount = Number(payrollData.amount);
    if(!window.confirm(`Confirm payment of ${payAmount.toLocaleString()} LKR to ${employee.name}?`)) return;

    setProcessing(true);
    try {
      await processSalary({
        employeeId: employee._id,
        month: payrollData.month,
        amount: payAmount,
        authorizedBy: payrollData.authorizedBy
      });
      toast.success("Salary processed & Finance updated!");
      
      // Refresh data to show the new payment in history
      const updatedData = await getEmployeeById(id);
      setEmployee(updatedData);
    } catch (error) {
      console.error(error);
      toast.error("Payroll failed. Check console.");
    } finally {
      setProcessing(false);
    }
  };

  // Loading / Error States
  if (loading) return <div className="p-20 text-center text-gray-500 font-medium">Loading Profile...</div>;
  if (!employee) return <div className="p-20 text-center text-red-500 font-bold">Employee Not Found</div>;

  // Helpers to safely render data
  const safeDate = (date) => date ? new Date(date).toLocaleDateString() : '-';
  
  // Helper to render images/docs correctly
 const getDocUrl = (path) => {
    if (!path) return null;
    
    // 1. Remove any leading slash from the path coming from DB
    // e.g., "/uploads/file.png" -> "uploads/file.png"
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // 2. Ensure backendUrl doesn't end with a slash
    const cleanBase = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

    // 3. Combine them cleanly
    return `${cleanBase}/${cleanPath}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-second">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-6 mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <button onClick={() => navigate('/dashboard/hr/employees')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeftIcon className="h-6 w-6 text-gray-500" />
        </button>
        
        {/* Profile Photo */}
        <div className="h-20 w-20 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-3xl font-bold text-gray-400 shrink-0">
            {employee.documents?.profilePhoto ? (
                <img src={getDocUrl(employee.documents.profilePhoto)} alt="Profile" className="h-full w-full object-cover" />
            ) : (
                (employee.name || 'U').charAt(0).toUpperCase()
            )}
        </div>

        <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="font-medium text-gray-700">{employee.designation}</span>
                <span>•</span>
                <span>{employee.department || 'General Dept'}</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 text-xs font-bold uppercase">
                    {employee.employmentType}
                </span>
            </div>
        </div>
        
        <div className="text-right hidden md:block">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${employee.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {employee.isActive ? 'Active Employee' : 'Inactive'}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN (Details) --- */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Personal Info */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                    <UserIcon className="h-5 w-5 text-[#4A90E2]" /> Personal Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 text-sm">
                    <InfoItem label="Employee ID" value={employee.employeeId} />
                    <InfoItem label="Email" value={employee.email} />
                    <InfoItem label="Phone" value={employee.phone} />
                    <InfoItem label="NIC / Passport" value={employee.nicPassport} />
                    <InfoItem label="Gender" value={employee.gender} />
                    <InfoItem label="Date of Birth" value={safeDate(employee.dob)} />
                    <InfoItem label="Age" value={employee.age} />
                    <InfoItem label="Marital Status" value={employee.maritalStatus} />
                    <div className="col-span-2 md:col-span-3">
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Address</p>
                        <p className="font-medium text-gray-900 mt-1">{employee.address || 'No address provided'}</p>
                    </div>
                </div>
            </div>

            {/* 2. Employment & Emergency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <BriefcaseIcon className="h-4 w-4 text-[#4A90E2]" /> Employment
                    </h3>
                    <div className="space-y-4 text-sm">
                        <InfoItem label="Joining Date" value={safeDate(employee.joiningDate)} />
                        <InfoItem label="Reporting Manager" value={employee.reportingManager} />
                        <InfoItem label="Work Location" value={employee.workLocation} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <PhoneIcon className="h-4 w-4 text-rose-500" /> Emergency Contact
                    </h3>
                    <div className="space-y-4 text-sm">
                        <InfoItem label="Contact Name" value={employee.emergencyContact?.name} />
                        <InfoItem label="Relationship" value={employee.emergencyContact?.relationship} />
                        <InfoItem label="Phone Number" value={employee.emergencyContact?.phone} />
                    </div>
                </div>
            </div>

            {/* 3. Documents & Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <DocumentTextIcon className="h-4 w-4 text-[#4A90E2]" /> Documents
                    </h3>
                    <div className="space-y-2">
                        <DocLink label="CV / Resume" url={getDocUrl(employee.documents?.cv)} />
                        <DocLink label="NIC Scan" url={getDocUrl(employee.documents?.nicScan)} />
                        <DocLink label="Appointment Letter" url={getDocUrl(employee.documents?.appointmentLetter)} />
                        {!employee.documents?.cv && !employee.documents?.nicScan && !employee.documents?.appointmentLetter && (
                            <p className="text-xs text-gray-400 italic">No documents uploaded.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <ShieldCheckIcon className="h-4 w-4 text-[#4A90E2]" /> System Access
                    </h3>
                    <div className="space-y-4 text-sm">
                        <InfoItem label="System Role" value={employee.systemAccess?.role} />
                        <InfoItem label="Corporate Email" value={employee.systemAccess?.emailCreated ? "Created" : "Pending"} />
                        <InfoItem label="Allocated Assets" value={employee.systemAccess?.assets?.[0] || "None"} />
                    </div>
                </div>
            </div>

            {/* 4. Payment History */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BanknotesIcon className="h-5 w-5 text-[#4A90E2]" /> Payroll History
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3">Month</th>
                                <th className="px-4 py-3">Date Processed</th>
                                <th className="px-4 py-3">Authorized By</th>
                                <th className="px-4 py-3 text-right">Amount (LKR)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(!employee.salaryHistory || employee.salaryHistory.length === 0) ? (
                                <tr><td colSpan="4" className="px-4 py-6 text-center text-gray-400 italic">No payment history records found.</td></tr>
                            ) : (
                                employee.salaryHistory.slice().reverse().map((rec, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{rec.month}</td>
                                        <td className="px-4 py-3 text-gray-500">{safeDate(rec.processedDate)}</td>
                                        <td className="px-4 py-3 text-gray-500">{rec.authorizedBy}</td>
                                        <td className="px-4 py-3 text-right font-bold text-emerald-600">{Number(rec.amount).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* --- RIGHT COLUMN (Actions) --- */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Payroll Processing Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg sticky top-6">
                <div className="bg-gradient-to-r from-[#4A90E2] to-[#357ABD] -m-6 mb-6 p-6 rounded-t-xl text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-blue-100 text-xs uppercase font-bold tracking-wider mb-1">Monthly Salary</p>
                        <h2 className="text-3xl font-bold">
                            {((Number(employee.salary) || 0) + (Number(employee.allowances) || 0)).toLocaleString()} 
                            <span className="text-lg font-normal opacity-80 ml-1">LKR</span>
                        </h2>
                    </div>
                    <BanknotesIcon className="absolute right-4 bottom-4 h-16 w-16 text-white opacity-10 -rotate-12" />
                </div>

                <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 border-b pb-2 text-sm uppercase">Process Payment</h4>
                    
                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1">Select Month</label>
                        <select 
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 focus:bg-white focus:border-[#4A90E2] outline-none"
                            value={payrollData.month}
                            onChange={e => setPayrollData({...payrollData, month: e.target.value})}
                        >
                            {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                                <option key={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1">Amount (LKR)</label>
                        <input 
                            type="number" 
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm font-mono"
                            value={payrollData.amount}
                            onChange={e => setPayrollData({...payrollData, amount: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1">Authorized By</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            value={payrollData.authorizedBy}
                            onChange={e => setPayrollData({...payrollData, authorizedBy: e.target.value})}
                        />
                    </div>

                    <button 
                        onClick={handleProcessSalary} 
                        disabled={processing} 
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {processing ? 'Processing...' : 'Confirm Payment'}
                    </button>
                    
                    <p className="text-[10px] text-gray-400 text-center leading-tight">
                        Clicking confirm will record an "Outgoing" transaction in the central Finance module.
                    </p>
                </div>
            </div>

            {/* Bank Info Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <BuildingLibraryIcon className="h-4 w-4 text-[#4A90E2]" /> Bank Account
                </h3>
                <div className="space-y-4 text-sm">
                    <InfoItem label="Bank Name" value={employee.bankDetails?.bankName} />
                    <InfoItem label="Branch" value={employee.bankDetails?.branch} />
                    <InfoItem label="Account Holder" value={employee.bankDetails?.accountName} />
                    <div className="pt-3 border-t border-gray-100">
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">Account Number</p>
                        <p className="font-mono font-bold text-gray-800 text-lg tracking-wide">{employee.bankDetails?.accountNumber || 'Not Provided'}</p>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">{label}</p>
        <p className="font-medium text-gray-900 mt-0.5 break-words">{value || '-'}</p>
    </div>
);

const DocLink = ({ label, url }) => {
    if (!url) return null;
    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-all group"
        >
            <div className="flex items-center gap-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 group-hover:text-[#4A90E2]" />
                <span className="text-sm text-gray-700 group-hover:text-[#4A90E2] font-medium">{label}</span>
            </div>
            <ArrowLeftIcon className="h-4 w-4 text-gray-300 group-hover:text-[#4A90E2] rotate-180" />
        </a>
    );
};

export default EmployeeProfile;