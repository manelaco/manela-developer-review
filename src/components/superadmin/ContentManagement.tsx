import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Autocomplete
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { 
  Content, 
  ContentCategory, 
  ContentTag,
  getContent, 
  createContent, 
  updateContent, 
  deleteContent,
  getCategories,
  getTags
} from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ContentManagement: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    category: '',
    search: ''
  });

  // Fetch content
  const { data: content = [], isLoading } = useQuery({
    queryKey: ['content', filters],
    queryFn: () => getContent(filters)
  });

  // Fetch categories and tags
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      setIsDialogOpen(false);
      toast.success('Content created successfully');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Content> }) => updateContent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      setIsDialogOpen(false);
      setSelectedContent(null);
      toast.success('Content updated successfully');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success('Content deleted successfully');
    }
  });

  const handleCreate = () => {
    setSelectedContent(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (content: Content) => {
    setSelectedContent(content);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const contentData = {
      title: formData.get('title') as string,
      type: formData.get('type') as Content['type'],
      content: formData.get('content') as string,
      status: formData.get('status') as Content['status'],
      category: formData.get('category') as string,
      tags: formData.getAll('tags') as string[],
      author_id: user?.id || '',
      metadata: {
        readTime: parseInt(formData.get('readTime') as string) || undefined,
        featured: formData.get('featured') === 'true',
        priority: parseInt(formData.get('priority') as string) || undefined,
        targetRoles: formData.getAll('targetRoles') as ('hr_admin' | 'employee')[]
      }
    };

    if (selectedContent) {
      await updateMutation.mutateAsync({ id: selectedContent.id, data: contentData });
    } else {
      await createMutation.mutateAsync(contentData);
    }
  };

  return (
    <Box>
      <Card>
        <CardHeader 
          title="Content Management"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Create Content
            </Button>
          }
        />
        <CardContent>
          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  label="Type"
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="article">Article</MenuItem>
                  <MenuItem value="resource">Resource</MenuItem>
                  <MenuItem value="policy">Policy</MenuItem>
                  <MenuItem value="template">Template</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                  <MenuItem value="">All</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Content List */}
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Box>
              {content.map((item) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6">{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.type} • {item.status} • {new Date(item.created_at).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {item.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                          ))}
                        </Box>
                      </Box>
                      <Box>
                        <IconButton onClick={() => handleEdit(item)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedContent(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedContent ? 'Edit Content' : 'Create Content'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="title"
                  label="Title"
                  defaultValue={selectedContent?.title}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    label="Type"
                    defaultValue={selectedContent?.type || 'article'}
                    required
                  >
                    <MenuItem value="article">Article</MenuItem>
                    <MenuItem value="resource">Resource</MenuItem>
                    <MenuItem value="policy">Policy</MenuItem>
                    <MenuItem value="template">Template</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    label="Status"
                    defaultValue={selectedContent?.status || 'draft'}
                    required
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="content"
                  label="Content"
                  multiline
                  rows={4}
                  defaultValue={selectedContent?.content}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={tags.map(tag => tag.name)}
                  defaultValue={selectedContent?.tags}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Add tags"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="readTime"
                  label="Read Time (minutes)"
                  type="number"
                  defaultValue={selectedContent?.metadata?.readTime}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="priority"
                  label="Priority"
                  type="number"
                  defaultValue={selectedContent?.metadata?.priority}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Target Roles</InputLabel>
                  <Select
                    multiple
                    name="targetRoles"
                    label="Target Roles"
                    defaultValue={selectedContent?.metadata?.targetRoles || []}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="hr_admin">HR Admin</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setIsDialogOpen(false);
              setSelectedContent(null);
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {selectedContent ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ContentManagement; 