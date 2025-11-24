import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  EnvelopeIcon,
  SunIcon,
  MoonIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  KeyIcon,
  IdentificationIcon
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

// NOTE: In your local Vite project, replace this with import.meta.env.VITE_BACKEND_URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'black';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // Temporary state for editing
  const [editForm, setEditForm] = useState({
      firstName: '',
      lastName: '',
      email: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'black' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'black' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setEditForm({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
      });
      setLoading(false);
    } else {
      setError('No user data found. Please log in.');
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => !prev);
    toast.success(`Switched to ${!isDarkMode ? 'Dark' : 'Light'} Mode`);
  };

  const handleEditToggle = () => {
      setIsEditing(!isEditing);
      // Reset form if cancelling
      if (isEditing) {
        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
      }
  };

  const handleInputChange = (e) => {
      setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
      // In a real app, you would make an API call here.
      // For now, we update local state and localStorage.
      const updatedUser = { ...user, ...editForm };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      toast.success("Profile updated successfully");
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
        <div className="p-8 text-center">
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg inline-block border border-red-200">
                {error}
            </div>
        </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto font-second transition-colors duration-300">
      
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
               <button
                onClick={handleThemeToggle}
                className={`p-2 rounded-full transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-orange-100 text-orange-500'
                }`}
                title="Toggle Theme"
              >
                {isDarkMode ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
              </button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
              <div className="relative group">
                  <img
                    src={user.profilepic || 'https://via.placeholder.com/128'}
                    alt="Profile"
                    className="h-32 w-32 rounded-full border-4 border-white shadow-md object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-[#4A90E2] p-2 rounded-full text-white border-2 border-white shadow-sm cursor-pointer hover:bg-[#357ABD] transition-colors">
                      <PencilSquareIcon className="h-4 w-4" />
                  </div>
              </div>
              
              <div className="text-center md:text-left flex-1">
                  <h1 className="text-2xl font-bold font-main text-gray-900">
                      {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1 flex items-center justify-center md:justify-start gap-2">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      {user.email}
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                          Administrator
                      </span>
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                          Active Status
                      </span>
                  </div>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                  {!isEditing ? (
                      <button 
                        onClick={handleEditToggle}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
                      >
                          <PencilSquareIcon className="h-4 w-4" />
                          Edit Profile
                      </button>
                  ) : (
                      <>
                        <button 
                            onClick={handleEditToggle}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <XMarkIcon className="h-4 w-4" /> Cancel
                        </button>
                        <button 
                            onClick={handleSaveProfile}
                            className="px-4 py-2 bg-[#4A90E2] text-white text-sm font-medium rounded-lg hover:bg-[#357ABD] transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <CheckIcon className="h-4 w-4" /> Save Changes
                        </button>
                      </>
                  )}
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Personal Information Card */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                  <UserIcon className="h-5 w-5 text-[#4A90E2]" />
                  Personal Information
              </h2>
              
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">First Name</label>
                          {isEditing ? (
                              <input 
                                type="text" 
                                name="firstName"
                                value={editForm.firstName}
                                onChange={handleInputChange}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] text-sm transition-all" 
                              />
                          ) : (
                              <div className="p-3 bg-gray-50 rounded-lg text-gray-800 text-sm font-medium border border-transparent">
                                  {user.firstName}
                              </div>
                          )}
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Last Name</label>
                          {isEditing ? (
                              <input 
                                type="text" 
                                name="lastName"
                                value={editForm.lastName}
                                onChange={handleInputChange}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] text-sm transition-all" 
                              />
                          ) : (
                              <div className="p-3 bg-gray-50 rounded-lg text-gray-800 text-sm font-medium border border-transparent">
                                  {user.lastName}
                              </div>
                          )}
                      </div>
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                       {isEditing ? (
                              <input 
                                type="email" 
                                name="email"
                                value={editForm.email}
                                onChange={handleInputChange}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] text-sm transition-all" 
                              />
                          ) : (
                              <div className="p-3 bg-gray-50 rounded-lg text-gray-800 text-sm font-medium border border-transparent flex items-center gap-2">
                                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                                  {user.email}
                              </div>
                          )}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Role & Permissions</h3>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <IdentificationIcon className="h-8 w-8 text-blue-500" />
                          <div>
                              <p className="text-sm font-bold text-blue-900">Super Admin</p>
                              <p className="text-xs text-blue-600">Full access to all system modules and settings.</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

         

      </div>
    </div>
  );
}

export default Profile;