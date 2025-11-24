import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BriefcaseIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  PaperClipIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  HeartIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from "@heroicons/react/24/solid";
import toast from 'react-hot-toast';

function ProjectOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteProjects')) || [];
    setIsFavorite(favorites.includes(id));

    const fetchProject = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/projects`);
        const foundProject = response.data.find(p => p._id === id);
        if (foundProject) {
          setProject(foundProject);
        } else {
          setError("Project not found.");
        }
      } catch (err) {
        setError("Failed to fetch project details.");
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // --- HANDLERS ---
  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteProjects')) || [];
    let updatedFavorites;

    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(favId => favId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }
    
    localStorage.setItem('favoriteProjects', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleEdit = () => {
    navigate(`/dashboard/projects/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${project.name}?`)) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/projects/${id}`);
        toast.success("Project deleted successfully!");
        navigate('/dashboard/projects'); 
      } catch (err) {
        toast.error("Failed to delete project. Please try again.");
        console.error("Error deleting project:", err);
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
    'Planned': 'bg-pink-100 text-pink-800 border-pink-200',
    'Ongoing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'In Review': 'bg-blue-100 text-blue-800 border-blue-200',
    'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-second">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold font-main text-gray-900">{project.name}</h1>
                    <span className={`px-3 py-0.5 text-xs font-bold rounded-full border ${statusStyle[project.status] || 'bg-gray-100 text-gray-800'}`}>
                        {project.status}
                    </span>
                </div>
                <p className="text-gray-500 max-w-3xl text-sm leading-relaxed">{project.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
                <button onClick={handleToggleFavorite} className={`p-2.5 rounded-lg border transition-all duration-200 ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500'}`} title="Favorite">
                    <HeartIcon className="h-5 w-5" />
                </button>
                <button onClick={handleEdit} className="p-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-[#4A90E2] hover:text-white hover:border-[#4A90E2] transition-all duration-200" title="Edit">
                    <PencilIcon className="h-5 w-5" />
                </button>
                <button onClick={handleDelete} className="p-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200" title="Delete">
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Financials & Milestones */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Key Financials Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BriefcaseIcon className="h-5 w-5 text-[#4A90E2]" />
                    Project Parameters
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                        <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5"/> Timeline</p>
                        <div className="text-sm font-semibold text-gray-900">
                            {new Date(project.startDate).toLocaleDateString()} <span className="text-gray-400 mx-1">→</span> {new Date(project.endDate).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                        <p className="text-xs font-medium text-blue-600 mb-1 flex items-center gap-1"><CurrencyDollarIcon className="h-3.5 w-3.5"/> Allocated Budget</p>
                        <div className="text-sm font-bold text-blue-900">
                            {project.budget?.currency} {project.budget?.allocated?.toLocaleString()}
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                         <p className="text-xs font-medium text-emerald-600 mb-1 flex items-center gap-1"><CurrencyDollarIcon className="h-3.5 w-3.5"/> Cost Incurred</p>
                        <div className="text-sm font-bold text-emerald-900">
                            {project.budget?.currency} {project.budget?.costIncurred?.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Milestones Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <ClipboardDocumentCheckIcon className="h-5 w-5 text-[#4A90E2]" />
                        Execution Roadmap
                    </h2>
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {project.milestones.length} Milestones
                    </span>
                </div>
                
                <div className="space-y-3">
                    {project.milestones.length > 0 ? project.milestones.map((milestone) => (
                    <div key={milestone._id} className={`flex items-center p-3 rounded-lg border ${milestone.completed ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'}`}>
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-3 ${milestone.completed ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                            {milestone.completed && <CheckCircleIcon className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex-grow">
                            <p className={`text-sm font-medium ${milestone.completed ? 'text-green-900' : 'text-gray-900'}`}>
                                {milestone.name}
                            </p>
                        </div>
                        <div className="text-xs text-gray-500 font-mono bg-white/50 px-2 py-1 rounded">
                            {new Date(milestone.date).toLocaleDateString()}
                        </div>
                    </div>
                    )) : (
                        <p className="text-sm text-gray-500 italic">No milestones defined.</p>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Team & Files */}
        <div className="space-y-6">
            
            {/* Team Members */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <UserGroupIcon className="h-5 w-5 text-[#4A90E2]" />
                    Project Team
                </h2>
                <div className="flex flex-col gap-2">
                    {project.teamMembers.length > 0 ? project.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 text-xs font-bold mr-3">
                            {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{member.name}</span>
                    </div>
                    )) : (
                         <p className="text-sm text-gray-500 italic">No team members assigned.</p>
                    )}
                </div>
            </div>

            {/* Files */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <PaperClipIcon className="h-5 w-5 text-[#4A90E2]" />
                    Attachments
                </h2>
                <div className="space-y-2">
                    {project.files.length > 0 ? project.files.map((file) => (
                    <a 
                        key={file._id} 
                        href={`${import.meta.env.VITE_BACKEND_URL}${file.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-blue-50 hover:border-blue-100 transition-all group"
                    >
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 group-hover:text-[#4A90E2] mr-3" />
                        <div className="overflow-hidden">
                            <p className="text-sm text-gray-700 font-medium truncate group-hover:text-blue-700">{file.fileName}</p>
                            <p className="text-xs text-gray-400 uppercase">{file.fileType}</p>
                        </div>
                    </a>
                    )) : (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <p className="text-sm text-gray-500">No files attached</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default ProjectOverview;