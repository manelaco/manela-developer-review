import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock data for demonstration
const mockCompanies = [
  {
    id: '1',
    name: 'Tech Corp',
    status: 'active',
    users: 45,
    plan: 'enterprise',
    lastActive: '2024-03-15',
    onboardingData: {
      fullName: 'John Doe',
      companyEmail: 'john@techcorp.com',
      password: '********', // Masked for security
      companyName: 'Tech Corp',
      preferredDomain: 'techcorp',
      companySize: '51-100',
      industry: 'Technology',
      role: 'HR Administrator',
      preferences: ['Employee Training', 'Performance Management', 'Recruitment'],
      additionalInfo: 'Looking to streamline HR processes',
      status: 'completed',
      lastUpdated: '2024-03-15T10:30:00Z'
    }
  },
  {
    id: '2',
    name: 'Global Inc',
    status: 'active',
    users: 78,
    plan: 'professional',
    lastActive: '2024-03-14',
    onboardingData: {
      fullName: 'Jane Smith',
      companyEmail: 'jane@globalinc.com',
      password: '********',
      companyName: 'Global Inc',
      preferredDomain: 'globalinc',
      companySize: '101-500',
      industry: 'Finance',
      role: 'People & Culture Manager',
      preferences: ['Employee Engagement', 'Diversity & Inclusion'],
      additionalInfo: 'Focus on employee well-being',
      status: 'completed',
      lastUpdated: '2024-03-14T09:15:00Z'
    }
  }
];

const CompanyManagement: React.FC = () => {
  const { viewAsCompany } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const handleCreate = () => {
    setSelectedCompany(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (company: any) => {
    setSelectedCompany(company);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      // Implement delete functionality
      console.log('Delete company:', id);
    }
  };

  const handleViewAsCompany = (companyId: string) => {
    viewAsCompany(companyId);
    console.log(`Superadmin viewing as company ${companyId}`);
  };

  const handleViewHRDashboard = (companyId: string) => {
    viewAsCompany(companyId);
    navigate('/hr/dashboard');
    console.log(`Superadmin viewing HR dashboard as company ${companyId}`);
  };

  const handleResetOnboarding = (companyId: string) => {
    if (window.confirm('Are you sure you want to reset the onboarding progress?')) {
      // Log the reset action
      console.log(`Resetting onboarding for company ${companyId}`);
      // TODO: Implement reset functionality
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const companyData = {
      name: formData.get('name'),
      status: formData.get('status'),
      plan: formData.get('plan')
    };

    if (selectedCompany) {
      // Log the update
      console.log('Update company:', selectedCompany.id, companyData);
    } else {
      // Log the creation
      console.log('Create company:', companyData);
    }

    setIsDialogOpen(false);
  };

  const renderOnboardingContent = () => {
    if (!selectedCompany?.onboardingData) {
      return (
        <Typography color="text.secondary">
          No onboarding data available
        </Typography>
      );
    }

    const data = selectedCompany.onboardingData;

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Onboarding Information</Typography>
          <Chip
            label={data.status}
            color={data.status === 'completed' ? 'success' : 'warning'}
          />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Personal Information
            </Typography>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1">
                    {data.fullName || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Company Email
                  </Typography>
                  <Typography variant="body1">
                    {data.companyEmail || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Password
                  </Typography>
                  <Typography variant="body1">
                    {data.password || 'Not provided'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Company Details
            </Typography>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Company Name
                  </Typography>
                  <Typography variant="body1">
                    {data.companyName || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Preferred Domain
                  </Typography>
                  <Typography variant="body1">
                    {data.preferredDomain || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Company Size
                  </Typography>
                  <Typography variant="body1">
                    {data.companySize || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Industry
                  </Typography>
                  <Typography variant="body1">
                    {data.industry || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body1">
                    {data.role || 'Not provided'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Preferences
            </Typography>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Selected Preferences
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {data.preferences?.map((pref: string, index: number) => (
                      <Chip
                        key={index}
                        label={pref}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    )) || 'No preferences selected'}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Additional Information
            </Typography>
            <Paper sx={{ p: 2 }}>
              <Typography variant="body1">
                {data.additionalInfo || 'No additional information provided'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Companies</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Add Company
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Users</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={company.status}
                        color={company.status === 'active' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{company.users}</TableCell>
                    <TableCell>
                      <Chip
                        label={company.plan}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{company.lastActive}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedCompany(company);
                          setIsDialogOpen(true);
                        }}
                        title="View Profile"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleViewHRDashboard(company.id)}
                        title="View HR Dashboard"
                      >
                        <DashboardIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleViewAsCompany(company.id)}
                        title="View as Company"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(company.id)}
                        title="Delete Company"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Company Profile Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedCompany(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedCompany ? `${selectedCompany.name} - Company Profile` : 'Add Company'}
        </DialogTitle>
        <DialogContent>
          {selectedCompany ? (
            <Box>
              <form onSubmit={handleSubmit}>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Company Name"
                    defaultValue={selectedCompany.name}
                    required
                  />
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      label="Status"
                      defaultValue={selectedCompany.status}
                      required
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="suspended">Suspended</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Plan</InputLabel>
                    <Select
                      name="plan"
                      label="Plan"
                      defaultValue={selectedCompany.plan}
                      required
                    >
                      <MenuItem value="basic">Basic</MenuItem>
                      <MenuItem value="professional">Professional</MenuItem>
                      <MenuItem value="enterprise">Enterprise</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </form>

              <Divider sx={{ my: 3 }} />
              {renderOnboardingContent()}
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  name="name"
                  label="Company Name"
                  required
                />
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    label="Status"
                    defaultValue="pending"
                    required
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Plan</InputLabel>
                  <Select
                    name="plan"
                    label="Plan"
                    defaultValue="basic"
                    required
                  >
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="professional">Professional</MenuItem>
                    <MenuItem value="enterprise">Enterprise</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="warning"
            startIcon={<RefreshIcon />}
            onClick={() => handleResetOnboarding(selectedCompany?.id)}
          >
            Reset Onboarding
          </Button>
          <Button onClick={() => {
            setIsDialogOpen(false);
            setSelectedCompany(null);
          }}>
            Close
          </Button>
          <Button type="submit" variant="contained">
            {selectedCompany ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyManagement; 