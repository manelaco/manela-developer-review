import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Container
} from '@mui/material';
import {
  Business as BusinessIcon,
  Add as AddIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Storage as StorageIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for demonstration
const mockStats = {
  totalCompanies: 156,
  activeUsers: 2345,
  pendingApprovals: 12,
  systemHealth: '98.5%'
};

const mockRecentActivity = [
  {
    id: 1,
    action: 'New company registered',
    company: 'Tech Corp',
    time: '2 hours ago'
  },
  {
    id: 2,
    action: 'User role updated',
    company: 'Global Inc',
    time: '4 hours ago'
  },
  {
    id: 3,
    action: 'System backup completed',
    company: 'System',
    time: '6 hours ago'
  }
];

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const { handleViewAsCompany } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(4, 1fr)'
        },
        gap: 3,
        mb: 3
      }}>
        {/* Stats Cards */}
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Companies
            </Typography>
            <Typography variant="h4">
              {mockStats.totalCompanies}
            </Typography>
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              +12% from last month
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Users
            </Typography>
            <Typography variant="h4">
              {mockStats.activeUsers}
            </Typography>
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              +8% from last month
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Pending Approvals
            </Typography>
            <Typography variant="h4">
              {mockStats.pendingApprovals}
            </Typography>
            <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
              Requires attention
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              System Health
            </Typography>
            <Typography variant="h4">
              {mockStats.systemHealth}
            </Typography>
            <Chip 
              label="All Systems Operational" 
              color="success" 
              size="small" 
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Recent Activity */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <List>
            {mockRecentActivity.map((activity) => (
              <ListItem key={activity.id} divider>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <BusinessIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={activity.action}
                  secondary={`${activity.company} • ${activity.time}`}
                />
                <Button size="small" variant="outlined">
                  View Details
                </Button>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 2
          }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<BusinessIcon />}
              onClick={() => navigate('/superadmin/companies')}
            >
              Manage Companies
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => navigate('/superadmin/users')}
            >
              Manage Users
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SecurityIcon />}
              onClick={() => navigate('/superadmin/api-keys')}
            >
              API Keys
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<StorageIcon />}
              onClick={() => navigate('/superadmin/system')}
            >
              System Status
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* View as Company */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            View as Company
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 2
          }}>
            {mockStats.totalCompanies > 0 && (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<BusinessIcon />}
                onClick={() => handleViewAsCompany('1')}
              >
                View as Company 1
              </Button>
            )}
            {/* Add more company buttons as needed */}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Overview; 