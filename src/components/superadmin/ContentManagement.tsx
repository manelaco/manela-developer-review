import React, { useState, useEffect } from 'react';
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
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  History as HistoryIcon,
  Close as CloseIcon
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
  getTags,
  getCompanies,
  Company,
  ContentAuditLog,
  getContentAuditLogs
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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [targetMode, setTargetMode] = useState<'all' | 'only' | 'allExcept'>('all');
  const [targetCompanyIds, setTargetCompanyIds] = useState<string[]>([]);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [selectedContentForAudit, setSelectedContentForAudit] = useState<Content | null>(null);
  const [auditLogs, setAuditLogs] = useState<ContentAuditLog[]>([]);
  const [auditFilters, setAuditFilters] = useState({
    start_date: '',
    end_date: '',
    action: ''
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

  useEffect(() => {
    getCompanies().then(setCompanies);
  }, []);

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

  const handleViewAuditLogs = async (content: Content) => {
    setSelectedContentForAudit(content);
    setShowAuditLogs(true);
    try {
      const logs = await getContentAuditLogs({
        content_id: content.id,
        ...auditFilters
      });
      setAuditLogs(logs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to fetch audit logs');
    }
  };

  const handleAuditFilterChange = async () => {
    if (!selectedContentForAudit) return;
    try {
      const logs = await getContentAuditLogs({
        content_id: selectedContentForAudit.id,
        ...auditFilters
      });
      setAuditLogs(logs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to fetch audit logs');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const contentData = {
      title: formData.get('title') as string,
      type: formData.get('type') as any,
      content: formData.get('content') as string,
      status: formData.get('status') as any,
      category: formData.get('category') as string,
      tags: formData.getAll('tags') as string[],
      author_id: user?.id || '',
      metadata: {
        readTime: parseInt(formData.get('readTime') as string) || undefined,
        featured: formData.get('featured') === 'true',
        priority: parseInt(formData.get('priority') as string) || undefined,
        targetRoles: formData.getAll('targetRoles') as ('hr_admin' | 'employee')[],
        targetCompanies: {
          mode: targetMode,
          companyIds: targetCompanyIds
        }
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
                  <MenuItem value="blog">Blog</MenuItem>
                  <MenuItem value="article">Article</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
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
                        <IconButton onClick={() => handleViewAuditLogs(item)}>
                          <HistoryIcon />
                        </IconButton>
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

      {/* Audit Logs Dialog */}
      <Dialog
        open={showAuditLogs}
        onClose={() => setShowAuditLogs(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Audit Logs - {selectedContentForAudit?.title}
            </Typography>
            <IconButton onClick={() => setShowAuditLogs(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={auditFilters.start_date}
                  onChange={(e) => {
                    setAuditFilters(prev => ({ ...prev, start_date: e.target.value }));
                    handleAuditFilterChange();
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  value={auditFilters.end_date}
                  onChange={(e) => {
                    setAuditFilters(prev => ({ ...prev, end_date: e.target.value }));
                    handleAuditFilterChange();
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Action</InputLabel>
                  <Select
                    value={auditFilters.action}
                    label="Action"
                    onChange={(e) => {
                      setAuditFilters(prev => ({ ...prev, action: e.target.value }));
                      handleAuditFilterChange();
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="create">Create</MenuItem>
                    <MenuItem value="update">Update</MenuItem>
                    <MenuItem value="delete">Delete</MenuItem>
                    <MenuItem value="view">View</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Changes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        color={
                          log.action === 'create' ? 'success' :
                          log.action === 'update' ? 'primary' :
                          log.action === 'delete' ? 'error' :
                          'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{log.user_id}</TableCell>
                    <TableCell>{log.user_role}</TableCell>
                    <TableCell>
                      {log.changes?.map((change, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {change.field}:
                          </Typography>
                          <Typography variant="body2">
                            {change.old_value === null ? (
                              <span style={{ color: 'green' }}>Added: {JSON.stringify(change.new_value)}</span>
                            ) : change.new_value === null ? (
                              <span style={{ color: 'red' }}>Removed: {JSON.stringify(change.old_value)}</span>
                            ) : (
                              <>
                                <span style={{ color: 'red' }}>{JSON.stringify(change.old_value)}</span>
                                {' → '}
                                <span style={{ color: 'green' }}>{JSON.stringify(change.new_value)}</span>
                              </>
                            )}
                          </Typography>
                        </Box>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

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
                    <MenuItem value="blog">Blog</MenuItem>
                    <MenuItem value="article">Article</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
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
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Target Companies</Typography>
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <InputLabel>Target Mode</InputLabel>
                  <Select
                    value={targetMode}
                    label="Target Mode"
                    onChange={e => setTargetMode(e.target.value as 'all' | 'only' | 'allExcept')}
                  >
                    <MenuItem value="all">All Companies</MenuItem>
                    <MenuItem value="only">Only Selected Companies</MenuItem>
                    <MenuItem value="allExcept">All Except Selected Companies</MenuItem>
                  </Select>
                </FormControl>
                {(targetMode === 'only' || targetMode === 'allExcept') && (
                  <Autocomplete
                    multiple
                    options={companies}
                    getOptionLabel={option => option.name}
                    value={companies.filter(c => targetCompanyIds.includes(c.id))}
                    onChange={(_, value) => setTargetCompanyIds(value.map(c => c.id))}
                    renderInput={params => <TextField {...params} label="Companies" placeholder="Select companies" />}
                  />
                )}
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