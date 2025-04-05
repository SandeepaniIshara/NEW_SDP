import bcrypt from 'bcrypt';
import { createToken } from '../middleware/token.js';
import pool from '../config/db.js';
import validator from 'validator';

// Register Clerk
const registerClerk = async (req, res) => {
  const { employee_id, name, password, email, address, phone_number } = req.body;
  try {
    // Validation checks
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: 'Please enter a strong password' });
    }
    if (phone_number.length !== 10) {
      return res.json({ success: false, message: 'Please enter a valid phone number' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert clerk into the database
    const INSERT_CLERK_QUERY =
      'INSERT INTO clerks (employee_id, name, email, password, address, phone_number) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await pool.query(INSERT_CLERK_QUERY, [
      employee_id,
      name,
      email,
      hashedPassword,
      address,
      phone_number,
    ]);

    // Generate token using id instead of employee_id
    const token = createToken(result.insertId);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Error registering clerk' });
  }
};

// Login Clerk
const loginClerk = async (req, res) => {
  const { email, password } = req.body;
  try {
    const SELECT_CLERK_QUERY = 'SELECT * FROM clerks WHERE email = ?';
    const [rows] = await pool.query(SELECT_CLERK_QUERY, [email]);

    if (rows.length === 0) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const clerk = rows[0];
    const isMatch = await bcrypt.compare(password, clerk.password);

    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    // Generate token using id instead of employee_id
    const token = createToken(clerk.id);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Error logging in clerk' });
  }
};

// Get Clerks
const getClerks = async (req, res) => {
  try {
    const SELECT_CLERKS_QUERY = 'SELECT id, employee_id, name, email, address, phone_number FROM clerks';
    const [clerks] = await pool.query(SELECT_CLERKS_QUERY);

    res.json({ success: true, clerks });
  } catch (error) {
    console.error('Error getting clerks:', error);
    res.status(500).json({ success: false, message: 'Error getting clerks' });
  }
};

// Delete Clerk
const deleteClerk = async (req, res) => {
  const { id } = req.body; // Use id instead of employee_id
  try {
    const DELETE_CLERK_QUERY = 'DELETE FROM clerks WHERE id = ?';
    const [result] = await pool.query(DELETE_CLERK_QUERY, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Clerk not found' });
    }

    res.json({ success: true, message: 'Clerk deleted successfully' });
  } catch (error) {
    console.error('Error deleting clerk:', error);
    res.status(500).json({ success: false, message: 'Error deleting clerk' });
  }
};

export { registerClerk, loginClerk, getClerks, deleteClerk };