export const resourceImages: Record<string, string> = {
  legal: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=600&auto=format&fit=crop',
  tracking: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
  updates: 'https://images.unsplash.com/photo-1615403916271-e2dbc8cf3bf4?q=80&w=600&auto=format&fit=crop',
  templates: 'https://images.unsplash.com/photo-1568311566749-28c6f66159b9?q=80&w=600&auto=format&fit=crop',
  backfilling: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=600&auto=format&fit=crop',
  resources: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=600&auto=format&fit=crop',
  reintegration: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&auto=format&fit=crop',
};

export const colorClasses: Record<string, string> = {
  legal: 'bg-blue-50 text-blue-800',
  tracking: 'bg-purple-50 text-purple-800',
  updates: 'bg-green-50 text-green-800',
  templates: 'bg-amber-50 text-amber-800',
  backfilling: 'bg-rose-50 text-rose-800',
  resources: 'bg-emerald-50 text-emerald-800',
  reintegration: 'bg-indigo-50 text-indigo-800',
};

export const newsHeadlines = [
  {
    title: 'Parental Leave Laws Updated in 2024',
    source: 'Government of Canada',
    url: '#',
  },
  {
    title: 'Quebec Expands Parental Leave Benefits',
    source: 'CBC News',
    url: '#',
  },
  {
    title: 'Legal Rights for New Parents: What to Know',
    source: 'Canadian Bar Association',
    url: '#',
  },
  {
    title: 'Employers Adapting to New Leave Policies',
    source: 'The Globe and Mail',
    url: '#',
  },
  {
    title: 'Political Debate: National Parental Leave Standards',
    source: 'CTV News',
    url: '#',
  },
];

export const brandColors = {
  text: 'text-[#A85B2A]',
  background: 'bg-[#F8F6F3]',
  sidebar: 'bg-[#F8F6F3] border-r border-[#E5E3DF]',
  active: 'bg-[#EDE6DE] text-[#A85B2A] font-semibold',
};

export const navItems = [
  { name: 'Dashboard', icon: 'LayoutDashboard', active: true },
  { name: 'Leave Plans', icon: 'Users' },
  { name: 'Template Library', icon: 'FileText' },
  { name: 'Learning Center', icon: 'BookOpen' },
  { name: 'Company Settings', icon: 'Settings' },
  { name: 'Help Center', icon: 'HelpCircle' },
];

export const actionCards = [
  {
    title: 'Create global policy',
    icon: 'Calendar',
    btn: 'View details',
    color: 'bg-[#F3F8FC]',
    iconColor: 'text-[#2A7FA8]'
  },
  {
    title: 'Create a custom leave plan',
    icon: 'UserPlus',
    btn: 'View details',
    color: 'bg-[#F3F4FC]',
    iconColor: 'text-[#2A4CA8]'
  },
  {
    title: 'Template library',
    icon: 'FileText',
    btn: 'View details',
    color: 'bg-[#FCF6F3]',
    iconColor: 'text-[#A85B2A]'
  },
];

export const mockEmployees = [
  { name: 'Finn Hansen', job: 'Marketing Lead', leave: '2023-05-05', return: '2024-05-05', type: 'Parental', status: 'ACTIVE', support: 'Activated', avatar: '' },
  { name: 'Hanna Baptista', job: 'Graphic Designer', leave: '2023-05-05', return: '2024-05-05', type: 'Long-term', status: 'ON LEAVE', support: 'Service Initiated', avatar: '' },
  { name: 'Melinda Creel', job: 'Finance Director', leave: '2023-05-05', return: '2024-05-05', type: 'Caregiver', status: 'DELAYED', support: 'Service Initiated', avatar: '' },
  { name: 'Rayna Torff', job: 'Project Manager', leave: '2023-05-05', return: '2024-05-05', type: 'Long - extended leave', status: 'ACTIVE', support: 'Activated', avatar: '' },
  { name: 'Giana Lipshutz', job: 'Creative Director', leave: '2023-05-05', return: '2024-05-05', type: 'Union short leave', status: 'ON LEAVE', support: 'Service Initiated', avatar: '' },
  { name: 'James George', job: 'Business Analyst', leave: '2023-05-05', return: '2024-05-05', type: 'Other - Long-term', status: 'DELAYED', support: 'Service Initiated', avatar: '' },
  { name: 'Jordyn George', job: 'IT Support Staff', leave: '2023-05-05', return: '2024-05-05', type: 'Other - Short', status: 'ON LEAVE', support: 'Activated', avatar: '' },
  { name: 'Skylar Herwitz', job: 'Manager, Comms', leave: '2023-05-05', return: '2024-05-05', type: 'Request - Adoption', status: 'ACTIVE', support: 'Activated', avatar: '' },
];

export const mockEvents = [
  { name: 'James Carter', date: 'May 23 - Jun 10', type: 'Parental Leave', avatar: '', color: 'bg-[#F3F8FC] text-[#2A7FA8]' },
  { name: 'James Carter', date: 'May 23 - Jun 10', type: 'Parental Leave', avatar: '', color: 'bg-[#F3F8FC] text-[#2A7FA8]' },
];

export const mockReturning = [
  { name: 'Example User', date: 'Returning May 26 - Family Leave', note: 'Reintegration documents needed', color: 'bg-[#E6F7F1] text-[#1CA97A]' },
];

export const mockNews = [
  { title: 'Supreme Court Rules on Paid Parental Leave', date: '16 May 2023', time: '4 min read', featured: true },
  { title: 'New Federal Guidance on Sick Leave Policies', date: '14 May 2023', time: '4 min read' },
  { title: 'State Bills Expand Family Leave', date: '10 May 2023', time: '3 min read' },
]; 