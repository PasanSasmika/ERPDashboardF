import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlusIcon, BuildingOfficeIcon, UserIcon } from '@heroicons/react/24/solid';

// NOTE: In your local Vite project, replace this with import.meta.env.VITE_BACKEND_URL
const API_BASE_URL = "http://localhost:5000";

function Addcustomer() {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_BASE_URL}/api/customers`, customerData);
      setLoading(false);
      navigate('/dashboard/customers');
      toast.success('Customer added successfully!');
    } catch (err) {
      setLoading(false);
      setError('Failed to create customer. Please check your data and try again.');
      console.error("Error creating customer:", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-second">
      <div className="mb-8">
          <h1 className="text-2xl font-bold font-main text-gray-900 flex items-center gap-2">
              <UserPlusIcon className="h-7 w-7 text-[#4A90E2]" />
              Onboard New Client
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-9">Enter organization details and primary contact information</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Organization Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-[#4A90E2] w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                Organization Details
            </h2>
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Client / Company Name</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="text" name="name" id="name" required value={customerData.name} onChange={handleChange} 
                            className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"
                            placeholder="e.g. Acme Corp"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="address" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Billing Address</label>
                    <textarea name="address" id="address" rows="2" value={customerData.address} onChange={handleChange} 
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"
                        placeholder="Street, City, Zip Code"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="status" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Account Status</label>
                    <select name="status" id="status" value={customerData.status} onChange={handleChange} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5">
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Lead</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Section 2: Contact Person */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                <span className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Primary Contact
            </h2>
            <div className="grid grid-cols-1 gap-6">
                 <div>
                    <label htmlFor="contactPerson" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contact Name</label>
                    <div className="relative rounded-md shadow-sm">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="text" name="contactPerson" id="contactPerson" value={customerData.contactPerson} onChange={handleChange} 
                            className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                        <input type="email" name="email" id="email" required value={customerData.email} onChange={handleChange} 
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                        <input type="tel" name="phone" id="phone" value={customerData.phone} onChange={handleChange} 
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                </div>
            </div>
        </div>

        {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        )}
        
        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => navigate('/dashboard/customers')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors">
                Cancel
            </button>
            <button type="submit" disabled={loading} className="px-8 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4A90E2] hover:bg-[#357ABD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2] disabled:opacity-70 transition-all transform active:scale-95">
                {loading ? 'Creating...' : 'Create Client'}
            </button>
        </div>
      </form>
    </div>
  );
}

export default Addcustomer;