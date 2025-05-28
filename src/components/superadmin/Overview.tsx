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
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
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
import { ChartContainer } from '../ui/chart';

// Mock data for demonstration
const mockStats = {
  totalCompanies: 156,
  activeUsers: 2345,
  pendingApprovals: 12,
  systemHealth: '98.5%'
};

// Import mockCompanies from CompanyManagement for demonstration
const mockCompanies = [
  {
    id: '1',
    name: 'Tech Corp',
    status: 'active',
    users: 45,
    plan: 'enterprise',
    lastActive: '2024-03-15',
  },
  {
    id: '2',
    name: 'Global Inc',
    status: 'active',
    users: 78,
    plan: 'professional',
    lastActive: '2024-03-14',
  },
  {
    id: '3',
    name: 'Startup Co',
    status: 'pending',
    users: 12,
    plan: 'basic',
    lastActive: '2024-03-10',
  },
  {
    id: '4',
    name: 'Acme Corp',
    status: 'active',
    users: 60,
    plan: 'enterprise',
    lastActive: '2024-03-13',
  },
  {
    id: '5',
    name: 'NextGen Solutions',
    status: 'active',
    users: 55,
    plan: 'professional',
    lastActive: '2024-03-12',
  },
  {
    id: '6',
    name: 'Legacy Ltd',
    status: 'suspended',
    users: 5,
    plan: 'basic',
    lastActive: '2024-03-09',
  }
];

// Mock time-series data for charts
const companyGrowthData = [
  { month: 'Jan', companies: 100 },
  { month: 'Feb', companies: 110 },
  { month: 'Mar', companies: 120 },
  { month: 'Apr', companies: 130 },
  { month: 'May', companies: 140 },
  { month: 'Jun', companies: 156 },
];
const activeUsersData = [
  { month: 'Jan', users: 1800 },
  { month: 'Feb', users: 1900 },
  { month: 'Mar', users: 2000 },
  { month: 'Apr', users: 2100 },
  { month: 'May', users: 2200 },
  { month: 'Jun', users: 2345 },
];
const droppedOnboardings = 7; // mock value
const mostClickedArticles = [
  { title: 'How to Onboard Employees', views: 120 },
  { title: 'HR Best Practices', views: 95 },
  { title: 'Company Culture', views: 80 },
  { title: 'Performance Reviews', views: 60 },
  { title: 'Remote Work Tips', views: 45 },
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
        {/* Total Companies Chart */}
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Companies (Growth)
            </Typography>
            <ChartContainer config={{ companies: { color: '#1976d2', label: 'Companies' } }}>
              {({ ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid }) => (
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={companyGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="companies" stroke="#1976d2" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>
          </CardContent>
        </Card>
        {/* Active Users Chart */}
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Users (Trend)
            </Typography>
            <ChartContainer config={{ users: { color: '#43a047', label: 'Active Users' } }}>
              {({ ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid }) => (
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={activeUsersData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke="#43a047" fill="#43a04733" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>
          </CardContent>
        </Card>
        {/* Dropped Onboardings Card */}
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Number of Dropped Onboardings
            </Typography>
            <Typography variant="h4">
              {droppedOnboardings}
            </Typography>
            <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
              Users who did not complete onboarding
            </Typography>
          </CardContent>
        </Card>
        {/* Most Clicked Articles Chart */}
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Most Clicked Articles Overall
            </Typography>
            <ChartContainer config={{ views: { color: '#fbc02d', label: 'Views' } }}>
              {({ ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid }) => (
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={mostClickedArticles} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#fbc02d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Remove Recent Activity, Quick Actions, and View as Company. Add Most Active Companies Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Most Active Companies
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Users</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Last Active</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockCompanies
                  .sort((a, b) => b.users - a.users)
                  .slice(0, 5)
                  .map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={company.status}
                          color={company.status === 'active' ? 'success' : company.status === 'pending' ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{company.users}</TableCell>
                      <TableCell>
                        <Chip label={company.plan} color="primary" size="small" />
                      </TableCell>
                      <TableCell>{company.lastActive}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Overview; 