import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchEmployees = async () => {
    try {
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (err) {
      setError('Failed to fetch employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.deleteEmployee(employeeId);
        setSuccess('Employee deleted successfully');
        fetchEmployees();
      } catch (err) {
        setError('Failed to delete employee');
      }
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Employee Management</h1>
          <button
            onClick={() => navigate('/employees/create')}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Employee
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">{success}</div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact & Division
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Dependents
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr 
                    key={employee.employee_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {employee.employee_id}
                      </div>
                      <div className="text-xs text-gray-500">
                        {employee.father_name && `S/o ${employee.father_name}`}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {employee.designation}
                      </div>
                      <div className="text-xs text-gray-500">
                        {employee.sub_division}
                      </div>
                      {employee.phone && (
                        <div className="text-xs text-gray-500">
                          📞 {employee.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${String(employee.status) === 'WORKING' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {String(employee.status)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({Array.isArray(employee.dependents) ? employee.dependents.length : 0} dependents)
                        </span>
                      </div>
                      {Array.isArray(employee.dependents) && employee.dependents.length > 0 && (
                        <div className="mt-1 text-xs text-gray-500">
                          {employee.dependents.map((dep, idx) => (
                            <div key={idx} className="flex items-center">
                              <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mr-1"></span>
                              {dep.name}
                              <span className="text-gray-400 mx-1">•</span>
                              {dep.relation}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/employees/edit/${employee.employee_id}`)}
                          className="text-primary-600 hover:text-primary-900 p-1"
                          title="Edit Employee"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.employee_id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Employee"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList; 