import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { PencilSquareIcon, CalendarDaysIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast'; 

function EditProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    status: '',
    startDate: '',
    endDate: '',
    budget: {
      allocated: 0,
      currency: 'USD',
      costIncurred: 0,
    },
    milestones: [],
    teamMembers: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/projects`);
        const foundProject = response.data.find(p => p._id === id);
        if (foundProject) {
          // Format dates to YYYY-MM-DD
          if(foundProject.startDate) foundProject.startDate = new Date(foundProject.startDate).toISOString().split('T')[0];
          if(foundProject.endDate) foundProject.endDate = new Date(foundProject.endDate).toISOString().split('T')[0];
          setProjectData(foundProject);
        } else {
          setError("Project not found.");
        }
      } catch (err) {
        setError("Failed to fetch project details.");
        console.error("Error fetching project:", err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/projects/${id}`, projectData);
      setLoading(false);
      navigate(`/dashboard/projects/${id}`);
      toast.success('Project updated successfully!');
    } catch (err) {
      setLoading(false);
      setError('Failed to update project. Please check your data and try again.');
      console.error("Error updating project:", err);
    }
  };

  if (fetchLoading) {
    return (
        <div className="flex items-center justify-center h-96">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90E2]"></div>
        </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto font-second">
      <div className="mb-8 border-b border-gray-200 pb-4">
         <h1 className="text-2xl font-bold font-main text-gray-900 flex items-center gap-2">
            <PencilSquareIcon className="h-7 w-7 text-[#4A90E2]" />
            Edit Project Configuration
         </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Card 1: Basic Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Details</h2>
             <div className="grid grid-cols-1 gap-6">
                <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Project Name</label>
                    <input type="text" name="name" id="name" required value={projectData.name} onChange={handleChange} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"/>
                </div>
                <div>
                    <label htmlFor="description" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                    <textarea name="description" id="description" rows="3" required value={projectData.description} onChange={handleChange} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"></textarea>
                </div>
             </div>
        </div>

        {/* Card 2: Status & Timeline */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 mb-4">Status & Timeline</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="status" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                    <select name="status" id="status" value={projectData.status} onChange={handleChange} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5">
                        <option>Planned</option>
                        <option>Ongoing</option>
                        <option>In Review</option>
                        <option>Completed</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="startDate" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Start Date</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="date" name="startDate" id="startDate" required value={projectData.startDate} onChange={handleChange} className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">End Date</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="date" name="endDate" id="endDate" required value={projectData.endDate} onChange={handleChange} className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"/>
                    </div>
                </div>
             </div>
        </div>

        {/* Card 3: Financials */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Financials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="allocated" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Allocated Budget</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="number" name="allocated" id="allocated" value={projectData.budget.allocated} onChange={handleBudgetChange} className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="costIncurred" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cost Incurred</label>
                     <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="number" name="costIncurred" id="costIncurred" value={projectData.budget.costIncurred} onChange={handleBudgetChange} className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"/>
                    </div>
                </div>
            </div>
        </div>
        
        {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        )}
        
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={() => navigate(`/dashboard/projects/${id}`)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-8 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4A90E2] hover:bg-[#357ABD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2] disabled:opacity-70">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProject;