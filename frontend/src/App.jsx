import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import EmployeeList from './components/EmployeeList';
import CreateEmployee from './components/CreateEmployee';
import EditEmployee from './components/EditEmployee';
import BillList from './components/BillList';
import CreateBill from './components/CreateBill';
import EditBill from './components/EditBill';
import BillDetails from './components/BillDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<EmployeeList />} />
          <Route path="employees">
            <Route index element={<EmployeeList />} />
            <Route path="create" element={<CreateEmployee />} />
            <Route path="edit/:employeeId" element={<EditEmployee />} />
          </Route>
          <Route path="bills">
            <Route index element={<BillList />} />
            <Route path="create" element={<CreateBill />} />
            <Route path=":billId" element={<BillDetails />} />
            <Route path="edit/:billId" element={<EditBill />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
