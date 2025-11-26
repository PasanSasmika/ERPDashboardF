import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  BriefcaseIcon, 
  BuildingLibraryIcon, 
  DocumentTextIcon, 
  ComputerDesktopIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/solid";
import { createEmployee } from '../../../services/financeService';
import toast from 'react-hot-toast';

function AddEmployee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State matching your Backend Schema
  const [formData, setFormData] = useState({
    // Personal
    name: '', age: '', gender: 'Male', dob: '', nicPassport: '',
    address: '', phone: '', email: '', maritalStatus: 'Single',
    
    // Emergency Contact (Nested)
    emergencyName: '', emergencyRelationship: '', emergencyPhone: '',

    // Employment
    employeeId: '', department: '', designation: '', employmentType: 'Full-time',
    joiningDate: '', reportingManager: '', workLocation: '',
    salary: '', allowances: 0,

    // Bank
    bankName: '', branch: '', accountName: '', accountNumber: '',

    // System Access
    emailCreated: false, role: 'User', assetAllocation: ''
  });

  // Separate state for files
  const [files, setFiles] = useState({
    profilePhoto: null,
    nicScan: null,
    cv: null,
    appointmentLetter: null
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // 1. Construct the Nested Object cleanly
      const payload = {
        // Personal
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        dob: formData.dob,
        nicPassport: formData.nicPassport,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        maritalStatus: formData.maritalStatus,
        
        // Nested Objects
        emergencyContact: {
            name: formData.emergencyName,
            relationship: formData.emergencyRelationship,
            phone: formData.emergencyPhone
        },
        bankDetails: {
            bankName: formData.bankName,
            branch: formData.branch,
            accountName: formData.accountName,
            accountNumber: formData.accountNumber
        },
        systemAccess: {
            emailCreated: formData.emailCreated,
            role: formData.role,
            assets: [formData.assetAllocation]
        },
        
        // Employment
        employeeId: formData.employeeId,
        department: formData.department,
        designation: formData.designation,
        employmentType: formData.employmentType,
        joiningDate: formData.joiningDate,
        reportingManager: formData.reportingManager,
        workLocation: formData.workLocation,
        salary: formData.salary,
        allowances: formData.allowances
      };

      // 2. Append the JSON String (The Foolproof Fix)
      data.append('employeeData', JSON.stringify(payload));

      // 3. Append Files (Keep exact names matching backend config)
      if(files.profilePhoto) data.append('profilePhoto', files.profilePhoto);
      if(files.nicScan) data.append('nicScan', files.nicScan);
      if(files.cv) data.append('cv', files.cv);
      if(files.appointmentLetter) data.append('appointmentLetter', files.appointmentLetter);

      // 4. Send
      await createEmployee(data);
      
      toast.success("Employee onboarded successfully!");
      navigate('/dashboard/hr/employees');

    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Error adding employee";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 max-w-5xl mx-auto font-second">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Onboard New Employee</h1>
            <p className="text-sm text-gray-500">Enter details to create a personnel & payroll record.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Personal Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-[#4A90E2]" /> Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input name="name" placeholder="Full Name *" className="input-field md:col-span-2" onChange={handleChange} required />
                <input name="nicPassport" placeholder="NIC / Passport *" className="input-field" onChange={handleChange} required />
                
                <input name="dob" type="date" className="input-field" title="Date of Birth" onChange={handleChange} />
                <input name="age" type="number" placeholder="Age" className="input-field" onChange={handleChange} />
                <select name="gender" className="input-field" onChange={handleChange}>
                    <option>Male</option>
                    <option>Female</option>
                </select>

                <input name="email" type="email" placeholder="Personal Email *" className="input-field" onChange={handleChange} required />
                <input name="phone" placeholder="Phone Number" className="input-field" onChange={handleChange} />
                <select name="maritalStatus" className="input-field" onChange={handleChange}>
                    <option>Single</option>
                    <option>Married</option>
                </select>
                
                <textarea name="address" placeholder="Residential Address" className="input-field md:col-span-3" rows="2" onChange={handleChange}></textarea>
            </div>

            {/* Emergency Contact Subset */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                <p className="md:col-span-3 text-xs font-bold text-gray-400 uppercase">Emergency Contact</p>
                <input name="emergencyName" placeholder="Contact Name" className="input-field" onChange={handleChange} />
                <input name="emergencyRelationship" placeholder="Relationship" className="input-field" onChange={handleChange} />
                <input name="emergencyPhone" placeholder="Emergency Phone" className="input-field" onChange={handleChange} />
            </div>
        </div>

        {/* 2. Employment Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5 text-[#4A90E2]" /> Employment & Financials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input name="employeeId" placeholder="Employee ID (Unique) *" className="input-field" onChange={handleChange} required />
                <input name="designation" placeholder="Designation / Job Title *" className="input-field" onChange={handleChange} required />
                <input name="department" placeholder="Department" className="input-field" onChange={handleChange} />

                <select name="employmentType" className="input-field" onChange={handleChange}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Intern</option>
                </select>
                <div className="input-group">
                    <label className="text-xs text-gray-500">Joining Date</label>
                    <input name="joiningDate" type="date" className="input-field" onChange={handleChange} />
                </div>
                <input name="workLocation" placeholder="Work Location" className="input-field" onChange={handleChange} />
                
                <div className="md:col-span-3 border-t border-gray-100 my-2"></div>

                <div className="input-group">
                    <label className="text-xs font-bold text-emerald-600">Basic Salary *</label>
                    <input name="salary" type="number" placeholder="0.00" className="input-field border-emerald-200 focus:border-emerald-500" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label className="text-xs font-bold text-emerald-600">Fixed Allowances</label>
                    <input name="allowances" type="number" placeholder="0.00" className="input-field border-emerald-200 focus:border-emerald-500" onChange={handleChange} />
                </div>
                <input name="reportingManager" placeholder="Reporting Manager" className="input-field mt-auto" onChange={handleChange} />
            </div>
        </div>

        {/* 3. Bank Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BuildingLibraryIcon className="h-5 w-5 text-[#4A90E2]" /> Bank Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="bankName" placeholder="Bank Name" className="input-field" onChange={handleChange} />
                <input name="branch" placeholder="Branch" className="input-field" onChange={handleChange} />
                <input name="accountName" placeholder="Account Holder Name" className="input-field" onChange={handleChange} />
                <input name="accountNumber" placeholder="Account Number" className="input-field" onChange={handleChange} />
            </div>
        </div>

        {/* 4. System Access */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ComputerDesktopIcon className="h-5 w-5 text-[#4A90E2]" /> System Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-2 h-full">
                    <input type="checkbox" name="emailCreated" id="emailCreated" className="h-5 w-5 text-[#4A90E2] rounded" onChange={handleChange} />
                    <label htmlFor="emailCreated" className="text-sm text-gray-700">Corporate Email Created?</label>
                </div>
                <select name="role" className="input-field" onChange={handleChange}>
                    <option>User</option>
                    <option>Manager</option>
                    <option>Admin</option>
                </select>
                <input name="assetAllocation" placeholder="Assets (Laptop, Key, etc)" className="input-field" onChange={handleChange} />
            </div>
        </div>

        {/* 5. Documents */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-[#4A90E2]" /> Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="input-group">
                    <label className="text-xs font-bold text-gray-500">Profile Photo</label>
                    <input type="file" name="profilePhoto" accept="image/*" className="file-input" onChange={handleFileChange} />
                </div>
                <div className="input-group">
                    <label className="text-xs font-bold text-gray-500">NIC / Passport Scan</label>
                    <input type="file" name="nicScan" accept=".pdf,.jpg,.png" className="file-input" onChange={handleFileChange} />
                </div>
                <div className="input-group">
                    <label className="text-xs font-bold text-gray-500">CV / Resume</label>
                    <input type="file" name="cv" accept=".pdf,.doc,.docx" className="file-input" onChange={handleFileChange} />
                </div>
                <div className="input-group">
                    <label className="text-xs font-bold text-gray-500">Appointment Letter</label>
                    <input type="file" name="appointmentLetter" accept=".pdf,.jpg" className="file-input" onChange={handleFileChange} />
                </div>
            </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                Cancel
            </button>
            <button type="submit" disabled={loading} className="px-8 py-3 rounded-lg bg-[#4A90E2] text-white font-bold hover:bg-[#357ABD] shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
                {loading ? 'Onboarding...' : 'Complete Onboarding'}
            </button>
        </div>

      </form>

      {/* Tailwind Style Helper for inputs */}
      <style>{`
        .input-field {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            outline: none;
            transition: all 0.2s;
        }
        .input-field:focus {
            border-color: #4A90E2;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }
        .file-input {
            width: 100%;
            font-size: 0.875rem;
            color: #6b7280;
        }
        .file-input::file-selector-button {
            margin-right: 1rem;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            border: 1px solid #e5e7eb;
            background-color: #f9fafb;
            cursor: pointer;
            transition: all 0.2s;
        }
        .file-input::file-selector-button:hover {
            background-color: #f3f4f6;
        }
      `}</style>
    </div>
  );
}

export default AddEmployee;