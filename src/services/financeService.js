import axios from 'axios';

// Use environment variable or fallback
const API_URL = import.meta.env.VITE_BACKEND_URL ;

// --- FINANCE (Simple Cash Flow) ---

// Add Record (Incoming or Outgoing)
export const addFinanceRecord = async (recordData) => {
  // recordData = { date, description, amount, type }
  const response = await axios.post(`${API_URL}api/finance/add`, recordData);
  return response.data;
};

// Get Report (Profit & Transactions)
export const getFinanceReport = async (month, year) => {
  // e.g. /api/finance/report?month=11&year=2025
  const response = await axios.get(`${API_URL}api/finance/report`, {
    params: { month, year }
  });
  return response.data;
};

// --- HR & PAYROLL ---

// Add Detailed Employee
export const createEmployee = async (formData) => {
  // Must use headers for FormData (file uploads)
  const response = await axios.post(`${API_URL}api/hr/employees`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Get Employee List
export const getEmployees = async () => {
  const response = await axios.get(`${API_URL}api/hr/employees`);
  return response.data;
};

// Get Single Employee (Profile)
export const getEmployeeById = async (id) => {
  const response = await axios.get(`${API_URL}api/hr/employees/${id}`);
  return response.data;
};

// Process Salary (Auto-adds to Finance)
export const processSalary = async (payrollData) => {
  // payrollData = { employeeId, month, amount, authorizedBy }
  const response = await axios.post(`${API_URL}api/hr/process-salary`, payrollData);
  return response.data;
};