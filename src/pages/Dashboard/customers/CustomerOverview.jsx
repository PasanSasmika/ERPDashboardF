import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  IdentificationIcon
} from "@heroicons/react/24/solid";

// NOTE: In your local Vite project, replace this with import.meta.env.VITE_BACKEND_URL
const API_BASE_URL = "http://localhost:5000";

function CustomerOverview() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/customers/${id}`);
        setCustomer(response.data);
      } catch (err) {
        setError("Failed to fetch customer details.");
        console.error("Error fetching customer:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  // --- HANDLERS ---
  const handleEdit = () => {
    navigate(`/dashboard/customers/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/api/customers/${id}`);
        toast.success('Customer deleted successfully!');
        navigate('/dashboard/customers');
      } catch (err) {
        toast.error('Failed to delete customer.');
        console.error("Error deleting customer:", err);
      }
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90E2]"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-8 text-center text-red-600 font-medium">
            {error}
        </div>
    );
  }

  const statusStyle = {
    'Active': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Inactive': 'bg-gray-100 text-gray-800 border-gray-200',
    'Lead': 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-second">
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-[#4A90E2]">
                    <BuildingOfficeIcon className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-main text-gray-900">{customer.name}</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className={`px-3 py-0.5 text-xs font-bold rounded-full border ${statusStyle[customer.status] || 'bg-gray-100 text-gray-800'}`}>
                            {customer.status}
                        </span>
                        {customer.address && (
                            <div className="flex items-center text-sm text-gray-500">
                                <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                                {customer.address}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#4A90E2] hover:border-[#4A90E2] transition-all">
                    <PencilIcon className="h-4 w-4" />
                    Edit
                </button>
                <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                    <TrashIcon className="h-4 w-4" />
                    Delete
                </button>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Contact Information Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <IdentificationIcon className="h-5 w-5 text-[#4A90E2]" />
                Primary Contact Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Point of Contact</p>
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-full border border-gray-200 text-gray-400">
                            <UserIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{customer.contactPerson}</p>
                            <p className="text-xs text-gray-500">Primary Representative</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                         <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</p>
                         <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-sm font-medium text-[#4A90E2] hover:underline">
                            <EnvelopeIcon className="h-4 w-4" />
                            {customer.email}
                         </a>
                    </div>
                    <div>
                         <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Phone Number</p>
                         <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <PhoneIcon className="h-4 w-4 text-gray-400" />
                            {customer.phone}
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Meta Info / Stats Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
             <h2 className="text-base font-bold text-gray-900 mb-4">Engagement Overview</h2>
             <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                     <span className="text-sm text-gray-600">Customer Since</span>
                     <span className="text-sm font-semibold text-gray-900">{new Date().getFullYear()}</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                     <span className="text-sm text-blue-800">Active Projects</span>
                     <span className="text-sm font-bold text-blue-800">{customer.projects?.length || 0}</span>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
}

export default CustomerOverview;