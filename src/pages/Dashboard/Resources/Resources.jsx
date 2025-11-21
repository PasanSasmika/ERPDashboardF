import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusIcon, TrashIcon, FolderIcon, DocumentIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

// NOTE: In your local Vite project, replace this with import.meta.env.VITE_BACKEND_URL
const API_BASE_URL = "http://localhost:5000";

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/resources`);
        setResources(response.data);
      } catch (err) {
        setError('Failed to fetch resources.');
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleDelete = async (e, id, name) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/api/resources/${id}`);
        setResources(resources.filter(res => res._id !== id));
        toast.success('Resource deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete resource. Please try again.');
        console.error('Error deleting resource:', err);
      }
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90E2]"></div>
                <span className="text-sm font-medium text-gray-500">Loading Repository...</span>
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
    <div className="p-6 max-w-7xl mx-auto font-second">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderIcon className="h-7 w-7 text-[#4A90E2]" />
            Digital Asset Repository
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-1">Centralized storage for project documents and assets</p>
        </div>
        
        <Link to="/dashboard/addresources">
            <button className="flex items-center gap-2 bg-[#4A90E2] hover:bg-[#357ABD] text-white text-sm font-medium py-2.5 px-5 rounded-lg shadow-sm transition-all duration-200">
                <PlusIcon className="h-4 w-4" />
                Upload New Asset
            </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div 
            key={resource._id} 
            onClick={() => navigate(`/dashboard/resources/${resource._id}`)}
            className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-lg text-[#4A90E2] group-hover:bg-[#4A90E2] group-hover:text-white transition-colors duration-300">
                    <FolderIcon className="h-6 w-6" />
                </div>
                <button 
                    onClick={(e) => handleDelete(e, resource._id, resource.name)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all"
                    title="Delete Collection"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#4A90E2] transition-colors">{resource.name}</h3>
            
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                    <DocumentIcon className="h-3.5 w-3.5 mr-1.5" />
                    {resource.files.length} Files
                </div>
                <div className="text-[#4A90E2] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                    <ChevronRightIcon className="h-5 w-5" />
                </div>
            </div>
          </div>
        ))}
        
        {resources.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <FolderIcon className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Repository is empty.</p>
            <Link to="/dashboard/addresources" className="mt-2 text-[#4A90E2] text-sm hover:underline">
                Upload your first asset collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Resources;