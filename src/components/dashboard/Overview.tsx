import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

// Mock data for demonstration
const mockStats = {
  totalEmployees: 45,
  activeOnboarding: 3,
  upcomingEvents: 2,
  pendingTasks: 5
};

const mockRecentActivity = [
  {
    id: 1,
    action: 'New employee onboarded',
    employee: 'John Doe',
    time: '2 hours ago'
  },
  {
    id: 2,
    action: 'Training completed',
    employee: 'Jane Smith',
    time: '4 hours ago'
  },
  {
    id: 3,
    action: 'Document approved',
    employee: 'Bob Wilson',
    time: '6 hours ago'
  }
];

const Overview: React.FC = () => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Employees
              </Typography>
              <Typography variant="h4">
                {mockStats.totalEmployees}
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                +2 this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Onboarding
              </Typography>
              <Typography variant="h4">
                {mockStats.activeOnboarding}
              </Typography>
              <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                Requires attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Upcoming Events
              </Typography>
              <Typography variant="h4">
                {mockStats.upcomingEvents}
              </Typography>
              <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
                Next: Team Training
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Tasks
              </Typography>
              <Typography variant="h4">
                {mockStats.pendingTasks}
              </Typography>
              <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                High priority
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {mockRecentActivity.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <PeopleIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={`${activity.employee} • ${activity.time}`}
                    />
                    <Button size="small" variant="outlined">
                      View Details
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PeopleIcon />}
                >
                  Add New Employee
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AssignmentIcon />}
                >
                  Create Training
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EventIcon />}
                >
                  Schedule Event
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<NotificationsIcon />}
                >
                  Send Announcement
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview; 