import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import { formatDate, formatDateTime, formatAmount } from '../utils/formatters';
import { STATUS_CONFIG } from '../utils/statusConfig';

const BILL_STATUSES = {
  'Received From Subdivision': 'bg-blue-100 text-blue-800',
  'Sent to Medical Superintendent': 'bg-yellow-100 text-yellow-800', 
  'Received back from Medical Superintendent': 'bg-green-100 text-green-800',
  'Sent to Circle Office': 'bg-orange-100 text-orange-800',
  'Received back from Circle Office': 'bg-teal-100 text-teal-800',
  'Office Order': 'bg-purple-100 text-purple-800',
  'Voucher Creation': 'bg-indigo-100 text-indigo-800',
  'Passing of Voucher': 'bg-emerald-100 text-emerald-800',
  'Sent Back to Subdivision': 'bg-gray-100 text-gray-800',
  'Rejected': 'bg-red-100 text-red-800'
};

const formatStatusDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const StatusHistoryItem = ({ update }) => {
  const config = STATUS_CONFIG[update.status.split(' - ')[0]];
  
  return (
    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex-shrink-0 mt-1">
        <CheckCircleIcon className="h-5 w-5 text-green-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className={`text-base font-semibold ${BILL_STATUSES[update.status]}`}>
              {update.status}
            </p>
            {update.status.includes(' - ') && (
              <p className="text-sm text-gray-600">
                {update.status.split(' - ')[1]}
              </p>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {formatStatusDate(update.date)}
          </span>
        </div>
        
        {/* Status-specific fields */}
        <div className="space-y-2 mb-3">
          {config?.fields.map(field => {
            const value = update[field.name];
            if (!value) return null;
            
            return (
              <div key={field.name} className="flex items-baseline">
                <span className="text-sm font-medium text-gray-500 w-32">
                  {field.label}:
                </span>
                <span className="text-sm text-gray-900">
                  {field.type === 'currency' ? formatAmount(value) : value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Remarks section */}
        {update.remarks && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">Remarks</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {update.remarks}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const BillDetails = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusDate, setStatusDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [letterNumber, setLetterNumber] = useState('');
  const [verifiedAmount, setVerifiedAmount] = useState('');
  const [officeOrderNumber, setOfficeOrderNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFields, setStatusFields] = useState({
    reference_number: '',
    approved_amount: ''
  });

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const data = await api.getBill(billId);
        setBill(data);
      } catch (err) {
        setError('Failed to fetch bill details');
      }
    };
    fetchBill();
  }, [billId]);

  useEffect(() => {
    setStatusDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
    setStatusFields({
      reference_number: '',
      approved_amount: ''
    });
    setRemarks('');
  };

  const formatRemarks = () => {
    if (newStatus === 'Sent to Medical Superintendent' || 
        newStatus === 'Received back from Medical Superintendent') {
      let formattedRemarks = '';
      if (letterNumber) {
        formattedRemarks += `Letter Number: ${letterNumber}\n`;
      }
      if (verifiedAmount) {
        formattedRemarks += `Verified Amount: ₹${verifiedAmount}\n`;
      }
      if (remarks) {
        formattedRemarks += `Additional Remarks: ${remarks}`;
      }
      return formattedRemarks.trim();
    } else if (newStatus === 'Office Order') {
      let formattedRemarks = '';
      if (officeOrderNumber) {
        formattedRemarks += `Office Order Number: ${officeOrderNumber}\n`;
      }
      if (remarks) {
        formattedRemarks += `Additional Remarks: ${remarks}`;
      }
      return formattedRemarks.trim();
    }
    return remarks;
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.updateBillStatus(billId, {
        status: newStatus,
        date: statusDate,
        remarks: remarks,
        reference_number: statusFields.reference_number,
        approved_amount: statusFields.approved_amount
      });
      const updatedBill = await api.getBill(billId);
      setBill(updatedBill);
      setSuccess('Status updated successfully');
      setNewStatus('');
      setStatusDate(new Date().toISOString().split('T')[0]);
      setStatusFields({
        reference_number: '',
        approved_amount: ''
      });
      setRemarks('');
    } catch (err) {
      setError('Failed to update status');
    }
  };

  if (!bill) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-strong overflow-hidden">
        {/* Header Section */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="px-8 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/bills')}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                title="Go back"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bill Details</h1>
                <p className="text-sm text-gray-500 mt-1">Bill #{bill.bill_number}</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${BILL_STATUSES[bill?.current_status]}`}>
              {bill?.current_status}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bill Information Card */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Bill Information</h2>
              </div>
              <div className="card-body">
                <dl className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500 mb-1">Employee Details</dt>
                    <dd className="text-base text-gray-900">
                      {bill.employee_name}
                      <div className="text-sm text-gray-500">ID: {bill.employee_id}</div>
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500 mb-1">Dependent Details</dt>
                    <dd className="text-base text-gray-900">
                      {bill.dependent_name}
                      <div className="text-sm text-gray-500">Relationship: {bill.relationship}</div>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Receipt Date</dt>
                    <dd className="text-base text-gray-900">{formatDate(bill.receipt_date)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Amount Claimed</dt>
                    <dd className="text-base text-gray-900 font-medium">{formatAmount(bill.amount_claimed)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500 mb-1">Treatment Period</dt>
                    <dd className="text-base text-gray-900">
                      {formatDate(bill.treatment_period_from)} - {formatDate(bill.treatment_period_to)}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500 mb-1">Hospital</dt>
                    <dd className="text-base text-gray-900">{bill.hospital}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Status Update Card */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Update Status</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleStatusUpdate} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="form-label">New Status</label>
                      <select
                        value={newStatus}
                        onChange={handleStatusChange}
                        className="form-input"
                        required
                      >
                        <option value="">Select new status</option>
                        {Object.keys(BILL_STATUSES).map((status) => (
                          <option 
                            key={status} 
                            value={status}
                            disabled={STATUS_CONFIG[status]?.isInitialStatus}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="form-label">Status Date</label>
                      <input
                        type="date"
                        value={statusDate}
                        onChange={(e) => setStatusDate(e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Dynamic fields based on status */}
                  {newStatus && STATUS_CONFIG[newStatus]?.fields.map(field => (
                    <div key={field.name}>
                      <label className="form-label">
                        {field.label}
                        {!field.required && <span className="text-sm text-gray-500 ml-1">(optional)</span>}
                      </label>
                      {field.type === 'currency' ? (
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">₹</span>
                          <input
                            type="number"
                            value={statusFields[field.name]}
                            onChange={(e) => setStatusFields(prev => ({
                              ...prev,
                              [field.name]: e.target.value
                            }))}
                            className="form-input pl-8"
                            required={field.required}
                          />
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          value={statusFields[field.name]}
                          onChange={(e) => setStatusFields(prev => ({
                            ...prev,
                            [field.name]: e.target.value
                          }))}
                          className="form-input"
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}

                  <div>
                    <label className="form-label">
                      Additional Remarks (optional)
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="form-input"
                      rows="3"
                      placeholder="Add any remarks about this status update"
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    Update Status
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Status History Card */}
          <div className="card mt-8">
            <div className="card-header flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Status History</h2>
              {bill?.latest_reference_number && (
                <div className="text-sm text-gray-500">
                  Latest Reference: {bill.latest_reference_number}
                </div>
              )}
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {bill?.status_history
                  .slice()
                  .reverse()
                  .map((update, index) => (
                    <StatusHistoryItem key={index} update={update} />
                  ))}
              </div>
            </div>
          </div>

          {/* Bill Summary Card */}
          <div className="card mt-8">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Bill Summary</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount Claimed</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatAmount(bill.amount_claimed)}
                  </p>
                </div>
                {bill.latest_approved_amount && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Latest Approved Amount</p>
                    <p className="mt-1 text-lg font-semibold text-green-600">
                      {formatAmount(bill.latest_approved_amount)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetails; 