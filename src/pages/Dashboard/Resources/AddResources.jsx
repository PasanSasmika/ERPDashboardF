import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, CloudArrowUpIcon, FolderPlusIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

// NOTE: In your local Vite project, replace this with import.meta.env.VITE_BACKEND_URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
function AddResources() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!name) {
      setError('Name is required.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      await axios.post(`${API_BASE_URL}/api/resources`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLoading(false);
      navigate('/dashboard/resources');
      toast.success('Resource added successfully!');
    } catch (err) {
      setLoading(false);
      setError('Failed to create resource. Please check your data and try again.');
      console.error('Error creating resource:', err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto font-second">
      <div className="mb-8">
          <h1 className="text-2xl font-bold font-main text-gray-900 flex items-center gap-2">
              <FolderPlusIcon className="h-7 w-7 text-[#4A90E2]" />
              Create Asset Collection
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-9">Create a new folder and upload initial documents</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Naming */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-[#4A90E2] w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                Collection Details
            </h2>
            <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Collection Name</label>
                <input type="text" name="name" id="name" required value={name} onChange={(e) => setName(e.target.value)} 
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"
                    placeholder="e.g. Project Alpha Specifications"
                />
            </div>
        </div>

        {/* Step 2: Upload */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                <span className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Upload Assets
            </h2>
            <div className="mt-2 flex justify-center px-6 pt-10 pb-10 border-2 border-gray-300 border-dashed rounded-lg hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer bg-gray-50/30">
                <div className="space-y-2 text-center">
                    <CloudArrowUpIcon className="mx-auto h-14 w-14 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-bold text-[#4A90E2] hover:text-[#357ABD] focus-within:outline-none">
                            <span>Click to upload files</span>
                            <input id="file-upload" name="files" type="file" className="sr-only" multiple onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">Support for all common file formats</p>
                    {files.length > 0 && (
                        <div className="mt-4 inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            {files.length} items selected
                        </div>
                    )}
                </div>
            </div>
        </div>

        {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        )}
        
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => navigate('/dashboard/resources')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">
                Cancel
            </button>
            <button type="submit" disabled={loading} className="px-8 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4A90E2] hover:bg-[#357ABD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2] disabled:opacity-70 transition-all transform active:scale-95">
                {loading ? 'Creating...' : 'Create Collection'}
            </button>
        </div>
      </form>
    </div>
  );
}

export default AddResources;