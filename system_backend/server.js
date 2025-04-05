import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import pool from './config/db.js';
import userRouter from './routes/UserRouter.js';
import mailRouter from './routes/mailRoutes.js';
import inventoryRouter from './routes/inventoryRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*'
  }));
  

// Serve static images
app.use('/images', express.static('uploads'));

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/mailManagement', mailRouter);

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        res.json({ success: true, message: 'Database connected!', result: rows[0] });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ success: false, message: 'Error connecting to the database', error });
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('API WORKING');
});

// Start the server
const PORT = 4000;
app.listen(port, () => {
    console.log(`Server starting on http://localhost:${port}`);
});