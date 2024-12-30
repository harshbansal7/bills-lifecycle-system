import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { STATUS_CONFIG } from '../utils/statusConfig';

const FilterPanel = ({ onFilter, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    bill_number: '',
    employee_id: '',
    employee_name: '',
    status: '',
    date_from: '',
    date_to: '',
    amount_from: '',
    amount_to: '',
    reference_search: {
      status: '',
      number: ''
    },
    hospital: ''
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFilters(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const count = Object.entries(filters).reduce((acc, [key, value]) => {
      if (typeof value === 'object') {
        return acc + Object.values(value).filter(v => v).length;
      }
      return acc + (value ? 1 : 0);
    }, 0);
    setActiveFiltersCount(count);
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      bill_number: '',
      employee_id: '',
      employee_name: '',
      status: '',
      date_from: '',
      date_to: '',
      amount_from: '',
      amount_to: '',
      reference_search: {
        status: '',
        number: ''
      },
      hospital: ''
    });
    setActiveFiltersCount(0);
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700">
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount} active)`}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="border-t border-gray-200">
          <div className="p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Bill Number</label>
                <input
                  type="text"
                  name="bill_number"
                  value={filters.bill_number}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Search bills"
                />
              </div>

              <div>
                <label className="form-label">Employee ID</label>
                <input
                  type="text"
                  name="employee_id"
                  value={filters.employee_id}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Search by ID"
                />
              </div>

              <div>
                <label className="form-label">Employee Name</label>
                <input
                  type="text"
                  name="employee_name"
                  value={filters.employee_name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Search by name"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Reference Number Search</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Status</label>
                  <select
                    name="reference_search.status"
                    value={filters.reference_search.status}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Any Status</option>
                    {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                      config.fields.some(field => field.name === 'reference_number') && (
                        <option key={status} value={status}>{status}</option>
                      )
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Reference Number</label>
                  <input
                    type="text"
                    name="reference_search.number"
                    value={filters.reference_search.number}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter reference number"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Advanced Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Current Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">All Statuses</option>
                    {Object.keys(STATUS_CONFIG).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Date Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      name="date_from"
                      value={filters.date_from}
                      onChange={handleChange}
                      className="form-input"
                    />
                    <input
                      type="date"
                      name="date_to"
                      value={filters.date_to}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Amount Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="amount_from"
                      value={filters.amount_from}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      name="amount_to"
                      value={filters.amount_to}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
            >
              Apply Filters
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FilterPanel; 