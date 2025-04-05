import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box, 
  Typography,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Email as EmailIcon,
  Payment as PaymentIcon,
  Inventory as InventoryIcon,
  AccountCircle as ProfileIcon,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Drawer
      sx={{
        width: collapsed ? 72 : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 72 : drawerWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          overflowX: 'hidden'
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* Profile Section */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: collapsed ? 'column' : 'row', 
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between'
      }}>
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <ProfileIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" noWrap>
                {user?.name || 'Clerk'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.email || 'clerk@example.com'}
              </Typography>
            </Box>
          </Box>
        )}
        {collapsed && (
          <Avatar sx={{ bgcolor: 'primary.main', mb: 1 }}>
            <ProfileIcon />
          </Avatar>
        )}
        <IconButton onClick={toggleCollapse} size="small">
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>
      <Divider />

      {/* Main Navigation */}
      <List>
        <ListItem 
          button 
          component={Link} 
          to="/dashboard"
          sx={{ 
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 0 : 2
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 56 }}>
            <DashboardIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Dashboard" />}
        </ListItem>

        <ListItem 
          button 
          component={Link} 
          to="/employees"
          sx={{ 
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 0 : 2
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 56 }}>
            <PeopleIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Employees" />}
        </ListItem>

        {/* Mail Management Link */}
        <ListItem 
          button 
          component={Link} 
          to="/mailManagement"
          sx={{ 
            justifyContent: 'flex-start', px: 2,
          }}
        >
          <ListItemIcon>
            <EmailIcon />
          </ListItemIcon>
          <ListItemText primary="Mail Management" />
        </ListItem>

        {/* Bill Payments Link */}
        <ListItem 
          button 
          component={Link} 
          to="/billPayment" // Updated to match the route in App.js
          sx={{ 
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 0 : 2
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 56 }}>
            <PaymentIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Bill Payments" />}
        </ListItem>

        <ListItem 
          button 
          component={Link} 
          to="/inventory"
          sx={{ 
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 0 : 2
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 56 }}>
            <InventoryIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Inventory" />}
        </ListItem>

        <ListItem 
          button 
          component={Link} 
          to="/profile"
          sx={{ 
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 0 : 2
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 56 }}>
            <ProfileIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="My Profile" />}
        </ListItem>

        <ListItem 
          button 
          component={Link} 
          to="/settings"
          sx={{ 
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 0 : 2
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 56 }}>
            <SettingsIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Settings" />}
        </ListItem>
      </List>
      <Divider />

      {/* Logout */}
      <List>
        <ListItem 
          button 
          onClick={handleLogout}
          sx={{ 
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 0 : 2
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 56 }}>
            <ExitToAppIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Logout" />}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;