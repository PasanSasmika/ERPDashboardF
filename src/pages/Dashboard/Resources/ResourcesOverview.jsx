import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    PaperClipIcon, 
    TrashIcon, 
    HeartIcon, 
    FolderOpenIcon,
    ArrowDownTrayIcon,
    DocumentIcon
} from "@heroicons/react/24/solid";
import toast from 'react-hot-toast';

// NOTE: In your local Vite project, replace this with import.meta.env.VITE_BACKEND_URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
function ResourceOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteResources')) || [];
    setIsFavorite(favorites.includes(id));

    const fetchResource = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/resources/${id}`);
        const foundResource = response.data;
        if (foundResource) {
          setResource(foundResource);
        } else {
          setError("Resource not found.");
        }
      } catch (err) {
        setError("Failed to fetch resource details.");
        console.error("Error fetching resource:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteResources')) || [];
    let updatedFavorites;

    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(favId => favId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }
    
    localStorage.setItem('favoriteResources', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${resource.name}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}api/resources/${id}`);
        toast.success("Resource deleted successfully!");
        navigate('/dashboard/resources'); 
      } catch (err) {
        toast.error("Failed to delete resource. Please try again.");
        console.error("Error deleting resource:", err);
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

  return (
    <div className="p-6 max-w-5xl mx-auto font-second">
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#4A90E2]">
                    <FolderOpenIcon className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-main text-gray-900">{resource.name}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{resource.files.length} files in this collection</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={handleToggleFavorite} className={`p-2.5 rounded-lg border transition-all duration-200 ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500'}`} title="Favorite">
                    <HeartIcon className="h-5 w-5" />
                </button>
                <button onClick={handleDelete} className="p-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200" title="Delete Collection">
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
          </div>
      </div>
      
      {/* Files Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <PaperClipIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">File Contents</h2>
        </div>
        
        {resource.files.length > 0 ? (
            <div className="divide-y divide-gray-100">
                {resource.files.map((file) => (
                    <div key={file._id} className="p-4 hover:bg-blue-50 transition-colors flex items-center justify-between group">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                <DocumentIcon className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{file.fileName}</p>
                                <p className="text-xs text-gray-500 uppercase mt-0.5">{file.fileType}</p>
                            </div>
                        </div>
                        
                        <a 
                            href={`${API_BASE_URL}${file.url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#4A90E2] hover:bg-white hover:shadow-sm transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            Download
                        </a>
                    </div>
                ))}
            </div>
        ) : (
            <div className="p-12 text-center text-gray-500">
                No files found in this collection.
            </div>
        )}
      </div>
    </div>
  );
}

export default ResourceOverview;