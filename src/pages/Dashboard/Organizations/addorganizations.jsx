import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PlusIcon, TrashIcon, DocumentArrowUpIcon, BuildingOfficeIcon, UserGroupIcon } from '@heroicons/react/24/solid';

// NOTE: In your local Vite project, replace this with import.meta.env.VITE_BACKEND_URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
function AddOrganization() {
  const navigate = useNavigate();
  const [organizationData, setOrganizationData] = useState({
    name: '',
    address: '',
    status: 'Active',
    contactDetails: [{ role: '', name: '', email: '', phone: '' }],
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrganizationData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    const newContacts = [...organizationData.contactDetails];
    newContacts[index] = { ...newContacts[index], [name]: value.trim() };
    setOrganizationData(prev => ({ ...prev, contactDetails: newContacts }));
  };

  const addContact = () => {
    setOrganizationData(prev => ({
      ...prev,
      contactDetails: [...prev.contactDetails, { role: '', name: '', email: '', phone: '' }],
    }));
  };

  const removeContact = (index) => {
    if (organizationData.contactDetails.length > 1) {
      const newContacts = organizationData.contactDetails.filter((_, i) => i !== index);
      setOrganizationData(prev => ({ ...prev, contactDetails: newContacts }));
    }
  };

  const handleFileChange = (e) => {
    setFiles(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!organizationData.name.trim()) {
      setError('Organization name is required.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('organizationData', JSON.stringify(organizationData));
      files.forEach(file => {
        formData.append('files', file); 
      });

      await axios.post(`${API_BASE_URL}/api/organizations`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setLoading(false);
      setFiles([]);
      navigate('/dashboard/organization');
      toast.success('Organization created successfully!');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to create organization.');
      console.error("Error creating organization:", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-second">
      <div className="mb-8">
          <h1 className="text-2xl font-bold font-main text-gray-900 flex items-center gap-2">
              <BuildingOfficeIcon className="h-7 w-7 text-[#4A90E2]" />
              Register New Organization
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-9">Create a new corporate entity in the system</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Organization Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
             <span className="bg-blue-100 text-[#4A90E2] w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
             Corporate Identity
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Organization Name *</label>
               <input type="text" name="name" id="name" required value={organizationData.name} onChange={handleChange} 
                   className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"
                   placeholder="e.g. Global Corp Ltd."
               />
            </div>
            <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Headquarters Address</label>
               <textarea name="address" id="address" rows="2" value={organizationData.address} onChange={handleChange} 
                   className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"
                   placeholder="Full street address"
               />
            </div>
            <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
               <select name="status" id="status" value={organizationData.status} onChange={handleChange} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5">
                 <option>Active</option>
                 <option>Inactive</option>
                 <option>Lead</option>
               </select>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center justify-between">
             <span className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Key Stakeholders
             </span>
             <button type="button" onClick={addContact} className="text-xs font-bold text-[#4A90E2] hover:text-[#357ABD] uppercase tracking-wide flex items-center">
                <PlusIcon className="h-4 w-4 mr-1" /> Add Contact
             </button>
           </h2>
           
           <div className="space-y-4">
             {organizationData.contactDetails.map((contact, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {organizationData.contactDetails.length > 1 && (
                            <button type="button" onClick={() => removeContact(index)} className="text-red-400 hover:text-red-600 p-1"><TrashIcon className="h-4 w-4" /></button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Role</label>
                            <input type="text" name="role" required value={contact.role} onChange={(e) => handleContactChange(index, e)} placeholder="Role" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] text-xs py-2"/>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Name</label>
                            <input type="text" name="name" required value={contact.name} onChange={(e) => handleContactChange(index, e)} placeholder="Name" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] text-xs py-2"/>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email</label>
                            <input type="email" name="email" value={contact.email} onChange={(e) => handleContactChange(index, e)} placeholder="Email" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] text-xs py-2"/>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Phone</label>
                            <input type="tel" name="phone" value={contact.phone} onChange={(e) => handleContactChange(index, e)} placeholder="Phone" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] text-xs py-2"/>
                        </div>
                    </div>
                </div>
             ))}
           </div>
        </div>

        {/* Section 3: Documents */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                Initial Documentation
            </h2>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input type="file" multiple name="files" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="space-y-1 text-center pointer-events-none">
                    <DocumentArrowUpIcon className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                        <span className="font-medium text-[#4A90E2]">Upload files</span>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">Contracts, NDAs, or registration documents</p>
                </div>
            </div>
            {files.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded border border-gray-200">
                            <span className="truncate text-gray-600">{file.name}</span>
                            <button type='button' onClick={() => removeFile(index)} className='text-red-400 hover:text-red-600 p-1'><TrashIcon className='h-4 w-4' /></button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {error && <p className="text-red-500 text-sm p-4 bg-red-50 rounded-lg border border-red-100">{error}</p>}
        
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => navigate('/dashboard/organization')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-8 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4A90E2] hover:bg-[#357ABD] focus:outline-none disabled:opacity-70 transition-all">
                {loading ? 'Registering...' : 'Register Organization'}
            </button>
        </div>
      </form>
    </div>
  );
}

export default AddOrganization;