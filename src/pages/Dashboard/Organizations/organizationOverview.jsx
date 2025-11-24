import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    BuildingOffice2Icon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    PencilIcon,
    TrashIcon,
    BriefcaseIcon,
    DocumentTextIcon,
    UserIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    PlusIcon,
    CurrencyDollarIcon,
    FolderOpenIcon,
    ArrowDownTrayIcon
} from "@heroicons/react/24/solid";

// NOTE: In your local Vite project, replace this with import.meta.env.VITE_BACKEND_URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
// --- SUB-COMPONENT: INVOICE LIST ---
const InvoiceList = ({ projectId, orgId, navigate }) => {
    const [invoices, setInvoices] = useState([]);
    const [invLoading, setInvLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            setInvLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/invoices/organization/${orgId}/project/${projectId}`);
                setInvoices(response.data);
            } catch (err) {
                console.error("Failed to fetch invoices:", err);
            } finally {
                setInvLoading(false);
            }
        };
        fetchInvoices();
    }, [orgId, projectId]);

    if (invLoading) return (
        <div className="text-xs text-gray-400 flex items-center gap-2 mt-2">
            <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            Loading invoices...
        </div>
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Sent': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className='space-y-2 mt-3'>
            {invoices.length > 0 ? (
                invoices.map((invoice) => (
                    <div 
                        key={invoice._id}
                        onClick={() => navigate(`/dashboard/invoices/${orgId}/${invoice._id}`)} 
                        className="flex justify-between items-center p-2.5 bg-white border border-gray-200 rounded-lg hover:border-[#4A90E2] hover:shadow-sm transition-all cursor-pointer group"
                    >
                        <span className='text-xs font-semibold text-gray-700 flex items-center group-hover:text-[#4A90E2]'>
                            <CurrencyDollarIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400 group-hover:text-[#4A90E2]" />
                            #{invoice.invoiceNo}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusStyle(invoice.status)}`}>
                            {invoice.status}
                        </span>
                    </div>
                ))
            ) : (
                <div className="text-xs text-gray-400 italic pl-1 py-1 border border-dashed border-gray-200 rounded bg-gray-50/50 text-center">
                    No invoices found
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---
function OrganizationOverview() {
    const { id } = useParams();
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [uploadingProjectDoc, setUploadingProjectDoc] = useState(null);
    const [projectDocFiles, setProjectDocFiles] = useState([]);
    const [projectDocType, setProjectDocType] = useState('Other');
    
    const [showAddProject, setShowAddProject] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        status: 'Initiated',
        currentStage: 'Planning',
        done: [],
        todo: [],
        contactPerson: { role: '', name: '', email: '', phone: '' },
    });
    const [addingProject, setAddingProject] = useState(false);
    const navigate = useNavigate();

    const fetchOrganization = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/organizations/${id}`);
            setOrganization(response.data);
        } catch (err) {
            setError("Failed to fetch organization details.");
            console.error("Error fetching organization:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganization();
    }, [id]);

    const handleEdit = () => navigate(`/dashboard/organizations/edit/${id}`);

    const handleDelete = async () => {
        if (window.confirm(`Delete ${organization.name}? This action cannot be undone.`)) {
            try {
                await axios.delete(`${API_BASE_URL}/api/organizations/${id}`);
                toast.success('Organization deleted successfully!');
                navigate('/dashboard/organization'); 
            } catch (err) {
                toast.error('Failed to delete organization.');
            }
        }
    };

    const handleProjectDocUpload = async (projectId) => {
         if (!projectDocFiles.length) return toast.error('Select files first.');
         setUploadingProjectDoc(projectId);
         try {
            const formData = new FormData();
            formData.append('documentType', projectDocType);
            projectDocFiles.forEach(file => formData.append('files', file));
            await axios.post(`${API_BASE_URL}/api/organizations/${id}/projects/${projectId}/documents`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Documents uploaded successfully');
            setProjectDocFiles([]);
            setProjectDocType('Other');
            fetchOrganization();
         } catch(e) { 
             console.error(e);
             toast.error('Upload failed'); 
         } finally { 
             setUploadingProjectDoc(null); 
         }
    };

    const handleNewProjectChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('contactPerson.')) {
            const field = name.split('.')[1];
            setNewProject(prev => ({ ...prev, contactPerson: { ...prev.contactPerson, [field]: value } }));
        } else if (name === 'done' || name === 'todo') {
            setNewProject(prev => ({ ...prev, [name]: value.split('\n').filter(t => t.trim()) }));
        } else {
            setNewProject(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        setAddingProject(true);
        try {
            await axios.post(`${API_BASE_URL}/api/organizations/${id}/projects`, newProject);
            toast.success('Project initialized successfully');
            // Reset form
            setNewProject({
                name: '',
                description: '',
                status: 'Initiated',
                currentStage: 'Planning',
                done: [],
                todo: [],
                contactPerson: { role: '', name: '', email: '', phone: '' },
            });
            setShowAddProject(false);
            fetchOrganization();
        } catch(e) { 
            console.error(e);
            toast.error('Failed to add project'); 
        } finally { 
            setAddingProject(false); 
        }
    };

    const handleDeleteProject = async (projectId) => {
        if(window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/organizations/${id}/projects/${projectId}`);
                toast.success('Project deleted');
                fetchOrganization();
            } catch(e) { 
                console.error(e);
                toast.error('Deletion failed'); 
            }
        }
    }

    const handleProjectFileChange = (e) => setProjectDocFiles(Array.from(e.target.files));
    const removeProjectFile = (i) => setProjectDocFiles(prev => prev.filter((_, idx) => idx !== i));


    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90E2]"></div>
                <span className="text-sm text-gray-500">Loading Profile...</span>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="p-8 text-center">
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg inline-block border border-red-200">
                {error}
            </div>
        </div>
    );

    const statusStyle = {
        'Active': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'Inactive': 'bg-gray-100 text-gray-800 border-gray-200',
        'Lead': 'bg-amber-100 text-amber-800 border-amber-200',
    };

    const projectStatusStyle = {
        'Initiated': 'bg-amber-50 text-amber-700 border-amber-200',
        'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
        'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'On Hold': 'bg-gray-50 text-gray-700 border-gray-200',
    };

    return (
        <div className="p-6 max-w-7xl mx-auto font-second">
            {/* Header Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-start gap-5">
                        <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shadow-inner">
                            <BuildingOffice2Icon className='h-10 w-10' />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-main text-gray-900">{organization.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 mt-3">
                                <span className={`px-3 py-0.5 text-xs font-bold uppercase tracking-wide rounded-full border ${statusStyle[organization.status]}`}>
                                    {organization.status}
                                </span>
                                <div className="flex items-center text-sm text-gray-500">
                                    <MapPinIcon className='h-4 w-4 mr-1.5 text-gray-400' />
                                    {organization.address || "No address on file"}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#4A90E2] hover:border-[#4A90E2] transition-all shadow-sm">
                            <PencilIcon className="h-4 w-4" /> Edit
                        </button>
                        <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm">
                            <TrashIcon className="h-4 w-4" /> Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-8 border-b border-gray-200">
                <nav className="flex space-x-8">
                    {['Overview', 'Contacts', 'Documents', 'Projects'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.toLowerCase()
                                    ? 'border-[#4A90E2] text-[#4A90E2]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab}
                            {tab === 'Projects' && <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{organization.projects.length}</span>}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                
                {/* --- OVERVIEW TAB --- */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Organization Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-600">Total Projects</span>
                                    <span className="text-lg font-bold text-gray-900">{organization.projects.length}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-600">Key Contacts</span>
                                    <span className="text-lg font-bold text-gray-900">{organization.contactDetails.length}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-600">Documents</span>
                                    <span className="text-lg font-bold text-gray-900">{organization.documents.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- CONTACTS TAB --- */}
                {activeTab === 'contacts' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {organization.contactDetails.map((contact, index) => (
                            <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-full bg-[#4A90E2]/10 text-[#4A90E2] flex items-center justify-center border border-[#4A90E2]/20">
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{contact.name}</h4>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">{contact.role}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                                        <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                                        {contact.email}
                                    </div>
                                    <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                                        <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                                        {contact.phone}
                                    </div>
                                </div>
                            </div>
                        ))}
                         {organization.contactDetails.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
                                No contacts listed for this organization.
                            </div>
                         )}
                    </div>
                )}

                {/* --- DOCUMENTS TAB --- */}
                {activeTab === 'documents' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {organization.documents.map((doc, index) => (
                            <a key={index} href={`${API_BASE_URL}${doc.url}`} target="_blank" rel="noopener noreferrer" 
                               className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-[#4A90E2] hover:shadow-sm transition-all group"
                            >
                                <div className="mr-4 p-2.5 bg-gray-100 rounded-lg text-gray-500 group-hover:bg-blue-50 group-hover:text-[#4A90E2] transition-colors">
                                    <DocumentTextIcon className="h-6 w-6" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-500 mt-1 inline-block border border-gray-200">{doc.documentType}</span>
                                </div>
                            </a>
                        ))}
                         {organization.documents.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
                                <FolderOpenIcon className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                                No organization-level documents found.
                            </div>
                         )}
                    </div>
                )}

                {/* --- PROJECTS TAB --- */}
                {activeTab === 'projects' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Active Projects</h3>
                            <button onClick={() => setShowAddProject(!showAddProject)} className="text-sm font-medium text-white bg-[#4A90E2] hover:bg-[#357ABD] px-4 py-2 rounded-lg shadow-sm flex items-center transition-colors">
                                <PlusIcon className="h-4 w-4 mr-2" /> {showAddProject ? 'Cancel Creation' : 'Initiate Project'}
                            </button>
                        </div>

                        {showAddProject && (
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 animate-fadeIn">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">New Project Parameters</h4>
                                <form onSubmit={handleAddProject} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Project Name</label>
                                            <input className="block w-full p-2.5 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm" placeholder="e.g. Q3 Marketing Campaign" name="name" value={newProject.name} onChange={handleNewProjectChange} required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                            <input className="block w-full p-2.5 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm" placeholder="Brief objective..." name="description" value={newProject.description} onChange={handleNewProjectChange} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                                            <select className="block w-full p-2.5 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm" name="status" value={newProject.status} onChange={handleNewProjectChange}>
                                                {['Initiated', 'In Progress', 'On Hold', 'Completed'].map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Current Stage</label>
                                            <input className="block w-full p-2.5 rounded-lg border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2] sm:text-sm" placeholder="e.g. Requirement Gathering" name="currentStage" value={newProject.currentStage} onChange={handleNewProjectChange} />
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">Project Lead Contact</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <input className="p-2 rounded border-gray-300 text-sm" placeholder="Role" name="contactPerson.role" value={newProject.contactPerson.role} onChange={handleNewProjectChange} required />
                                            <input className="p-2 rounded border-gray-300 text-sm" placeholder="Name" name="contactPerson.name" value={newProject.contactPerson.name} onChange={handleNewProjectChange} required />
                                            <input className="p-2 rounded border-gray-300 text-sm" placeholder="Email" name="contactPerson.email" value={newProject.contactPerson.email} onChange={handleNewProjectChange} />
                                            <input className="p-2 rounded border-gray-300 text-sm" placeholder="Phone" name="contactPerson.phone" value={newProject.contactPerson.phone} onChange={handleNewProjectChange} />
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end">
                                        <button disabled={addingProject} className="px-6 py-2.5 bg-[#4A90E2] text-white text-sm font-medium rounded-lg hover:bg-[#357ABD] shadow-sm transition-colors">
                                            {addingProject ? 'Creating Project...' : 'Initialize Project'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                            {organization.projects.map((project) => (
                                <div key={project._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                                    {/* Project Header */}
                                    <div className="p-5 border-b border-gray-100 bg-gray-50/30 flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-lg font-bold text-gray-900">{project.name}</h4>
                                                <span className={`px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full border ${projectStatusStyle[project.status]}`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 max-w-2xl">{project.description || "No description provided."}</p>
                                        </div>
                                        <button onClick={() => handleDeleteProject(project._id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete Project">
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Column 1: Status & Contact */}
                                        <div className="space-y-5">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Execution Status</p>
                                                <div className="space-y-2 bg-white">
                                                    <div className="flex items-start gap-2 text-sm p-2 rounded border border-green-100 bg-green-50/50">
                                                        <CheckCircleIcon className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                                        <div className='text-gray-700'>
                                                            <span className="font-semibold text-green-700">Completed:</span> 
                                                            <span className="ml-1">{project.done.length > 0 ? project.done.join(', ') : 'No tasks completed'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2 text-sm p-2 rounded border border-amber-100 bg-amber-50/50">
                                                        <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                                        <div className='text-gray-700'>
                                                            <span className="font-semibold text-amber-700">Pending:</span> 
                                                            <span className="ml-1">{project.todo.length > 0 ? project.todo.join(', ') : 'No pending tasks'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Project Lead</p>
                                                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                                                        <UserIcon className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{project.contactPerson.name}</p>
                                                        <p className="text-xs text-gray-500">{project.contactPerson.role}</p>
                                                    </div>
                                                 </div>
                                            </div>
                                        </div>

                                        {/* Column 2: Documents */}
                                        <div className="lg:col-span-1 border-l border-gray-100 pl-6 lg:border-l">
                                            <div className="flex justify-between items-center mb-3">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Documents</p>
                                                <button onClick={() => setUploadingProjectDoc(uploadingProjectDoc === project._id ? null : project._id)} className="text-xs text-[#4A90E2] hover:text-[#357ABD] font-semibold hover:underline">
                                                    {uploadingProjectDoc === project._id ? 'Cancel' : '+ Upload New'}
                                                </button>
                                            </div>
                                            
                                            {uploadingProjectDoc === project._id && (
                                                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 animate-fadeIn">
                                                    <input type="file" multiple onChange={handleProjectFileChange} className="block w-full text-xs text-gray-500 mb-2 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-white file:text-blue-500 hover:file:bg-blue-100"/>
                                                    <select className="block w-full text-xs p-1.5 mb-2 border border-blue-200 rounded bg-white text-gray-700 focus:outline-none focus:border-blue-400" value={projectDocType} onChange={(e) => setProjectDocType(e.target.value)}>
                                                        {['UAT', 'PROD', 'Contract', 'Invoice', 'Other'].map(t => <option key={t}>{t}</option>)}
                                                    </select>
                                                    <button onClick={() => handleProjectDocUpload(project._id)} className="w-full bg-[#4A90E2] text-white text-xs py-1.5 rounded font-medium hover:bg-[#357ABD] transition-colors">Confirm Upload</button>
                                                </div>
                                            )}

                                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                                {project.documents.length > 0 ? project.documents.map((doc, i) => (
                                                    <a key={i} href={`${API_BASE_URL}${doc.url}`} target="_blank" className="flex items-center p-2.5 rounded-lg bg-white border border-gray-200 hover:border-[#4A90E2] hover:shadow-sm transition-all group">
                                                        <DocumentTextIcon className="h-4 w-4 mr-2 text-gray-400 group-hover:text-[#4A90E2]" />
                                                        <span className="truncate flex-1 text-xs font-medium text-gray-700">{doc.fileName}</span>
                                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-2 uppercase font-semibold">{doc.documentType}</span>
                                                        <ArrowDownTrayIcon className="h-3 w-3 text-gray-300 ml-2 opacity-0 group-hover:opacity-100" />
                                                    </a>
                                                )) : <div className="text-xs text-gray-400 italic p-2 text-center border border-dashed border-gray-200 rounded bg-gray-50">No documents attached</div>}
                                            </div>
                                        </div>

                                        {/* Column 3: Invoicing */}
                                        <div className="lg:col-span-1 border-l border-gray-100 pl-6">
                                            <div className="flex justify-between items-center mb-3">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                    Financials
                                                </p>
                                                <button 
                                                    onClick={() => navigate(`/dashboard/organizations/${id}/projects/${project._id}/invoice/new`)}
                                                    className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100 font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                                                >
                                                    <PlusIcon className="h-3 w-3" /> Invoice
                                                </button>
                                            </div>
                                            <InvoiceList projectId={project._id} orgId={id} navigate={navigate} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                             {organization.projects.length === 0 && !showAddProject && (
                                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <BriefcaseIcon className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                                    <p className="text-gray-500 font-medium">No active projects associated with this organization.</p>
                                </div>
                             )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrganizationOverview;