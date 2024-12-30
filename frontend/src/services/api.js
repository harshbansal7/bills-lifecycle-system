import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Employee endpoints
const getEmployees = () => api.get('/api/employees').then(res => res.data);
const getEmployee = (id) => api.get(`/api/employees/${id}`).then(res => res.data);
const createEmployee = (data) => api.post('/api/employees', data).then(res => res.data);
const updateEmployee = (id, data) => api.put(`/api/employees/${id}`, data).then(res => res.data);
const deleteEmployee = (id) => api.delete(`/api/employees/${id}`).then(res => res.data);

// Bill endpoints
const getBills = () => api.get('/api/bills').then(res => res.data);
const getBill = (id) => {
  const billId = typeof id === 'object' ? id.$oid : id;
  return api.get(`/api/bills/${billId}`).then(res => res.data);
};
const createBill = (data) => api.post('/api/bills', data).then(res => res.data);
const updateBill = (id, data) => {
  // Create a clean copy of data without _id
  const cleanData = { ...data };
  if (cleanData._id) delete cleanData._id;
  
  const billId = typeof id === 'object' ? id.$oid : id;
  return api.put(`/api/bills/${billId}`, cleanData).then(res => res.data);
};
const deleteBill = (id) => {
  const billId = typeof id === 'object' ? id.$oid : id;
  return api.delete(`/api/bills/${billId}`).then(res => res.data);
};
const getEmployeeBills = (employeeId) => api.get(`/api/employees/${employeeId}/bills`).then(res => res.data);

// Bill status endpoints
const updateBillStatus = (id, statusData) => {
  const billId = typeof id === 'object' ? id.$oid : id;
  return api.put(`/api/bills/${billId}/status`, statusData).then(res => res.data);
};

const getBillsByStatus = (status) => api.get(`/api/bills/status/${status}`).then(res => res.data);

const filterBills = (filters) => api.post('/api/bills/filter', filters).then(res => res.data);

export default {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getBills,
  getBill,
  createBill,
  updateBill,
  deleteBill,
  getEmployeeBills,
  updateBillStatus,
  getBillsByStatus,
  filterBills
}; 