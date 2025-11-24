import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 
import { PlusIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { BriefcaseIcon, UsersIcon, BuildingOffice2Icon, MapPinIcon } from "@heroicons/react/24/outline";

// NOTE: In your local Vite project, replace this with import.meta.env.VITE_BACKEND_URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
function Organization() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/organizations/`);
        setOrganizations(response.data);
      } catch (err) {
        setError("Failed to fetch organizations.");
        console.error("Error fetching organizations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleOrganizationClick = (organizationId) => {
    navigate(`/dashboard/organizations/${organizationId}`);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90E2]"></div>
                <span className="text-sm font-medium text-gray-500">Loading Registry...</span>
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
  
  const statusStyle = {
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
            Corporate Registry
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-1">Manage client organizations and subsidiaries</p>
        </div>
        
        <Link to="/dashboard/addorganization">
          <button className="flex items-center gap-2 bg-[#4A90E2] hover:bg-[#357ABD] text-white text-sm font-medium py-2.5 px-5 rounded-lg shadow-sm transition-all duration-200">
            <PlusIcon className="h-4 w-4" />
            Add Organization
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {organizations.length > 0 ? (
          organizations.map((organization) => (
            <div
              key={organization._id}
              className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 flex flex-col h-full cursor-pointer"
              onClick={() => handleOrganizationClick(organization._id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#4A90E2] transition-colors">
                        {organization.name}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500">
                        <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                        <span className="line-clamp-1">{organization.address || 'No address listed'}</span>
                    </div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${statusStyle[organization.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                  {organization.status}
                </span>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                 <div className="flex items-center text-sm text-gray-600">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md mr-2">
                        <BriefcaseIcon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{organization.projects.length} Projects</span>
                 </div>
                 <div className="flex items-center text-sm text-gray-600">
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md mr-2">
                        <UsersIcon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{organization.contactDetails.length} Contacts</span>
                 </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                   <span className="text-xs font-medium text-gray-400 flex items-center group-hover:text-[#4A90E2] transition-colors">
                        View Profile <ArrowRightIcon className="h-3 w-3 ml-1" />
                   </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <BuildingOffice2Icon className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No organizations found.</p>
            <Link to="/dashboard/addorganization" className="mt-2 text-[#4A90E2] text-sm hover:underline">
                Register a new organization
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Organization;