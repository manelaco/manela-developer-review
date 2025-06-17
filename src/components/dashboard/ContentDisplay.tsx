import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import MUIGrid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
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
  const [filters, setFilters] = useState<{
    type?: Content['type'];
    category?: string;
    search?: string;
  }>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch content based on user role and filters
  const { data: content = [], isLoading } = useQuery({
    queryKey: ['content', filters, user?.role],
    queryFn: () => getContent({
      ...filters,
      status: 'published'
    })
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Update filters based on tab
    switch (newValue) {
      case 0: // All
        setFilters(prev => ({ ...prev, type: undefined }));
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
    if (user) {
      await incrementContentView(content.id, user.id, user.role);
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
            <MUIGrid container spacing={2}>
              {content.map((item) => (
                <MUIGrid size={{ xs: 12, md: 6, lg: 4 }} key={item.id}>
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
                </MUIGrid>
              ))}
            </MUIGrid>
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
          <MUIGrid container spacing={2} sx={{ mt: 1 }}>
            <MUIGrid size={12}>
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
            </MUIGrid>
          </MUIGrid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setFilters({ type: undefined, category: '', search: '' });
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