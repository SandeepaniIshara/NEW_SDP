import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const AddBill = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [bill, setBill] = useState({
    type: '',
    amount: '',
    status: 'Pending',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBill({ ...bill, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Bill:', bill);
    // Add logic to save the bill (e.g., API call)
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Add New Bill</h2>
        </div>
        <div className="card-body">
          {/* Add Bill Form */}
          <form onSubmit={handleSubmit}>
            {/* Bill Type Field */}
            <div className="mb-3">
              <label htmlFor="type" className="form-label">Bill Type</label>
              <input
                type="text"
                className="form-control"
                id="type"
                name="type"
                value={bill.type}
                onChange={handleChange}
                placeholder="Enter bill type (e.g., Electricity, Water)"
                required
              />
            </div>

            {/* Amount Field */}
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">Amount</label>
              <input
                type="number"
                className="form-control"
                id="amount"
                name="amount"
                value={bill.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
              />
            </div>

            {/* Status Field */}
            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                className="form-control"
                id="status"
                name="status"
                value={bill.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            {/* Buttons: Back and Save */}
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/billpayment')} // Redirect to Bill Payment page
              >
                <i className="fas fa-arrow-left me-2"></i>Back
              </button>
              <button type="submit" className="btn btn-primary">
                Save Bill
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBill;