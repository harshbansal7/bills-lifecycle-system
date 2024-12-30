import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import FilterPanel from './FilterPanel';
import { formatDate, formatAmount } from '../utils/formatters';

const BillList = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const fetchBills = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await api.filterBills(filters);
      setBills(data);
    } catch (err) {
      setError('Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleFilter = (filters) => {
    fetchBills(filters);
  };

  const handleReset = () => {
    fetchBills();
  };

  const handleDelete = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await api.deleteBill(billId);
        setSuccess('Bill deleted successfully');
        fetchBills();
      } catch (err) {
        setError('Failed to delete bill');
      }
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Medical Bills</h1>
          <button
            onClick={() => navigate('/bills/create')}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Bill
          </button>
        </div>

        <div className="mb-8">
          <FilterPanel onFilter={handleFilter} onReset={handleReset} />
        </div>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">{success}</div>
        )}

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill Info
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee/Dependent
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bills.map((bill) => (
                    <tr 
                      key={bill._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {bill.bill_number}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(bill.receipt_date)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {bill.employee_name}
                          <span className="text-xs text-gray-500 ml-1">
                            ({bill.employee_id})
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mr-1"></span>
                          {bill.dependent_name}
                          <span className="text-gray-400 mx-1">•</span>
                          {bill.relationship}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatAmount(bill.amount_claimed)}
                        </div>
                        {bill.latest_approved_amount && (
                          <div className="text-xs text-green-600">
                            Approved: {formatAmount(bill.latest_approved_amount)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col space-y-1">
                          <span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: 'rgba(var(--color-primary-100))', 
                              color: 'rgb(var(--color-primary-800))' 
                            }}
                          >
                            {bill.current_status}
                          </span>
                          {bill.latest_reference_number && (
                            <span className="text-xs text-gray-500">
                              Ref: {bill.latest_reference_number}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/bills/${bill._id.$oid || bill._id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/bills/edit/${bill._id.$oid || bill._id}`)}
                            className="text-primary-600 hover:text-primary-900 p-1"
                            title="Edit Bill"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(bill._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete Bill"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bills.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                        No bills found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillList; 