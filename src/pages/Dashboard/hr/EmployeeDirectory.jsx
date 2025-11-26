import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  UserPlusIcon, 
  MagnifyingGlassIcon,
  BriefcaseIcon,
  BuildingOfficeIcon
} from "@heroicons/react/24/solid";
import { getEmployees } from '../../../services/financeService';
import toast from 'react-hot-toast';

function EmployeeDirectory() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Define Backend URL cleanly
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // 2. Helper to clean up Image URLs (Prevents double slashes)
  const getImageUrl = (path) => {
    if (!path) return null;
    // Remove leading slash from path if it exists
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // Remove trailing slash from base URL if it exists
    const cleanBase = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    return `${cleanBase}/${cleanPath}`;
  };

  // Filter logic
  const filteredEmployees = employees.filter(emp => 
    (emp.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (emp.designation?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto font-second">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserGroupIcon className="h-7 w-7 text-[#4A90E2]" /> Employee Directory
          </h1>
          <p className="text-sm text-gray-500">{employees.length} Active Staff Members</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4A90E2]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Link 
            to="/dashboard/hr/add-employee" 
            className="flex items-center gap-2 bg-[#4A90E2] hover:bg-[#357ABD] text-white px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <UserPlusIcon className="h-5 w-5" /> Add Employee
          </Link>
        </div>
      </div>

      {/* Grid View */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading directory...</div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <UserGroupIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No employees found.</p>
          <p className="text-sm text-gray-400">Get started by adding a new team member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <Link 
              to={`/dashboard/hr/employees/${emp._id}`} 
              key={emp._id}
              className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-[#4A90E2]/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  
                  {/* Profile Photo Logic */}
                  <div className="h-14 w-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden text-xl font-bold text-gray-400 shrink-0">
                    {emp.documents?.profilePhoto ? (
                      <img 
                        src={getImageUrl(emp.documents.profilePhoto)} 
                        alt={emp.name} 
                        className="h-full w-full object-cover" 
                        onError={(e) => {e.target.style.display = 'none'; e.target.parentNode.innerText = (emp.name || 'U').charAt(0).toUpperCase()}}
                      />
                    ) : (
                      (emp.name || 'U').charAt(0).toUpperCase()
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-[#4A90E2] transition-colors">{emp.name || 'Unknown Employee'}</h3>
                    <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded mt-1 border border-green-100">
                      {emp.employmentType || 'Full-time'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-50 pt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate">{emp.designation || 'No Designation'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate">{emp.department || 'General'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeeDirectory;