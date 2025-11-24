import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/24/solid";
import { ClockIcon, UsersIcon, BriefcaseIcon, ChartBarIcon } from "@heroicons/react/24/outline";

function Project() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/projects`);
        setProjects(response.data);
      } catch (err) {
        setError("Failed to fetch projects.");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/dashboard/projects/${projectId}`);
  };


  if (loading) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90E2]"></div>
                <span className="text-sm font-medium text-gray-500">Loading Projects...</span>
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BriefcaseIcon className="h-7 w-7 text-[#4A90E2]" />
            Project Portfolio
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-1">Manage, track, and analyze all active initiatives</p>
        </div>
        
        <Link to="/dashboard/addproject">
            <button className="flex items-center gap-2 bg-[#4A90E2] hover:bg-[#357ABD] text-white text-sm font-medium py-2.5 px-5 rounded-lg shadow-sm transition-all duration-200">
                <PlusIcon className="h-4 w-4" />
                New Project
            </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => {
            const totalMilestones = project.milestones?.length || 0;
            const completedMilestones = project.milestones?.filter(m => m.completed).length || 0;
            const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
            
            const statusConfig = {
              'Planned': 'bg-pink-50 text-pink-700 border-pink-200',
              'Ongoing': 'bg-yellow-50 text-yellow-700 border-yellow-200',
              'In Review': 'bg-blue-50 text-blue-700 border-blue-200',
              'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
              'On Hold': 'bg-gray-50 text-gray-700 border-gray-200',
            };

            const statusClass = statusConfig[project.status] || 'bg-gray-50 text-gray-700 border-gray-200';

            return (
              <div
                key={project._id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                onClick={() => handleProjectClick(project._id)}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusClass}`}>
                        {project.status}
                    </div>
                    <div className="text-gray-400 group-hover:text-[#4A90E2] transition-colors">
                         <ArrowRightIcon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{project.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-5 min-h-[40px]">
                    {project.description || "No description provided."}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                            <ClockIcon className="h-3.5 w-3.5" />
                            <span>Due Date</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                            {project.endDate ? new Date(project.endDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric' }) : 'N/A'}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                            <UsersIcon className="h-3.5 w-3.5" />
                            <span>Team</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                            {project.teamMembers.length} Members
                        </div>
                    </div>
                  </div>
                </div>

                {/* Footer with Progress */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-medium text-gray-500 flex items-center gap-1">
                            <ChartBarIcon className="h-3.5 w-3.5" />
                            Milestone Progress
                        </span>
                        <span className="font-bold text-gray-900">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="bg-[#4A90E2] h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <BriefcaseIcon className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No projects found in the registry.</p>
            <Link to="/dashboard/addproject" className="mt-2 text-[#4A90E2] text-sm hover:underline">
                Create your first project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Project;