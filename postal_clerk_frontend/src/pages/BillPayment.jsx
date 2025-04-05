import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const BillPayment = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/billPayment', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bills');
        }

        const data = await response.json();
        setBills(data.bills);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchBills();
  }, []);

  // Filter bills based on search term
  const filteredBills = bills.filter((bill) =>
    bill.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Bill Payments</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search bills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Bill Payment Table */}
      <table className="table table-striped table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBills.map((bill) => (
            <tr key={bill.id}>
              <td>{bill.id}</td>
              <td>{bill.type}</td>
              <td>${bill.amount}</td>
              <td>
                <span className={`badge ${bill.status === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                  {bill.status}
                </span>
              </td>
              <td>
                <button className="btn btn-primary btn-sm me-2">Edit</button>
                <button className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add New Bill Button */}
      <div className="text-end">
        <button
          className="btn btn-success"
          onClick={() => navigate('/billPayment/add')}
        >
          Add New Bill
        </button>
      </div>
    </div>
  );
};

export default BillPayment;