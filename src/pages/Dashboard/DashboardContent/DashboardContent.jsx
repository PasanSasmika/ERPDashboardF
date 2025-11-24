import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    ClockIcon, 
    UsersIcon, 
    ArrowRightIcon, 
    PaperClipIcon, 
    HeartIcon,
    ChartBarIcon,
    CheckCircleIcon,
    PauseCircleIcon,
    PlayCircleIcon
} from "@heroicons/react/24/solid";
// Ensure this relative path matches your file structure. 
// Based on standard structure: src/pages/Dashboard/DashboardContent -> ../../../components/ChartSections
import ChartSection from '../../../components/ChartSections';
import { BookMarked, LayoutDashboard } from 'lucide-react';

// --- Sub-Components ---

const ProjectCard = ({ project }) => {
    const navigate = useNavigate();
    const totalMilestones = project.milestones?.length || 0;
    const completedMilestones = project.milestones?.filter(m => m.completed).length || 0;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    const statusConfig = {
        'Planned': { color: 'bg-pink-50 text-pink-700 border-pink-200', icon: ClockIcon },
        'Ongoing': { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: PlayCircleIcon },
        'On Hold': { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: PauseCircleIcon },
        'Completed': { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircleIcon },
    };

    const config = statusConfig[project.status] || { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: ClockIcon };
    const StatusIcon = config.icon;

    return (
        <div className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 ${config.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {project.status}
                    </span>
                    <button
                        onClick={() => navigate(`/dashboard/projects/${project._id}`)}
                        className="text-gray-400 hover:text-[#4A90E2] transition-colors"
                    >
                        <ArrowRightIcon className="h-5 w-5" />
                    </button>
                </div>
                
                <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1" title={project.name}>{project.name}</h3>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-4">
                    <div className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span>{project.endDate ? new Date(project.endDate).toLocaleDateString("en-US", { month: 'short', day: '2-digit' }) : 'No Date'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <UsersIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span>{project.teamMembers.length} Team</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full">
                <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-500 font-medium">Progress</span>
                    <span className="text-gray-900 font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                        className="bg-[#4A90E2] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

const ResourceCard = ({ resource }) => {
    const navigate = useNavigate();

    return (
        <div className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-[#4A90E2]/30 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <PaperClipIcon className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">{resource.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{resource.files.length} attached files</p>
                </div>
            </div>
            <button
                onClick={() => navigate(`/dashboard/resources/${resource._id}`)}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-50 hover:text-[#4A90E2] transition-all"
            >
                <ArrowRightIcon className="h-5 w-5" />
            </button>
        </div>
    );
};

const DetailsCardSection = ({ projectCounts }) => {
    const cardData = [
        { title: "Total Planned", value: projectCounts.Planned || 0, color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-100" },
        { title: "Ongoing Projects", value: projectCounts.Ongoing || 0, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
        { title: "On Hold", value: projectCounts['On Hold'] || 0, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
        { title: "Completed", value: projectCounts.Completed || 0, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {cardData.map((card, index) => (
                <div key={index} className="relative overflow-hidden bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                            <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
                        </div>
                        <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
                            <ChartBarIcon className="h-6 w-6" />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 w-full h-1 ${card.bg.replace('bg-', 'bg-opacity-50 bg-')}`} />
                </div>
            ))}
        </div>
    );
};

// --- Main Component ---

const DashboardContent = () => {
    const [favoriteProjects, setFavoriteProjects] = useState([]);
    const [savedResources, setSavedResources] = useState([]);
    const [projectCounts, setProjectCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const allProjectsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/projects`);
                const allProjects = allProjectsResponse.data;

                const counts = allProjects.reduce((acc, project) => {
                    acc[project.status] = (acc[project.status] || 0) + 1;
                    return acc;
                }, {});
                setProjectCounts(counts);

                const favoriteProjectIds = JSON.parse(localStorage.getItem('favoriteProjects')) || [];
                const favoriteResourceIds = JSON.parse(localStorage.getItem('favoriteResources')) || [];

                const bookmarkedProjectsData = allProjects.filter(project => favoriteProjectIds.includes(project._id));
                setFavoriteProjects(bookmarkedProjectsData);

                const resourceResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/resources`);
                const allResources = resourceResponse.data;
                const savedResourcesData = allResources.filter(resource => favoriteResourceIds.includes(resource._id));
                setSavedResources(savedResourcesData);

            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Could not load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90E2]"></div>
                <span className="text-sm text-gray-400">Loading dashboard...</span>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center text-red-600 font-medium m-8">
            {error}
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6 text-[#4A90E2]" />
                        Executive Overview
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Enterprise performance at a glance</p>
                </div>
                <div className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    Live Updates
                </div>
            </div>
            
            {/* Stats Grid */}
            <DetailsCardSection projectCounts={projectCounts} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Chart Area - Takes 2/3 on large screens */}
                <div className="xl:col-span-2 space-y-6">
                    <ChartSection />
                    
                    {/* Saved Resources Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <HeartIcon className="h-5 w-5 text-rose-500" />
                                Saved Resources
                            </h2>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {savedResources.length} Items
                            </span>
                        </div>
                        
                        {savedResources.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {savedResources.map(resource => (
                                    <ResourceCard key={resource._id} resource={resource} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                                <HeartIcon className="h-8 w-8 text-gray-300 mb-2" />
                                <p className="text-sm font-medium text-gray-500">No saved resources yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Area - Takes 1/3 on large screens */}
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <BookMarked className="h-5 w-5 text-[#4A90E2]" />
                                Pinned Projects
                            </h2>
                        </div>

                        {favoriteProjects.length > 0 ? (
                            <div className="space-y-4">
                                {favoriteProjects.map(project => (
                                    <ProjectCard key={project._id} project={project} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50 text-center">
                                <BookMarked className="h-8 w-8 text-gray-300 mb-2" />
                                <p className="text-sm font-medium text-gray-900">No pinned projects</p>
                                <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Mark projects as favorites to see them here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;