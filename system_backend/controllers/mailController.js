import pool from '../config/db.js';

export const createMail = async (req, res) => {
  const { mail_id, sender, receiver, type, weight, userId } = req.body;

  // Check if sender and receiver objects are provided and contain required fields
  if (!sender  || !sender.address) {
    return res.status(400).json({ success: false, message: 'Sender information is missing or incomplete' });
  }

  if (!receiver || !receiver.name || !receiver.address) {
    return res.status(400).json({ success: false, message: 'Recipient information is missing or incomplete' });
  }

  // Validate type
  if (!type || !['parcel', 'letter', 'document'].includes(type)) {
    return res.status(400).json({ success: false, message: 'Invalid mail type' });
  }

  try {
    // Validate parcel requires weight
    if (type === 'parcel' && (weight === null || weight === undefined)) {
      return res.status(400).json({ success: false, message: 'Weight is required for parcels' });
    }

    // Validate weight is a positive number for parcels
    if (type === 'parcel' && (isNaN(weight) || weight <= 0)) {
      return res.status(400).json({ success: false, message: 'Weight must be a positive number for parcels' });
    }

    const query = `
      INSERT INTO mails (
        mail_id, sender_name, sender_address, 
        receiver_name, receiver_address, 
        mail_type, weight, clerk_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      mail_id,
      sender.name,
      sender.address,
      receiver.name,
      receiver.address,
      type,
      type === 'parcel' ? parseFloat(weight) : null,
      userId,
      'received' // Default status
    ]);

    res.status(201).json({ success: true, message: 'Mail created successfully' });
  } catch (error) {
    console.error('Mail creation error:', error);
    res.status(500).json({ success: false, message: 'Error creating mail' });
  }
};

export const getMails = async (req, res) => {
  try {
    const [mails] = await pool.query(`
      SELECT 
        m.id,
        m.mail_id,
        m.sender_name,
        m.sender_address,
        m.receiver_name,
        m.receiver_address,
        m.mail_type,
        m.weight,
        m.status,
        m.created_at,
        c.name AS clerk_name
      FROM mails m
      LEFT JOIN clerks c ON m.clerk_id = c.id
      ORDER BY m.created_at DESC
    `);
    
    res.status(200).json({ success: true, mails });
  } catch (error) {
    console.error('Error fetching mails:', error);
    res.status(500).json({ success: false, message: 'Error fetching mails' });
  }
};


export const getMailDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const [mail] = await pool.query(`
      SELECT m.*, c.name AS clerk_name 
      FROM mails m
      JOIN clerks c ON m.clerk_id = c.id
      WHERE m.id = ?
    `, [id]);
    
    if (!mail.length) return res.status(404).json({ success: false, message: 'Mail not found' });
    res.json({ success: true, mail: mail[0] });
  } catch (error) {
    console.error('Error fetching mail:', error);
    res.status(500).json({ success: false, message: 'Error fetching mail' });
  }
};

export const updateMailStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    await pool.query('UPDATE mails SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
};

export const deleteMail = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM mails WHERE id = ?', [id]);
    res.json({ success: true, message: 'Mail deleted successfully' });
  } catch (error) {
    console.error('Mail deletion error:', error);
    res.status(500).json({ success: false, message: 'Error deleting mail' });
  }
};

