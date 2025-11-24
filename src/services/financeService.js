import axios from 'axios';

// Use the environment variable + /api suffix
const API_URL = `${import.meta.env.VITE_BACKEND_URL}api`;

// --- General Ledger ---
export const getAccounts = async () => {
  const response = await axios.get(`${API_URL}/finance/accounts`);
  return response.data;
};

export const createAccount = async (accountData) => {
  const response = await axios.post(`${API_URL}/finance/accounts`, accountData);
  return response.data;
};

// --- Reporting ---
export const getTrialBalance = async () => {
  const response = await axios.get(`${API_URL}/finance/reports/trial-balance`);
  return response.data;
};

// --- HR & Payroll ---
export const runPayroll = async (month, year) => {
  const response = await axios.post(`${API_URL}/hr/run`, { month, year });
  return response.data;
};

export const getEmployees = async () => {
  const response = await axios.get(`${API_URL}/hr/employees`);
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await axios.post(`${API_URL}/hr/employees`, employeeData);
  return response.data;
};

// --- Expense Management ---
export const getExpenses = async () => {
  const response = await axios.get(`${API_URL}/finance/expenses`);
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await axios.post(`${API_URL}/finance/expenses`, expenseData);
  return response.data;
};