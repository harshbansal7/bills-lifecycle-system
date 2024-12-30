import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import { SUB_DIVISIONS } from '../utils/constants';

const EditEmployee = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    employee_id: '',
    name: '',
    father_name: '',
    designation: '',
    status: 'WORKING',
    sub_division: '',
    phone: '',
    bank_account: '',
    bank_name: '',
    bank_branch: '',
    retirement_date: '',
    life_status: 'ALIVE',
    death_date: '',
    dependents: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await api.getEmployee(employeeId);
        setEmployee(data);
      } catch (err) {
        setError('Failed to fetch employee details');
      }
    };
    fetchEmployee();
  }, [employeeId]);

  const addDependent = () => {
    if (employee.dependents.length < 4) {
      setEmployee(prev => ({
        ...prev,
        dependents: [...prev.dependents, { name: '', relation: '' }]
      }));
    }
  };

  const removeDependent = (index) => {
    setEmployee(prev => ({
      ...prev,
      dependents: prev.dependents.filter((_, i) => i !== index)
    }));
  };

  const handleDependentChange = (index, field, value) => {
    setEmployee(prev => {
      const updatedDependents = [...prev.dependents];
      updatedDependents[index] = {
        ...updatedDependents[index],
        [field]: value
      };
      return { ...prev, dependents: updatedDependents };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredDependents = employee.dependents.filter(
        dep => dep.name && dep.relation
      );
      
      const { _id, ...employeeData } = employee;
      
      await api.updateEmployee(employeeId, {
        ...employeeData,
        dependents: filteredDependents
      });
      setSuccess('Employee updated successfully');
      setTimeout(() => navigate('/employees'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update employee');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Employee</h1>
        
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={employee.employee_id}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={employee.name}
                  onChange={(e) => setEmployee(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Name
                </label>
                <input
                  type="text"
                  value={employee.father_name}
                  onChange={(e) => setEmployee(prev => ({ ...prev, father_name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={employee.designation}
                  onChange={(e) => setEmployee(prev => ({ ...prev, designation: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={employee.status}
                  onChange={(e) => setEmployee(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="WORKING">Working</option>
                  <option value="RETIRED">Retired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Division
                </label>
                <select
                  value={employee.sub_division || ''}
                  onChange={(e) => setEmployee(prev => ({ ...prev, sub_division: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Sub Division</option>
                  {Object.values(SUB_DIVISIONS).map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={employee.phone}
                  onChange={(e) => setEmployee(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={employee.bank_account}
                  onChange={(e) => setEmployee(prev => ({ ...prev, bank_account: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={employee.bank_name}
                  onChange={(e) => setEmployee(prev => ({ ...prev, bank_name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Branch
                </label>
                <input
                  type="text"
                  value={employee.bank_branch}
                  onChange={(e) => setEmployee(prev => ({ ...prev, bank_branch: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {employee.status === 'RETIRED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Retirement
                  </label>
                  <input
                    type="date"
                    value={employee.retirement_date}
                    onChange={(e) => setEmployee(prev => ({ ...prev, retirement_date: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Life Status
                </label>
                <select
                  value={employee.life_status}
                  onChange={(e) => setEmployee(prev => ({ ...prev, life_status: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="ALIVE">Alive</option>
                  <option value="DECEASED">Deceased</option>
                </select>
              </div>

              {employee.life_status === 'DECEASED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Death
                  </label>
                  <input
                    type="date"
                    value={employee.death_date}
                    onChange={(e) => setEmployee(prev => ({ ...prev, death_date: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Dependents</h2>
              {employee.dependents.length < 4 && (
                <button
                  type="button"
                  onClick={addDependent}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Dependent
                </button>
              )}
            </div>

            <div className="space-y-4">
              {employee.dependents.map((dependent, index) => (
                <div key={index} className="relative bg-white p-4 rounded-lg border border-gray-200">
                  {index !== 0 && ( // Don't allow removing self
                    <button
                      type="button"
                      onClick={() => removeDependent(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={dependent.name}
                        onChange={(e) => handleDependentChange(index, 'name', e.target.value)}
                        disabled={index === 0} // Disable editing self
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                          index === 0 ? 'bg-gray-100' : 'focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relation
                      </label>
                      <input
                        type="text"
                        value={dependent.relation}
                        onChange={(e) => handleDependentChange(index, 'relation', e.target.value)}
                        disabled={index === 0} // Disable editing self
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                          index === 0 ? 'bg-gray-100' : 'focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee; 