import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import { HOSPITALS } from '../utils/constants';

const CreateBill = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDependent, setSelectedDependent] = useState(null);
  const [formData, setFormData] = useState({
    bill_number: '',
    receipt_date: '',
    employee_id: '',
    employee_name: '',
    dependent_name: '',
    relationship: '',
    treatment_period_from: '',
    treatment_period_to: '',
    amount_claimed: '',
    hospital: ''
  });

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await api.getEmployees();
        setEmployees(data);
      } catch (err) {
        setError('Failed to fetch employees');
      }
    };
    fetchEmployees();
  }, []);

  const handleEmployeeSelect = (employeeId) => {
    const employee = employees.find(emp => emp.employee_id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setSelectedDependent(null);
      setFormData(prev => ({
        ...prev,
        employee_id: employee.employee_id,
        employee_name: employee.name,
        dependent_name: '',
        relationship: ''
      }));
    }
  };

  const handleDependentSelect = (dependentName) => {
    const dependent = selectedEmployee.dependents.find(d => d.name === dependentName);
    if (dependent) {
      setSelectedDependent(dependent);
      setFormData(prev => ({
        ...prev,
        dependent_name: dependent.name,
        relationship: dependent.relation
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.createBill(formData);
      navigate('/bills');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/bills')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Bills
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Medical Bill</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the details of the new medical bill below.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Bill Details Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Bill Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">
                    Bill Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bill_number"
                    value={formData.bill_number}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">
                    Receipt Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="receipt_date"
                    value={formData.receipt_date}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Employee Selection */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Employee Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="form-label">
                    Select Employee <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.employee_id}
                    onChange={(e) => handleEmployeeSelect(e.target.value)}
                    required
                    className="form-input"
                  >
                    <option value="">Select employee</option>
                    {employees.map((employee) => (
                      <option key={employee.employee_id} value={employee.employee_id}>
                        {employee.name} ({employee.employee_id}) - {employee.sub_division}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedEmployee && (
                  <div className="col-span-2">
                    <label className="form-label">
                      Select Dependent <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.dependent_name}
                      onChange={(e) => handleDependentSelect(e.target.value)}
                      required
                      className="form-input"
                    >
                      <option value="">Choose a dependent</option>
                      {selectedEmployee.dependents?.map((dependent, index) => (
                        <option key={index} value={dependent.name}>
                          {dependent.name} ({dependent.relation})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Treatment Details Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Treatment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">
                    Treatment Period From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="treatment_period_from"
                    value={formData.treatment_period_from}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">
                    Treatment Period To <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="treatment_period_to"
                    value={formData.treatment_period_to}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">
                    Amount Claimed <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
                    <input
                      type="number"
                      name="amount_claimed"
                      value={formData.amount_claimed}
                      onChange={handleChange}
                      required
                      className="form-input pl-8"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">
                    Hospital <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select hospital</option>
                    {HOSPITALS.map((hospital) => (
                      <option key={hospital} value={hospital}>
                        {hospital}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/bills')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBill; 