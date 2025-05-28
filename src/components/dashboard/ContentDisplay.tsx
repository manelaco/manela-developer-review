import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon
} from '@mui/icons-material';
import { getContent, incrementContentView } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';
import { Content } from '@/lib/db';

const ContentDisplay: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch content based on user role and filters
  const { data: content = [], isLoading } = useQuery({
    queryKey: ['content', filters, user?.role],
    queryFn: () => getContent({
      ...filters,
      status: 'published',
      targetRoles: user?.role === 'hr_admin' ? ['hr_admin'] : ['employee']
    })
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Update filters based on tab
    switch (newValue) {
      case 0: // All
        setFilters(prev => ({ ...prev, type: '' }));
        break;
      case 1: // Articles
        setFilters(prev => ({ ...prev, type: 'article' }));
        break;
      case 2: // Resources
        setFilters(prev => ({ ...prev, type: 'resource' }));
        break;
      case 3: // Policies
        setFilters(prev => ({ ...prev, type: 'policy' }));
        break;
      case 4: // Templates
        setFilters(prev => ({ ...prev, type: 'template' }));
        break;
    }
  };

  const handleViewContent = async (content: Content) => {
    setSelectedContent(content);
    try {
      await incrementContentView(content.id);
    } catch (e) {
      // Optionally handle error
    }
  };

  return (
    <Box>
      <Card>
        <CardHeader
          title="Content Library"
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Search content..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setIsFilterOpen(true)}
              >
                Filters
              </Button>
            </Box>
          }
        />
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ mb: 3 }}
          >
            <Tab label="All" />
            <Tab label="Articles" />
            <Tab label="Resources" />
            <Tab label="Policies" />
            <Tab label="Templates" />
          </Tabs>

          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Grid container spacing={2}>
              {content.map((item) => (
                <Grid item xs={12} md={6} lg={4} key={item.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 6
                      }
                    }}
                    onClick={() => handleViewContent(item)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" gutterBottom>
                          {item.title}
                        </Typography>
                        <IconButton size="small">
                          <BookmarkBorderIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {item.type} • {item.metadata?.readTime} min read
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {item.content.substring(0, 150)}...
                      </Typography>
                      <Box sx={{ mt: 'auto' }}>
                        {item.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Content View Dialog */}
      <Dialog
        open={!!selectedContent}
        onClose={() => setSelectedContent(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedContent && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">{selectedContent.title}</Typography>
                <IconButton>
                  <BookmarkBorderIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {selectedContent.type} • {selectedContent.metadata?.readTime} min read
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedContent.content}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {selectedContent.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedContent(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Filter Dialog */}
      <Dialog
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filter Content</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {/* Add categories here */}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setFilters({ type: '', category: '', search: '' });
            setIsFilterOpen(false);
          }}>
            Reset
          </Button>
          <Button onClick={() => setIsFilterOpen(false)}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentDisplay; 