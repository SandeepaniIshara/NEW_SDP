import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddMail = () => {
  const navigate = useNavigate();
  const [mail, setMail] = useState({
    mailId: '', // Start with an empty value for mailId
    type: '',
    sender: {
      name: '',
      address: ''
    },
    recipient: {
      name: '',
      address: ''
    },
    weight: '',
    status: 'received'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mail.mailId) {
      toast.error('Please enter a mail ID');
      return;
    }

    if (!mail.type) {
      toast.error('Please select mail type');
      return;
    }

    if (mail.type === 'Parcel' && (!mail.weight || isNaN(mail.weight) || parseFloat(mail.weight) <= 0)) {
      toast.error('Please enter a valid weight for parcel');
      return;
    }

    if (!token) {
      toast.error('Unauthorized: Token not found');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:4000/api/mailManagement/create', {
        method: 'POST',
        headers: {
          token,
          'Content-Type': 'application/json' // Ensure content type is set to JSON
        },
        body: JSON.stringify({
          mail_id: mail.mailId,  // The manually entered mail ID
          type: mail.type.toLowerCase(),
          sender: mail.sender,  // Send the sender as an object with 'name' and 'address'
          receiver: mail.recipient,  // Send the recipient as an object with 'name' and 'address'
          weight: mail.type === 'Parcel' ? parseFloat(mail.weight) : null,
          userId: 6  // Make sure to include a valid userId or retrieve it from somewhere else
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text.includes('<html') ? 
          'Server returned an HTML error page' : 
          'Invalid response format');
      }

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to create mail');
      
      toast.success('Mail created successfully!');
      navigate('/mailManagement');
    } catch (error) {
      console.error('API Error:', error);
      toast.error(error.message || 'An error occurred while creating mail');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle changes for nested sender/recipient objects
    if (name.startsWith('sender')) {
      setMail(prev => ({
        ...prev,
        sender: { ...prev.sender, [name.split('.')[1]]: value }
      }));
    } else if (name.startsWith('recipient')) {
      setMail(prev => ({
        ...prev,
        recipient: { ...prev.recipient, [name.split('.')[1]]: value }
      }));
    } else {
      setMail(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2>Add New Mail</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Mail ID */}
            <div className="mb-3">
              <label htmlFor="mailId" className="form-label">Mail ID *</label>
              <input 
                type="text" 
                id="mailId" 
                name="mailId" 
                className="form-control" 
                value={mail.mailId} 
                onChange={handleChange} 
                required
                placeholder="Enter Mail ID manually"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="type" className="form-label">Mail Type *</label>
              <select 
                id="type" 
                name="type" 
                className="form-select" 
                value={mail.type} 
                onChange={handleChange} 
                required
              >
                <option value="">Select Type</option>
                <option value="Parcel">Parcel</option>
                <option value="Letter">Letter</option>
                <option value="Document">Document</option>
              </select>
            </div>

            {mail.type === 'Parcel' && (
              <div className="mb-3">
                <label htmlFor="weight" className="form-label">Weight (kg) *</label>
                <div className="input-group">
                  <input 
                    type="number" 
                    id="weight" 
                    name="weight" 
                    className="form-control" 
                    value={mail.weight} 
                    onChange={handleChange}
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                  />
                  <span className="input-group-text">kg</span>
                </div>
              </div>
            )}

            {/* Sender Information */}
            <div className="mb-3">
              <label htmlFor="sender.name" className="form-label">Sender Name *</label>
              <input 
                type="text" 
                id="sender.name" 
                name="sender.name" 
                className="form-control" 
                value={mail.sender.name} 
                onChange={handleChange} 
                required 
                placeholder="Enter sender's full name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="sender.address" className="form-label">Sender Address *</label>
              <input 
                type="text" 
                id="sender.address" 
                name="sender.address" 
                className="form-control" 
                value={mail.sender.address} 
                onChange={handleChange} 
                required 
                placeholder="Enter complete sender address"
              />
            </div>

            {/* Recipient Information */}
            <div className="mb-3">
              <label htmlFor="recipient.name" className="form-label">Recipient Name *</label>
              <input 
                type="text" 
                id="recipient.name" 
                name="recipient.name" 
                className="form-control" 
                value={mail.recipient.name} 
                onChange={handleChange} 
                required 
                placeholder="Enter recipient's full name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="recipient.address" className="form-label">Recipient Address *</label>
              <input 
                type="text" 
                id="recipient.address" 
                name="recipient.address" 
                className="form-control" 
                value={mail.recipient.address} 
                onChange={handleChange} 
                required 
                placeholder="Enter complete recipient address"
              />
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/mailManagement')}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : 'Save Mail'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddMail;
