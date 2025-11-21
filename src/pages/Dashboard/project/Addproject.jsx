import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon, FolderPlusIcon, CurrencyDollarIcon, CalendarDaysIcon, UserGroupIcon, FlagIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

function Addproject() {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    status: 'Planned',
    startDate: '',
    endDate: '',
    budget: {
      allocated: 0,
      currency: 'LKR',
      costIncurred: 0,
    },
  });
  const [teamMembers, setTeamMembers] = useState([{ name: '' }]);
  const [milestones, setMilestones] = useState([{ name: '', date: '' }]);
  const [files, setFiles] = useState([]); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Handlers ---
  const handleProjectDataChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      budget: { ...prev.budget, [name]: value }
    }));
  };

  const handleMemberChange = (index, event) => {
    const newMembers = [...teamMembers];
    newMembers[index].name = event.target.value;
    setTeamMembers(newMembers);
  };

  const addMember = () => {
    setTeamMembers([...teamMembers, { name: '' }]);
  };

  const removeMember = (index) => {
    const newMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(newMembers);
  };

  const handleMilestoneChange = (index, event) => {
    const newMilestones = [...milestones];
    newMilestones[index][event.target.name] = event.target.value;
    setMilestones(newMilestones);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { name: '', date: '' }]);
  };

  const removeMilestone = (index) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
  };
  
  const handleFileChange = (e) => {
    setFiles(e.target.files); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const finalProjectData = {
      ...projectData,
      teamMembers,
      milestones,
    };
    
    const formData = new FormData();
    formData.append('projectData', JSON.stringify(finalProjectData));
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]); 
    }

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/projects`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLoading(false);
      navigate('/dashboard/projects'); 
      toast.success('Project added successfully!');
    } catch (err) {
      setLoading(false);
      setError('Failed to create project. Please check your data and try again.');
      console.error("Error creating project:", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-second">
      <div className="mb-8">
          <h1 className="text-2xl font-bold font-main text-gray-900 flex items-center gap-2">
              <FolderPlusIcon className="h-7 w-7 text-[#4A90E2]" />
              Initiate New Project
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-9">Define parameters, budget, and resources for the new initiative</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: General Information */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-[#4A90E2] w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                General Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Project Name</label>
                    <input type="text" name="name" id="name" required value={projectData.name} onChange={handleProjectDataChange} 
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5" 
                        placeholder="e.g. ERP System Migration"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                    <textarea name="description" id="description" rows="3" value={projectData.description} onChange={handleProjectDataChange} 
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"
                        placeholder="Briefly describe the project scope and objectives..."
                    ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="status" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                        <select name="status" id="status" value={projectData.status} onChange={handleProjectDataChange} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5">
                            <option>Planned</option>
                            <option>Ongoing</option>
                            <option>On Hold</option>
                            <option>Completed</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Start Date</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <input type="date" name="startDate" id="startDate" required value={projectData.startDate} onChange={handleProjectDataChange} className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">End Date</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <input type="date" name="endDate" id="endDate" required value={projectData.endDate} onChange={handleProjectDataChange} className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Section 2: Financials */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                <span className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Financials
            </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="allocated" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Allocated Budget</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="number" name="allocated" id="allocated" value={projectData.budget.allocated} onChange={handleBudgetChange} 
                            className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"
                            placeholder="0.00"
                        />
                    </div>
                </div>
                 <div>
                    <label htmlFor="costIncurred" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cost Incurred</label>
                    <div className="relative rounded-md shadow-sm">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="number" name="costIncurred" id="costIncurred" value={projectData.budget.costIncurred} onChange={handleBudgetChange} 
                             className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"
                             placeholder="0.00"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section 3: Team */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                    Member
                </h2>
                <div className="space-y-3">
                    {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="relative rounded-md shadow-sm flex-grow">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserGroupIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <input type="text" placeholder="Member Name" value={member.name} onChange={(e) => handleMemberChange(index, e)} className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2"/>
                        </div>
                        <button type="button" onClick={() => removeMember(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                            <TrashIcon className="h-5 w-5"/>
                        </button>
                    </div>
                    ))}
                    <button type="button" onClick={addMember} className="mt-2 flex items-center text-xs font-bold text-[#4A90E2] hover:text-[#357ABD] uppercase tracking-wide px-1">
                        <PlusIcon className="h-4 w-4 mr-1"/> Add Team Member
                    </button>
                </div>
            </div>
            
            {/* Section 4: Milestones */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                    Milestones
                </h2>
                 <div className="space-y-3">
                    {milestones.map((milestone, index) => (
                        <div key={index} className="flex gap-3 items-center">
                            <div className="grid grid-cols-2 gap-2 flex-grow">
                                <div className="relative rounded-md shadow-sm">
                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FlagIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input type="text" name="name" placeholder="Milestone Name" required value={milestone.name} onChange={(e) => handleMilestoneChange(index, e)} className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2"/>
                                </div>
                                <input type="date" name="date" required value={milestone.date} onChange={(e) => handleMilestoneChange(index, e)} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2"/>
                            </div>
                            <button type="button" onClick={() => removeMilestone(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                                <TrashIcon className="h-5 w-5"/>
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addMilestone} className="mt-2 flex items-center text-xs font-bold text-[#4A90E2] hover:text-[#357ABD] uppercase tracking-wide px-1">
                        <PlusIcon className="h-4 w-4 mr-1"/> Add Milestone
                    </button>
                </div>
            </div>
        </div>

        {/* Section 5: Attachments */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">5</span>
                Documents
            </h2>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#4A90E2] hover:text-[#357ABD] focus-within:outline-none">
                            <span>Upload files</span>
                            <input id="file-upload" name="files" type="file" className="sr-only" multiple onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                    {files.length > 0 && (
                        <div className="mt-2 text-sm text-green-600 font-medium">
                            {files.length} files selected
                        </div>
                    )}
                </div>
            </div>
        </div>

        {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        )}
        
        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => navigate('/dashboard/projects')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors">
                Cancel
            </button>
            <button type="submit" disabled={loading} className="px-8 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4A90E2] hover:bg-[#357ABD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2] disabled:opacity-70 transition-all transform active:scale-95">
                {loading ? 'Creating...' : 'Create Project'}
            </button>
        </div>

      </form>
    </div>
  );
}

export default Addproject;