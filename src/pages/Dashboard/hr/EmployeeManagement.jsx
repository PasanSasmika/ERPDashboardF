import React, { useState, useEffect } from 'react';
import { UserPlusIcon, UsersIcon } from "@heroicons/react/24/solid";
import { getEmployees, createEmployee } from '../../../services/financeService';
import toast from 'react-hot-toast';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEmp, setNewEmp] = useState({
    firstName: '', lastName: '', email: '', designation: '',
    basicSalary: 0, allowances: 0,
    bankName: '', accountNumber: ''
  });

  useEffect(() => { loadEmployees(); }, []);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) { toast.error("Failed to load employees"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEmployee(newEmp);
      toast.success("Employee added!");
      setShowModal(false);
      loadEmployees();
      setNewEmp({ firstName: '', lastName: '', email: '', designation: '', basicSalary: 0, allowances: 0 });
    } catch (err) { toast.error("Failed to add employee"); }
  };

  const handleChange = (e) => setNewEmp({ ...newEmp, [e.target.name]: e.target.value });

  return (
    <div className="p-6 max-w-7xl mx-auto font-second">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UsersIcon className="h-7 w-7 text-[#4A90E2]" /> Staff Directory
        </h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#4A90E2] text-white px-4 py-2 rounded-lg hover:bg-[#357ABD]">
          <UserPlusIcon className="h-5 w-5" /> Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div key={emp._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                {emp.firstName[0]}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{emp.firstName} {emp.lastName}</h3>
                <p className="text-sm text-gray-500">{emp.designation}</p>
              </div>
            </div>
            <div className="border-t pt-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Basic Salary:</span>
                <span className="font-mono font-medium">{Number(emp.basicSalary).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Allowances:</span>
                <span className="font-mono font-medium">{Number(emp.allowances).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold text-emerald-600">
                <span>Gross Pay:</span>
                <span>{(Number(emp.basicSalary) + Number(emp.allowances)).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input name="firstName" placeholder="First Name" onChange={handleChange} className="border p-2 rounded" required />
              <input name="lastName" placeholder="Last Name" onChange={handleChange} className="border p-2 rounded" required />
              <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border p-2 rounded" required />
              <input name="designation" placeholder="Designation" onChange={handleChange} className="border p-2 rounded" required />
              
              <div className="col-span-2 border-t pt-4 mt-2">
                <h3 className="font-bold text-gray-700 mb-2">Financials</h3>
              </div>
              <input name="basicSalary" type="number" placeholder="Basic Salary" onChange={handleChange} className="border p-2 rounded" required />
              <input name="allowances" type="number" placeholder="Allowances" onChange={handleChange} className="border p-2 rounded" />
              
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#4A90E2] text-white rounded">Save Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default EmployeeManagement;