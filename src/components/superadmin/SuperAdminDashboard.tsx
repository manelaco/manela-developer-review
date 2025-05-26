import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Container,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ContentManagement from './ContentManagement';
import Overview from './Overview';
import CompanyManagement from './CompanyManagement';
import UserManagement from './UserManagement';
import Settings from './Settings';
import OnboardingManagement from './OnboardingManagement';

// Mock data for demonstration
const mockStats = {
  totalCompanies: 156,
  activeUsers: 2345,
  pendingApprovals: 12,
  systemHealth: 'Healthy'
};

const mockRecentActivity = [
  { id: 1, company: 'Acme Corp', action: 'New user registration', time: '5 minutes ago' },
  { id: 2, company: 'TechStart Inc', action: 'Company settings updated', time: '1 hour ago' },
  { id: 3, company: 'Global Solutions', action: 'New API key generated', time: '2 hours ago' },
  { id: 4, company: 'Innovation Labs', action: 'User role changed', time: '3 hours ago' }
];

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, viewAsCompany, stopViewingAsCompany, viewedCompanyId } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleViewAsCompany = (companyId: string) => {
    viewAsCompany(companyId);
    toast.success('Viewing as company');
    // Log this action
    console.log(`Superadmin ${user?.email} viewing as company ${companyId}`);
  };

  const handleStopViewingAsCompany = () => {
    stopViewingAsCompany();
    toast.success('Stopped viewing as company');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/superadmin' },
    { text: 'Companies', icon: <BusinessIcon />, path: '/superadmin/companies' },
    { text: 'Users', icon: <PeopleIcon />, path: '/superadmin/users' },
    { text: 'Onboarding', icon: <AssignmentIcon />, path: '/superadmin/onboarding' },
    { text: 'API Keys', icon: <SecurityIcon />, path: '/superadmin/api-keys' },
    { text: 'System', icon: <StorageIcon />, path: '/superadmin/system' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/superadmin/settings' }
  ];

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main' }}>
          Super Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            component="div"
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                '&:hover': {
                  bgcolor: 'primary.light',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'companies':
        return <CompanyManagement />;
      case 'content':
        return <ContentManagement />;
      case 'users':
        return <UserManagement />;
      case 'onboarding':
        return <OnboardingManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Super Admin Dashboard
            {viewedCompanyId && (
              <Chip
                label={`Viewing as Company ${viewedCompanyId}`}
                color="primary"
                size="small"
                onDelete={handleStopViewingAsCompany}
                sx={{ ml: 2 }}
              />
            )}
          </Typography>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: 8
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Overview" value="overview" />
          <Tab label="Companies" value="companies" />
          <Tab label="Content" value="content" />
          <Tab label="Users" value="users" />
          <Tab label="Onboarding" value="onboarding" />
          <Tab label="Settings" value="settings" />
        </Tabs>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default SuperAdminDashboard; 