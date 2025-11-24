import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

// NOTE: In your local Vite project, replace this with import.meta.env.VITE_BACKEND_URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
function EditOrganization() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [organizationData, setOrganizationData] = useState({
    name: '',
    address: '',
    status: 'Active',
    contactDetails: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/organizations/${id}`);
        const { name, address, status, contactDetails } = response.data;
        const normalizedContacts = contactDetails.map(contact => ({
          ...contact,
          role: contact.role || '',
          name: contact.name || '',
        }));
        setOrganizationData({ name, address, status, contactDetails: normalizedContacts });
      } catch (err) {
        setError("Failed to fetch organization details.");
        console.error("Error fetching organization:", err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

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
      const { projects, documents, ...updateData } = organizationData;
      await axios.put(`${API_BASE_URL}api/organizations/${id}`, updateData);
      
      setLoading(false);
      navigate(`/dashboard/organizations/${id}`);
      toast.success('Organization updated successfully!');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to update organization.');
      console.error("Error updating organization:", err);
    }
  };

  if (fetchLoading) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90E2]"></div>
        </div>
    );
  }
  
  if (error && !loading) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto font-second">
      <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold font-main text-gray-900 flex items-center gap-2">
              <PencilSquareIcon className="h-7 w-7 text-[#4A90E2]" />
              Edit Corporate Record
          </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Organization Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Corporate Identity</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Organization Name *</label>
               <input type="text" name="name" id="name" required value={organizationData.name} onChange={handleChange} 
                   className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"
               />
            </div>
            <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Address</label>
               <textarea name="address" id="address" rows="2" value={organizationData.address} onChange={handleChange} 
                   className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm py-2.5"
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
             <span>Key Stakeholders</span>
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
                            <input type="text" name="role" required value={contact.role} onChange={(e) => handleContactChange(index, e)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] text-xs py-2"/>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Name</label>
                            <input type="text" name="name" required value={contact.name} onChange={(e) => handleContactChange(index, e)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] text-xs py-2"/>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email</label>
                            <input type="email" name="email" value={contact.email} onChange={(e) => handleContactChange(index, e)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] text-xs py-2"/>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Phone</label>
                            <input type="tel" name="phone" value={contact.phone} onChange={(e) => handleContactChange(index, e)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] text-xs py-2"/>
                        </div>
                    </div>
                </div>
             ))}
           </div>
        </div>
        
        {error && <p className="text-red-500 text-sm p-3 bg-red-50 rounded-md">{error}</p>}
        
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => navigate(`/dashboard/organizations/${id}`)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-8 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4A90E2] hover:bg-[#357ABD] focus:outline-none disabled:opacity-70 transition-all">
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </form>
    </div>
  );
}

export default EditOrganization;