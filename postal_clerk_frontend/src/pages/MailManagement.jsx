import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MailList = () => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Add useNavigate hook for navigation

  useEffect(() => {
    const fetchMails = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/mailManagement/get_mails');
        setMails(response.data.mails);
      } catch (error) {
        console.error('Failed to fetch mails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, []);

  return (
    <div className="container mt-4">
      <h2>All Mails</h2>
      
      {/* Add Mail button */}
      <div className="mb-3">
        <button
          className="btn btn-success"
          onClick={() => navigate('/mailManagement/add')} // Navigate to the Add Mail page
        >
          Add Mail
        </button>
      </div>

      {loading ? (
        <p>Loading mails...</p>
      ) : mails.length === 0 ? (
        <p>No mails found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th style={{ backgroundColor: '#f0f8ff' }}>Mail ID</th>
              <th style={{ backgroundColor: '#f0f8ff' }}>Sender</th>
              <th style={{ backgroundColor: '#f0f8ff' }}>Sender Address</th>
              <th style={{ backgroundColor: '#f0f8ff' }}>Receiver</th>
              <th style={{ backgroundColor: '#f0f8ff' }}>Receiver Address</th>
              <th style={{ backgroundColor: '#f0f8ff' }}>Type</th>
              <th style={{ backgroundColor: '#f0f8ff' }}>Status</th>
              <th style={{ backgroundColor: '#f0f8ff' }}>Weight</th>
              <th style={{ backgroundColor: '#f0f8ff' }}>Clerk</th>
              <th style={{ backgroundColor: '#f0f8ff' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {mails.map((mail) => (
              <tr key={mail.mail_id}>
                <td>{mail.mail_id}</td>
                <td>{mail.sender_name}</td>
                <td>{mail.sender_address}</td>
                <td>{mail.receiver_name}</td>
                <td>{mail.receiver_address}</td>
                <td>{mail.mail_type}</td>
                <td style={{ color: mail.status === 'received' ? 'green' : mail.status === 'in-transit' ? 'orange' : 'blue' }}>
                  {mail.status}
                </td>
                <td>{mail.weight ?? '-'}</td>
                <td>{mail.clerk_name}</td>
                <td>{new Date(mail.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MailList;
