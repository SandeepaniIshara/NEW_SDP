import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';

const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* This pushes content below the app bar */}
        <Typography variant="h4" gutterBottom>
          Welcome to Clerk Dashboard
        </Typography>
        {/* Add your dashboard content here */}
      </Box>
    </Box>
  );
};

export default Dashboard;