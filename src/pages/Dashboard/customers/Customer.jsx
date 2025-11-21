import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 
import { PlusIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { UserIcon, BuildingOffice2Icon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

// NOTE: In your local Vite project, replace this with import.meta.env.VITE_BACKEND_URL
const API_BASE_URL = "http://localhost:5000";

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/customers/`);
        setCustomers(response.data);
      } catch (err) {
        setError("Failed to fetch customers.");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerClick = (customerId) => {
    navigate(`/dashboard/customers/${customerId}`);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90E2]"></div>
                <span className="text-sm font-medium text-gray-500">Loading Clients...</span>
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-8 text-center">
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg inline-block border border-red-200">
                {error}
            </div>
        </div>
    );
  }
  
  const statusConfig = {
    'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Inactive': 'bg-gray-50 text-gray-700 border-gray-200',
    'Lead': 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-second">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BuildingOffice2Icon className="h-7 w-7 text-[#4A90E2]" />
            Client Registry
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-1">Manage relationships and contact details</p>
        </div>
        
        <Link to="/dashboard/addcustomer">
            <button className="flex items-center gap-2 bg-[#4A90E2] hover:bg-[#357ABD] text-white text-sm font-medium py-2.5 px-5 rounded-lg shadow-sm transition-all duration-200">
                <PlusIcon className="h-4 w-4" />
                Add Customer
            </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div
              key={customer._id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 group flex flex-col h-full"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusConfig[customer.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                    {customer.status}
                </div>
                <button
                    onClick={() => handleCustomerClick(customer._id)}
                    className="text-gray-400 hover:text-[#4A90E2] transition-colors p-1 rounded-full hover:bg-blue-50"
                    aria-label={`View details for ${customer.name}`}
                >
                    <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{customer.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                     <UserIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                     {customer.contactPerson}
                  </div>
                  
                  <div className="space-y-2 bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <div className="flex items-center text-xs text-gray-600">
                          <EnvelopeIcon className="h-3.5 w-3.5 mr-2 text-gray-400" />
                          <span className="truncate">{customer.email || 'No email'}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                          <PhoneIcon className="h-3.5 w-3.5 mr-2 text-gray-400" />
                          <span>{customer.phone || 'No phone'}</span>
                      </div>
                  </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="text-gray-500">Active Engagement</span>
                  <span className="font-bold text-gray-900 bg-blue-50 px-2 py-1 rounded">
                      {customer.projects?.length || 0} Projects
                  </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <UserIcon className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No customers found in the registry.</p>
            <Link to="/dashboard/addcustomer" className="mt-2 text-[#4A90E2] text-sm hover:underline">
                Add your first customer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Customer;