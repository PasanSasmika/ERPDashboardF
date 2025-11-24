import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import {MagnifyingGlassIcon, Squares2X2Icon,BriefcaseIcon, UsersIcon, DocumentDuplicateIcon,ArrowLeftOnRectangleIcon, BuildingOffice2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  UserGroupIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline"; 
import { 
  Squares2X2Icon as SquaresSolid,
  BriefcaseIcon as BriefcaseSolid,
  UsersIcon as UsersSolid,
  DocumentDuplicateIcon as DocSolid,
  BuildingOffice2Icon as BuildingSolid
} from "@heroicons/react/24/solid"; 

import ProjectOverview from "./project/ProjectOverview";
import Project from "./project/Project";
import Addproject from "./project/Addproject";
import DashboardContent from "./DashboardContent/DashboardContent";
import Customer from "./customers/Customer";
import Addcustomer from "./customers/AddCustomer";
import CustomerOverview from "./customers/CustomerOverview";
import EditProject from "./project/EditProject";
import Resources from "./Resources/Resources";
import AddResources from "./Resources/AddResources";
import ResourceOverview from "./Resources/ResourcesOverview";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "/logo.png";
import Profile from "../profile/Profile";
import Organization from "./Organizations/organizations";
import AddOrganization from "./Organizations/addorganizations";
import OrganizationOverview from "./Organizations/organizationOverview";
import EditOrganization from "./Organizations/editOrganization";
import EditCustomers from "./customers/EditCustomers";
import AddInvoice from "./invoicing/AddInvoice";
import InvoicePreview from "./invoicing/InvoicePreview";
import { CalculatorIcon } from "lucide-react";
import PayrollRun from "./hr/PayrollRun";
import TrialBalance from "./finance/TrialBalance";
import ChartOfAccounts from "./finance/ChartOfAccounts";
import EmployeeManagement from "./hr/EmployeeManagement";
import ExpenseManagement from "./hr/ExpenseManagement";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ; 
function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [user, setUser] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    projects: [],
    customers: [],
    resources: [],
    organizations: [], 
  });
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // To track active route

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults({ projects: [], customers: [], resources: [] });
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery.trim())}`
        );
        setSearchResults(response.data);
      } catch (err) {
        console.error("Error fetching search results:", err);
        // toast.error("Failed to fetch search results."); // Optional: suppress to avoid spamming on type
        setSearchResults({ projects: [], customers: [], resources: [] });
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success("Logged out successfully!");
    setShowLogoutPopup(false);
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Squares2X2Icon, activeIcon: SquaresSolid },
    { name: "Projects", path: "/dashboard/projects", icon: BriefcaseIcon, activeIcon: BriefcaseSolid },
    { name: "Organizations", path: "/dashboard/organization", icon: BuildingOffice2Icon, activeIcon: BuildingSolid },
    { name: "Customers", path: "/dashboard/customers", icon: UsersIcon, activeIcon: UsersSolid },
    { name: "Resources", path: "/dashboard/resources", icon: DocumentDuplicateIcon, activeIcon: DocSolid },

    { name: "Chart of Accounts", path: "/dashboard/finance/accounts", icon: CalculatorIcon, activeIcon: CalculatorIcon },
    { name: "Financial Reports", path: "/dashboard/finance/reports", icon: ClipboardDocumentListIcon, activeIcon: ClipboardDocumentListIcon },
    { name: "Payroll", path: "/dashboard/hr/payroll", icon: BanknotesIcon, activeIcon: BanknotesIcon },
    { name: "Expenses", path: "/dashboard/finance/expenses", icon: ReceiptPercentIcon, activeIcon: ReceiptPercentIcon },
  { name: "Employees", path: "/dashboard/hr/employees", icon: UserGroupIcon, activeIcon: UserGroupIcon },
  ];

  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-second overflow-hidden">
      
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 z-20 transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? "w-72" : "w-20"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
                <img src={logo} alt="Logo" className="h-8 w-8 rounded-lg object-cover shrink-0" />
                <span className={`font-main font-bold text-xl text-gray-900 transition-opacity duration-300 ${
                    isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
                }`}>
                    Vogue<span className="text-[#4A90E2]"> Software</span>
                </span>
            </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {sidebarLinks.map((link) => {
                const active = isActive(link.path);
                const Icon = active ? link.activeIcon : link.icon;
                
                return (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                            active 
                                ? "bg-[#4A90E2]/10 text-[#4A90E2]" 
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                        <Icon className={`h-6 w-6 shrink-0 transition-colors ${active ? "text-[#4A90E2]" : "text-gray-400 group-hover:text-gray-600"}`} />
                        
                        <span className={`font-medium whitespace-nowrap transition-all duration-300 ${
                            isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute pointer-events-none"
                        }`}>
                            {link.name}
                        </span>

                        {/* Tooltip for closed state */}
                        {!isSidebarOpen && (
                            <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                                {link.name}
                            </div>
                        )}
                    </Link>
                );
            })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-100 space-y-1">
             <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors group ${!isSidebarOpen && 'justify-center'}`}
            >
                <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0" />
                {isSidebarOpen && <span className="font-medium">Logout</span>}
            </button>
            
            <button
                onClick={toggleSidebar}
                className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors mt-2"
            >
                {isSidebarOpen ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
            </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
            {/* Search Area */}
            <div className="flex-1 max-w-2xl relative">
                <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search workspace..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/20 focus:border-[#4A90E2] transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Search Results Dropdown */}
                {searchQuery && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-[400px] overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-100">
                        {isSearching ? (
                            <div className="p-8 text-center text-gray-500 text-sm">Searching...</div>
                        ) : (
                            <div className="py-2">
                                {searchResults.projects.length === 0 &&
                                 searchResults.customers.length === 0 &&
                                 searchResults.resources.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">No results found.</div>
                                ) : (
                                    <>
                                        {['projects', 'customers', 'resources'].map(category => {
                                            if (searchResults[category].length === 0) return null;
                                            return (
                                                <div key={category} className="mb-2 last:mb-0">
                                                    <h3 className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                                                        {category}
                                                    </h3>
                                                    {searchResults[category].map(item => (
                                                        <Link
                                                            key={item._id}
                                                            to={`/dashboard/${category}/${item._id}`}
                                                            className="flex items-center px-4 py-2 hover:bg-blue-50 text-sm text-gray-700 transition-colors"
                                                            onClick={() => setSearchQuery("")}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6 ml-4">
                <div className="h-6 w-px bg-gray-200"></div>

                <Link to="/dashboard/profile" className="flex items-center gap-3 group">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-gray-900 leading-none">{user?.firstName || 'User'}</p>
                        <p className="text-xs text-gray-500 mt-1">Administrator</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-[#4A90E2] text-white flex items-center justify-center text-sm font-bold ring-2 ring-transparent group-hover:ring-[#4A90E2]/20 transition-all">
                        {user?.firstName?.charAt(0) || 'U'}
                    </div>
                </Link>
            </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8 scroll-smooth">
            <div className="max-w-[1600px] mx-auto min-h-full">
                <Routes>
                    <Route index element={<DashboardContent />} />
                    <Route path="projects" element={<Project />} />
                    <Route path="projects/:id" element={<ProjectOverview />} />
                    <Route path="customers" element={<Customer />} />
                    <Route path="resources" element={<Resources />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="organization" element={<Organization />} />
                    <Route path="addorganization" element={<AddOrganization />} />
                    <Route path="organizations/:id" element={<OrganizationOverview />} />
                    <Route path="addproject" element={<Addproject />} />
                    <Route path="addcustomer" element={<Addcustomer />} />
                    <Route path="addresources" element={<AddResources />} />
                    <Route path="customers/:id" element={<CustomerOverview />} />
                    <Route path="resources/:id" element={<ResourceOverview />} />
                    <Route path="customers/edit/:id" element={<EditCustomers />} />
                    <Route path="projects/edit/:id" element={<EditProject />} />
                    <Route path="organizations/edit/:id" element={<EditOrganization />} />
                    <Route path="organizations/:orgId/projects/:projectId/invoice/new" element={<AddInvoice />} />
                    <Route path="organizations/:orgId/projects/:projectId/invoice/edit/:invoiceId" element={<AddInvoice />} />
                    <Route path="invoices/:orgId/:id" element={<InvoicePreview />} />
                    <Route path="finance/accounts" element={<ChartOfAccounts />} />
                    <Route path="finance/reports" element={<TrialBalance />} />
                    <Route path="hr/payroll" element={<PayrollRun />} />
                    <Route path="hr/employees" element={<EmployeeManagement />} />
                   <Route path="finance/expenses" element={<ExpenseManagement />} />
                </Routes>
            </div>
        </main>

      </div>

      {/* Logout Modal */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4 transform scale-100 transition-all">
            <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <ArrowLeftOnRectangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Sign out?</h3>
                <p className="text-sm text-gray-500 mt-2">Are you sure you want to end your session?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;