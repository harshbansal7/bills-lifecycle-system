import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Employee endpoints
const getEmployees = () => api.get('/employees').then(res => res.data);
const getEmployee = (id) => api.get(`/employees/${id}`).then(res => res.data);
const createEmployee = (data) => api.post('/employees', data).then(res => res.data);
const updateEmployee = (id, data) => api.put(`/employees/${id}`, data).then(res => res.data);
const deleteEmployee = (id) => api.delete(`/employees/${id}`).then(res => res.data);

// Bill endpoints
const getBills = () => api.get('/bills').then(res => res.data);
const getBill = (id) => {
  const billId = typeof id === 'object' ? id.$oid : id;
  return api.get(`/bills/${billId}`).then(res => res.data);
};
const createBill = (data) => api.post('/bills', data).then(res => res.data);
const updateBill = (id, data) => {
  // Create a clean copy of data without _id
  const cleanData = { ...data };
  if (cleanData._id) delete cleanData._id;
  
  const billId = typeof id === 'object' ? id.$oid : id;
  return api.put(`/bills/${billId}`, cleanData).then(res => res.data);
};
const deleteBill = (id) => {
  const billId = typeof id === 'object' ? id.$oid : id;
  return api.delete(`/bills/${billId}`).then(res => res.data);
};
const getEmployeeBills = (employeeId) => api.get(`/employees/${employeeId}/bills`).then(res => res.data);

// Bill status endpoints
const updateBillStatus = (id, statusData) => {
  const billId = typeof id === 'object' ? id.$oid : id;
  return api.put(`/bills/${billId}/status`, statusData).then(res => res.data);
};

const getBillsByStatus = (status) => api.get(`/bills/status/${status}`).then(res => res.data);

const filterBills = (filters) => api.post('/bills/filter', filters).then(res => res.data);

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