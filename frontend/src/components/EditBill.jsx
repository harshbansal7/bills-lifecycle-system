import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { HOSPITALS } from '../utils/constants';

const EditBill = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [bill, setBill] = useState({
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actualBillId = typeof billId === 'object' ? billId.$oid : billId;
        const [billData, employeesData] = await Promise.all([
          api.getBill(actualBillId),
          api.getEmployees()
        ]);

        const formattedBill = {
          ...billData,
          receipt_date: billData.receipt_date?.split('T')[0],
          treatment_period_from: billData.treatment_period_from?.split('T')[0],
          treatment_period_to: billData.treatment_period_to?.split('T')[0],
        };

        setBill(formattedBill);
        setEmployees(employeesData);
        const employee = employeesData.find(emp => emp.employee_id === billData.employee_id);
        setSelectedEmployee(employee);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      }
    };
    fetchData();
  }, [billId]);

  const handleEmployeeSelect = (employeeId) => {
    const employee = employees.find(emp => emp.employee_id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setBill(prev => ({
        ...prev,
        employee_id: employee.employee_id,
        employee_name: employee.name
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Create a clean copy of bill data without _id
        const billData = { ...bill };
        delete billData._id;
        
        await api.updateBill(billId, billData);
        setSuccess('Bill updated successfully');
        setTimeout(() => navigate('/bills'), 1500);
    } catch (err) {
        setError(err.response?.data?.error || 'Failed to update bill');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Bill</h1>
        
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bill Number
                </label>
                <input
                  type="text"
                  value={bill.bill_number}
                  onChange={(e) => setBill(prev => ({ ...prev, bill_number: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receipt Date
                </label>
                <input
                  type="date"
                  value={bill.receipt_date?.split('T')[0]}
                  onChange={(e) => setBill(prev => ({ ...prev, receipt_date: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee
                </label>
                <select
                  value={bill.employee_id}
                  onChange={(e) => handleEmployeeSelect(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.employee_id} value={employee.employee_id}>
                      {employee.name} ({employee.employee_id})
                    </option>
                  ))}
                </select>
              </div>

              {selectedEmployee && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dependent
                  </label>
                  <select
                    value={bill.dependent_name}
                    onChange={(e) => {
                      const dependent = selectedEmployee.dependents.find(d => d.name === e.target.value);
                      setBill(prev => ({
                        ...prev,
                        dependent_name: e.target.value,
                        relationship: dependent?.relation || ''
                      }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select Patient</option>
                    {selectedEmployee.dependents.map((dependent, index) => (
                      <option key={index} value={dependent.name}>
                        {dependent.name} ({dependent.relation})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment Period From
                </label>
                <input
                  type="date"
                  value={bill.treatment_period_from?.split('T')[0]}
                  onChange={(e) => setBill(prev => ({ ...prev, treatment_period_from: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment Period To
                </label>
                <input
                  type="date"
                  value={bill.treatment_period_to?.split('T')[0]}
                  onChange={(e) => setBill(prev => ({ ...prev, treatment_period_to: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Claimed
                </label>
                <input
                  type="number"
                  value={bill.amount_claimed}
                  onChange={(e) => setBill(prev => ({ ...prev, amount_claimed: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital
                </label>
                <select
                  value={bill.hospital}
                  onChange={(e) => setBill(prev => ({ ...prev, hospital: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select Hospital</option>
                  {HOSPITALS.map((hospital) => (
                    <option key={hospital} value={hospital}>
                      {hospital}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/bills')}
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

export default EditBill; 