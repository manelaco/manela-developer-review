import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import OnboardingStepView from './OnboardingStepView';

// Mock data for demonstration
const mockOnboardingData = [
  {
    id: 1,
    companyName: 'Acme Corp',
    email: 'hr@acmecorp.com',
    status: 'completed',
    currentStep: 4,
    lastUpdated: '2024-03-20T10:30:00Z'
  },
  {
    id: 2,
    companyName: 'TechStart Inc',
    email: 'admin@example.com',
    status: 'in_progress',
    currentStep: 2,
    lastUpdated: '2024-03-20T09:15:00Z'
  },
  {
    id: 3,
    companyName: 'Global Solutions',
    email: 'hr@globalsolutions.com',
    status: 'pending',
    currentStep: 1,
    lastUpdated: '2024-03-19T16:45:00Z'
  }
];

const OnboardingManagement: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { viewAsCompany, stopViewingAsCompany } = useAuth();

  const handleViewOnboarding = (company: any) => {
    setSelectedCompany(company);
    setViewDialogOpen(true);
  };

  const handleResetOnboarding = (companyId: number) => {
    // TODO: Implement reset functionality
    toast.success('Onboarding reset for company');
  };

  const handleViewAsCompany = (companyId: number) => {
    viewAsCompany(companyId.toString());
    toast.success('Viewing as company');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'pending':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Onboarding Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage company onboarding progress
          </Typography>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Current Step</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockOnboardingData.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.companyName}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>
                  <Chip
                    label={company.status.replace('_', ' ')}
                    color={getStatusColor(company.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>Step {company.currentStep} of 4</TableCell>
                <TableCell>
                  {new Date(company.lastUpdated).toLocaleString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewOnboarding(company)}
                    title="View Onboarding"
                  >
                    <VisibilityIcon />
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
                    onClick={() => handleResetOnboarding(company.id)}
                    title="Reset Onboarding"
                  >
                    <RefreshIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Onboarding Progress - {selectedCompany?.companyName}
        </DialogTitle>
        <DialogContent>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab label="Step 1" />
            <Tab label="Step 2" />
            <Tab label="Step 3" />
            <Tab label="Step 4" />
          </Tabs>
          
          <Box sx={{ mt: 2 }}>
            <OnboardingStepView
              step={activeTab + 1}
              data={selectedCompany?.onboardingData || {}}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OnboardingManagement; 