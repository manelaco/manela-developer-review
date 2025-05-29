import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Plus, 
  FileText, 
  BookOpen, 
  Settings, 
  Download, 
  Video, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  SlidersHorizontal, 
  Calendar, 
  UserPlus, 
  ClipboardList, 
  Bell,
  Users,
  FileCheck,
  Briefcase,
  Book,
  MessageCircle,
  Clock,
  ArrowRight,
  LayoutDashboard,
  HelpCircle,
  Menu
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { toast } from 'sonner';
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { addDays, startOfWeek, endOfWeek, format, isWithinInterval, parseISO, isSameDay, isSameWeek } from 'date-fns';
import { testSupabaseConnection } from '../../lib/db';
import { toZonedTime } from 'date-fns-tz';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { EmployeeForm } from './EmployeeForm';
import { Employee, getEmployees, addEmployee, updateEmployee, deleteEmployee, insertMockEmployees, getEmployeesForWeek } from '@/lib/db';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import ContentDisplay from './ContentDisplay';
import { Box } from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import Overview from './Overview';
import EmployeeManagement from './EmployeeManagement';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { useUserProfile } from '@/hooks/useUserProfile';
import OnboardingModal from '@/components/onboarding/OnboardingModal';

interface OnboardingData {
  companyName?: string;
  preferredDomain?: string;
  companySize?: string;
  industry?: string;
  role?: string;
  tenant?: string;
  platforms?: { id: string; name: string; seats: number; selected: boolean; }[];
  resources?: string[];
}

const resourceImages: Record<string, string> = {
  legal: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=600&auto=format&fit=crop',
  tracking: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
  updates: 'https://images.unsplash.com/photo-1615403916271-e2dbc8cf3bf4?q=80&w=600&auto=format&fit=crop',
  templates: 'https://images.unsplash.com/photo-1568311566749-28c6f66159b9?q=80&w=600&auto=format&fit=crop',
  backfilling: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=600&auto=format&fit=crop',
  resources: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=600&auto=format&fit=crop',
  reintegration: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&auto=format&fit=crop',
};

const colorClasses: Record<string, string> = {
  legal: 'bg-blue-50 text-blue-800',
  tracking: 'bg-purple-50 text-purple-800',
  updates: 'bg-green-50 text-green-800',
  templates: 'bg-amber-50 text-amber-800',
  backfilling: 'bg-rose-50 text-rose-800',
  resources: 'bg-emerald-50 text-emerald-800',
  reintegration: 'bg-indigo-50 text-indigo-800',
};

const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

const newsHeadlines = [
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

const brandColor = 'text-[#A85B2A]';
const brandBg = 'bg-[#F8F6F3]';
const brandSidebar = 'bg-[#F8F6F3] border-r border-[#E5E3DF]';
const brandActive = 'bg-[#EDE6DE] text-[#A85B2A] font-semibold';

const navItems = [
  { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, active: true },
  { name: 'Leave Plans', icon: <Users className="h-5 w-5" /> },
  { name: 'Template Library', icon: <FileText className="h-5 w-5" /> },
  { name: 'Learning Center', icon: <BookOpen className="h-5 w-5" /> },
  { name: 'Company Settings', icon: <Settings className="h-5 w-5" /> },
  { name: 'Help Center', icon: <HelpCircle className="h-5 w-5" /> },
];

const actionCards = [
  {
    title: 'Create global policy',
    icon: <Calendar className="h-6 w-6 text-[#2A7FA8]" />,
    btn: 'View details',
    color: 'bg-[#F3F8FC]'
  },
  {
    title: 'Create a custom leave plan',
    icon: <UserPlus className="h-6 w-6 text-[#2A4CA8]" />,
    btn: 'View details',
    color: 'bg-[#F3F4FC]'
  },
  {
    title: 'Template library',
    icon: <FileText className="h-6 w-6 text-[#A85B2A]" />,
    btn: 'View details',
    color: 'bg-[#FCF6F3]'
  },
];

const employees = [
  { name: 'Finn Hansen', job: 'Marketing Lead', leave: '2023-05-05', return: '2024-05-05', type: 'Parental', status: 'ACTIVE', support: 'Activated', avatar: '' },
  { name: 'Hanna Baptista', job: 'Graphic Designer', leave: '2023-05-05', return: '2024-05-05', type: 'Long-term', status: 'ON LEAVE', support: 'Service Initiated', avatar: '' },
  { name: 'Melinda Creel', job: 'Finance Director', leave: '2023-05-05', return: '2024-05-05', type: 'Caregiver', status: 'DELAYED', support: 'Service Initiated', avatar: '' },
  { name: 'Rayna Torff', job: 'Project Manager', leave: '2023-05-05', return: '2024-05-05', type: 'Long - extended leave', status: 'ACTIVE', support: 'Activated', avatar: '' },
  { name: 'Giana Lipshutz', job: 'Creative Director', leave: '2023-05-05', return: '2024-05-05', type: 'Union short leave', status: 'ON LEAVE', support: 'Service Initiated', avatar: '' },
  { name: 'James George', job: 'Business Analyst', leave: '2023-05-05', return: '2024-05-05', type: 'Other - Long-term', status: 'DELAYED', support: 'Service Initiated', avatar: '' },
  { name: 'Jordyn George', job: 'IT Support Staff', leave: '2023-05-05', return: '2024-05-05', type: 'Other - Short', status: 'ON LEAVE', support: 'Activated', avatar: '' },
  { name: 'Skylar Herwitz', job: 'Manager, Comms', leave: '2023-05-05', return: '2024-05-05', type: 'Request - Adoption', status: 'ACTIVE', support: 'Activated', avatar: '' },
];

const calendarDays = [15, 16, 17, 18, 19, 20, 21];
const today = 19;

const events = [
  { name: 'James Carter', date: 'May 23 - Jun 10', type: 'Parental Leave', avatar: '', color: 'bg-[#F3F8FC] text-[#2A7FA8]' },
  { name: 'James Carter', date: 'May 23 - Jun 10', type: 'Parental Leave', avatar: '', color: 'bg-[#F3F8FC] text-[#2A7FA8]' },
];
const returning = [
  { name: 'David Kim', date: 'Returning May 26 - Family Leave', note: 'Reintegration documents needed', color: 'bg-[#E6F7F1] text-[#1CA97A]' },
];
const news = [
  { title: 'Supreme Court Rules on Paid Parental Leave', date: '16 May 2023', time: '4 min read', featured: true },
  { title: 'New Federal Guidance on Sick Leave Policies', date: '14 May 2023', time: '4 min read' },
  { title: 'State Bills Expand Family Leave', date: '10 May 2023', time: '3 min read' },
];

const MONTREAL_TZ = 'America/Toronto';
const getMontrealNow = () => toZonedTime(new Date(), MONTREAL_TZ);

const formatDisplayDate = (date) => format(date, `MMM do '’'yy`);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<OnboardingData>({});
  const [loading, setLoading] = useState(true);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmployeeSheetOpen, setIsEmployeeSheetOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sidebarWeekStart, setSidebarWeekStart] = useState(() => startOfWeek(getMontrealNow(), { weekStartsOn: 1 }));
  const queryClient = useQueryClient();
  const { user, isSuperadmin, viewedCompanyId } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const { company_id, loading: profileLoading } = useUserProfile(user?.id);
  const { status: onboardingStatus, error: onboardingError } = useOnboardingStatus(user?.id);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => getEmployeesForWeek(new Date()),
  });

  const addEmployeeMutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsEmployeeSheetOpen(false);
      toast.success('Employee added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add employee');
      console.error('Add employee error:', error);
    },
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsEmployeeSheetOpen(false);
      setSelectedEmployee(null);
      toast.success('Employee updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update employee');
      console.error('Update employee error:', error);
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
      toast.success('Employee deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete employee');
      console.error('Delete employee error:', error);
    },
  });

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsEmployeeSheetOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEmployeeSheetOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleEmployeeSubmit = async (formData: any) => {
    if (selectedEmployee) {
      await updateEmployeeMutation.mutateAsync({
        id: selectedEmployee.id,
        data: formData,
      });
    } else {
      await addEmployeeMutation.mutateAsync(formData);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedEmployee) {
      await deleteEmployeeMutation.mutateAsync(selectedEmployee.id);
    }
  };

  const weekDays = getWeekDays(calendarDate);
  const weekStart = startOfWeek(calendarDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(calendarDate, { weekStartsOn: 1 });

  const sidebarWeekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(sidebarWeekStart, i)), [sidebarWeekStart]);
  const sidebarWeekEnd = endOfWeek(sidebarWeekStart, { weekStartsOn: 1 });
  const todayMontreal = getMontrealNow();
  const isCurrentWeek = isSameWeek(todayMontreal, sidebarWeekStart, { weekStartsOn: 1 });

  const parsedEmployees = useMemo(() => employees.map(emp => ({
    ...emp,
    leaveDate: emp.leave_date ? parseISO(emp.leave_date) : null,
    returnDate: emp.return_date ? parseISO(emp.return_date) : null,
  })), [employees]);

  const leavingThisWeek = useMemo(() => parsedEmployees.filter(emp =>
    emp.leaveDate && isWithinInterval(emp.leaveDate, { start: sidebarWeekStart, end: sidebarWeekEnd })
  ), [parsedEmployees, sidebarWeekStart, sidebarWeekEnd]);

  const returningThisWeek = useMemo(() => parsedEmployees.filter(emp =>
    emp.returnDate && isWithinInterval(emp.returnDate, { start: sidebarWeekStart, end: sidebarWeekEnd })
  ), [parsedEmployees, sidebarWeekStart, sidebarWeekEnd]);

  const currentlyOnLeave = useMemo(() => parsedEmployees.filter(emp =>
    emp.leaveDate && emp.returnDate && emp.leaveDate <= sidebarWeekEnd && emp.returnDate >= sidebarWeekStart
  ), [parsedEmployees, sidebarWeekStart, sidebarWeekEnd]);

  const reintegrationTrack = useMemo(() => parsedEmployees.filter(emp =>
    emp.status && emp.status.toUpperCase() === 'REINTEGRATION'
  ), [parsedEmployees]);

  const dayEventCounts = useMemo(() => sidebarWeekDays.map(day => {
    const leavingCount = parsedEmployees.filter(emp => emp.leaveDate && isSameDay(emp.leaveDate, day)).length;
    const returningCount = parsedEmployees.filter(emp => emp.returnDate && isSameDay(emp.returnDate, day)).length;
    return { leaving: leavingCount, returning: returningCount };
  }), [parsedEmployees, sidebarWeekDays]);

  const [eventTab, setEventTab] = useState<'leaving'|'returning'|'onleave'|'reintegration'>('leaving');

  const goToPrevWeek = useCallback(() => setSidebarWeekStart(prev => addDays(prev, -7)), []);
  const goToNextWeek = useCallback(() => setSidebarWeekStart(prev => addDays(prev, 7)), []);
  const goToCurrentWeek = useCallback(() => setSidebarWeekStart(startOfWeek(getMontrealNow(), { weekStartsOn: 1 })), []);

  useEffect(() => {
    // Retrieve user data from local storage
    const storedData = localStorage.getItem('onboardingData');
    
    if (!storedData) {
      // If no data, redirect back to onboarding
      navigate('/onboarding/step-one');
      return;
    }
    
    try {
      setData(JSON.parse(storedData));
    } catch (error) {
      console.error('Error parsing onboarding data:', error);
      toast.error('Something went wrong loading your data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const getResourceCards = () => {
    const allResources = [
      { 
        id: 'legal', 
        title: 'Legal Requirements',
        description: 'Stay updated on legal requirements for parental leave',
        longDesc: 'Comprehensive information about federal and state regulations regarding parental leave policies, employee rights, and employer responsibilities.',
        icon: <FileText className="h-6 w-6" />,
        readTime: '8 min read',
        updatedAt: '2 days ago'
      },
      { 
        id: 'tracking', 
        title: 'Employee Tracking',
        description: 'Track leaves, return dates and set up email reminders',
        longDesc: 'Efficient tools to manage employee leave schedules, automate notifications, and ensure smooth transitions for teams during parental leave periods.',
        icon: <Users className="h-6 w-6" />,
        readTime: '5 min read',
        updatedAt: '1 week ago'
      },
      { 
        id: 'updates', 
        title: 'Latest Updates',
        description: 'News and trends in parental leave policies',
        longDesc: 'Stay informed about evolving best practices, industry benchmarks, and innovative approaches to parental leave programs across various sectors.',
        icon: <BookOpen className="h-6 w-6" />,
        readTime: '6 min read',
        updatedAt: 'Today'
      },
      { 
        id: 'templates', 
        title: 'Templates',
        description: 'Ready-to-use branded documents and agreements',
        longDesc: 'Customizable document templates including leave request forms, return-to-work plans, and policy communications that can be tailored to your company brand.',
        icon: <FileCheck className="h-6 w-6" />,
        readTime: '4 min read',
        updatedAt: '3 days ago'
      },
      { 
        id: 'backfilling', 
        title: 'Backfilling Support',
        description: 'Resources for temporary replacements and coverage',
        longDesc: 'Strategies and tools for effectively managing workload redistribution, hiring temporary staff, and maintaining productivity during employee leave periods.',
        icon: <Briefcase className="h-6 w-6" />,
        readTime: '10 min read',
        updatedAt: '5 days ago'
      },
      { 
        id: 'resources', 
        title: 'General Resources',
        description: 'Tips, guides and best practices for parental leave',
        longDesc: 'Comprehensive guides covering all aspects of parental leave management, from policy development to employee support and team adaptation strategies.',
        icon: <Book className="h-6 w-6" />,
        readTime: '12 min read',
        updatedAt: '1 day ago'
      },
      { 
        id: 'reintegration', 
        title: 'Reintegration Support',
        description: 'Help returning employees transition back successfully',
        longDesc: 'Proven methodologies to ease the transition for employees returning from leave, including flexible schedules, mentoring programs, and emotional support resources.',
        icon: <MessageCircle className="h-6 w-6" />,
        readTime: '7 min read',
        updatedAt: '4 days ago'
      }
    ];
    
    const selectedResources = data.resources || ['legal']; // Default to legal if none selected
    
    return allResources.filter(resource => 
      selectedResources.includes(resource.id)
    );
  };

  const rightColumn = (
    <div className="flex flex-col h-full p-6 gap-6 bg-gray-50">
      {/* Calendar Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            onClick={() => setCalendarDate(addDays(calendarDate, -7))}
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="font-bold text-base text-navy text-center flex-1">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </div>
          <button
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            onClick={() => setCalendarDate(addDays(calendarDate, 7))}
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, idx) => (
            <div key={idx} className={
              'flex flex-col items-center justify-center rounded-lg py-2.5 transition-colors ' +
              (format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                ? 'bg-brand text-white font-bold shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100')
            }>
              <span className="text-xs uppercase tracking-wide mb-1">{format(day, 'EEE')}</span>
              <span className="text-base">{format(day, 'd')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Events Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm">
        <div className="font-bold text-base text-navy mb-4">This Week's Events</div>
        <div className="text-gray-400 text-sm py-2">No employee leave or return events this week.</div>
      </div>

      {/* News Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm">
        <div className="font-bold text-base text-navy mb-4">Parental Leave News</div>
        <ul className="flex flex-col gap-2">
          {newsHeadlines.map((news, idx) => (
            <li key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex flex-col min-w-0">
                <a href={news.url} className="font-medium text-gray-800 hover:text-brand text-sm truncate" target="_blank" rel="noopener noreferrer">{news.title}</a>
                <span className="text-xs text-gray-400">{news.source}</span>
              </div>
              <span className="text-gray-300 text-lg ml-3 flex-shrink-0">→</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  if (profileLoading || onboardingStatus === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Checking onboarding status...</div>;
  }

  if (onboardingStatus === 'error') {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {onboardingError}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  const domain = data.preferredDomain ? `${data.preferredDomain}.manela.com` : 'yourdomain.manela.com';
  const userInitials = data.role?.split(' ').map(name => name[0]).join('') || 'HR';
  const resourceCards = getResourceCards();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'content':
        return <ContentDisplay />;
      case 'employees':
        return <EmployeeManagement />;
      default:
        return <Overview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Onboarding Modal Overlay */}
        {user?.id && onboardingStatus === 'incomplete' && !onboardingComplete && (
          <>
            <div className="fixed inset-0 bg-black/40 z-[1000] pointer-events-auto" />
            <OnboardingModal
              userId={user.id}
              onComplete={() => {
                setOnboardingComplete(true);
                window.location.reload(); // or refetch onboarding status if you want a smoother UX
              }}
            />
          </>
        )}
        {/* Dashboard Content (locked if onboarding incomplete) */}
        <div className={`flex-1 ${onboardingStatus === 'incomplete' && !onboardingComplete ? 'opacity-50 pointer-events-none select-none' : ''}`}>
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#F8F6F3] border border-[#E5E3DF]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6 text-[#A85B2A]" />
          </button>

          {/* Left Sidebar */}
          <aside className={
            [
              'w-64',
              brandSidebar,
              'flex flex-col py-8 px-4 z-40',
              isMobileMenuOpen ? 'fixed inset-y-0 left-0 transform translate-x-0 transition-transform duration-200 ease-in-out' : 'fixed inset-y-0 left-0 -translate-x-full transition-transform duration-200 ease-in-out',
              'lg:static lg:translate-x-0 lg:inset-y-auto lg:left-auto lg:transform-none lg:transition-none'
            ].join(' ')
          }>
            <div className="mb-10 flex items-center gap-2 px-2">
              <span className={`text-3xl font-bold ${brandColor} tracking-tight`}>manela</span>
              {isSuperadmin && viewedCompanyId && (
                <Badge className="ml-2 bg-[#EDE6DE] text-[#A85B2A] px-2 py-1 rounded text-xs">
                  Viewing as Company
                </Badge>
              )}
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <div
                  key={item.name}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-[#EDE6DE] hover:text-[#A85B2A] cursor-pointer ${item.active ? brandActive : ''}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-h-screen bg-white">
            {/* Header */}
            <header className="h-20 flex items-center justify-between border-b border-[#E5E3DF] px-4 md:px-8">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              {isSuperadmin && viewedCompanyId && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/superadmin')}
                  className="text-[#A85B2A] border-[#A85B2A] hover:bg-[#EDE6DE]"
                >
                  Exit Company View
                </Button>
              )}
            </header>

            {/* Welcome */}
            <div className="px-4 md:px-8 pt-8 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back, Wolf Pixel <span className="inline-block">👋</span></h2>
            </div>

            {/* Action Cards */}
            <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-8 pb-8">
              {actionCards.map((card, i) => (
                <div key={i} className={`flex-1 rounded-xl border border-[#E5E3DF] ${card.color} flex flex-col items-start p-6 min-w-[220px]`}>
                  <div className="mb-4">{card.icon}</div>
                  <div className="font-semibold text-lg mb-2 text-gray-900">{card.title}</div>
                  <Button variant="outline" className="mt-auto px-3 py-2 border border-[#E5E3DF] text-gray-700 flex items-center gap-2 group">
                    {card.btn}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Employees Table */}
            <div className="px-4 md:px-8 pb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Employees</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        await insertMockEmployees();
                        toast.success('Mock data inserted successfully');
                        queryClient.invalidateQueries({ queryKey: ['employees'] });
                      } catch (error) {
                        toast.error('Failed to insert mock data');
                      }
                    }}
                  >
                    Insert Mock Data
                  </Button>
                  <Button 
                    className="bg-black text-white px-5 py-2 rounded-lg text-sm font-semibold w-full lg:w-auto"
                    onClick={handleAddEmployee}
                  >
                    + Add New Employee
                  </Button>
                </div>
              </div>
              <div className="bg-white border border-[#E5E3DF] rounded-xl overflow-x-auto">
                <table className="w-full text-sm min-w-[800px]">
                  <thead className="bg-[#F8F6F3]">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium text-gray-500">Employee Name</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-500">Job Title</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-500">Leave dates</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-500">Return date</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-500">Leave type</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-500">Employee Status</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-500">Support Center</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr 
                        key={emp.id} 
                        className="border-b border-[#F8F6F3] hover:bg-[#F8F6F3] cursor-pointer transition-colors"
                        onClick={() => handleEditEmployee(emp)}
                      >
                        <td className="px-6 py-3">
                          <span className="font-medium text-gray-900">{emp.name}</span>
                        </td>
                        <td className="px-6 py-3 text-gray-700">{emp.job_title}</td>
                        <td className="px-6 py-3 text-gray-700">{emp.leave_date}</td>
                        <td className="px-6 py-3 text-gray-700">{emp.return_date}</td>
                        <td className="px-6 py-3 text-gray-700">{emp.leave_type}</td>
                        <td className="px-6 py-3">
                          <Badge className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            emp.status === 'ACTIVE' ? 'bg-[#E6F7F1] text-[#1CA97A]' : 
                            emp.status === 'ON LEAVE' ? 'bg-[#F3F8FC] text-[#2A7FA8]' : 
                            'bg-[#FCF6F3] text-[#A85B2A]'
                          }`}>
                            {emp.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 text-gray-700">{emp.support_status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:block w-96 bg-white border-l border-[#E5E3DF] flex flex-col px-6 py-8 gap-6">
            {/* Calendar */}
            <div className="bg-[#F8F6F3] rounded-xl p-5 mb-2">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-900">{format(sidebarWeekStart, 'MMMM yyyy')}</span>
                <div className="flex gap-2 items-center">
                  {!isCurrentWeek && (
                    <button onClick={goToCurrentWeek} className="p-1 rounded hover:bg-[#EDE6DE]" title="Back to today">
                      <Calendar className="h-5 w-5 text-[#A85B2A]" />
                    </button>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToPrevWeek}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToNextWeek}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
                <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {sidebarWeekDays.map((day, idx) => (
                  <div key={idx} className={`py-1.5 rounded-lg relative ${isSameDay(day, todayMontreal) ? 'bg-[#A85B2A] text-white font-bold' : 'bg-white text-gray-900'}`}>
                    {format(day, 'd')}
                  </div>
                ))}
              </div>
            </div>

            {/* Event Tabs */}
            <div className="flex gap-2 mb-2">
              <button className={`px-3 py-1 rounded ${eventTab==='leaving' ? 'bg-[#EDE6DE] text-[#A85B2A]' : 'bg-[#F8F6F3] text-gray-700'}`} onClick={()=>setEventTab('leaving')}>Leaving</button>
              <button className={`px-3 py-1 rounded ${eventTab==='returning' ? 'bg-[#EDE6DE] text-[#A85B2A]' : 'bg-[#F8F6F3] text-gray-700'}`} onClick={()=>setEventTab('returning')}>Returning</button>
              <button className={`px-3 py-1 rounded ${eventTab==='onleave' ? 'bg-[#EDE6DE] text-[#A85B2A]' : 'bg-[#F8F6F3] text-gray-700'}`} onClick={()=>setEventTab('onleave')}>On Leave</button>
              <button className={`px-3 py-1 rounded ${eventTab==='reintegration' ? 'bg-[#EDE6DE] text-[#A85B2A]' : 'bg-[#F8F6F3] text-gray-700'}`} onClick={()=>setEventTab('reintegration')}>Reintegration</button>
            </div>
            <div>
              {eventTab === 'leaving' && leavingThisWeek.length === 0 && <div className="text-gray-400 text-sm py-2">No employees leaving this week.</div>}
              {eventTab === 'leaving' && leavingThisWeek.map((emp, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2 mb-2 bg-[#F3F8FC] text-[#2A7FA8]">
                  <Avatar className="h-7 w-7 bg-[#EDE6DE] text-[#A85B2A] font-bold">{emp.name.split(' ').map(n => n[0]).join('')}</Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{emp.name}</div>
                    <div className="text-xs">{formatDisplayDate(emp.leaveDate)} · {emp.type}</div>
                  </div>
                </div>
              ))}
              {eventTab === 'returning' && returningThisWeek.length === 0 && <div className="text-gray-400 text-sm py-2">No employees returning this week.</div>}
              {eventTab === 'returning' && returningThisWeek.map((emp, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2 mb-2 bg-[#E6F7F1] text-[#1CA97A]">
                  <Avatar className="h-7 w-7 bg-[#EDE6DE] text-[#A85B2A] font-bold">{emp.name.split(' ').map(n => n[0]).join('')}</Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{emp.name}</div>
                    <div className="text-xs">{formatDisplayDate(emp.returnDate)} · {emp.type}</div>
                  </div>
                </div>
              ))}
              {eventTab === 'onleave' && currentlyOnLeave.length === 0 && <div className="text-gray-400 text-sm py-2">No employees on leave this week.</div>}
              {eventTab === 'onleave' && currentlyOnLeave.map((emp, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2 mb-2 bg-[#F8F6F3] text-gray-700">
                  <Avatar className="h-7 w-7 bg-[#EDE6DE] text-[#A85B2A] font-bold">{emp.name.split(' ').map(n => n[0]).join('')}</Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{emp.name}</div>
                    <div className="text-xs">{formatDisplayDate(emp.leaveDate)} - {formatDisplayDate(emp.returnDate)} · {emp.type}</div>
                  </div>
                </div>
              ))}
              {eventTab === 'reintegration' && reintegrationTrack.length === 0 && <div className="text-gray-400 text-sm py-2">No employees on reintegration track.</div>}
              {eventTab === 'reintegration' && reintegrationTrack.map((emp, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2 mb-2 bg-[#FCF6F3] text-[#A85B2A]">
                  <Avatar className="h-7 w-7 bg-[#EDE6DE] text-[#A85B2A] font-bold">{emp.name.split(' ').map(n => n[0]).join('')}</Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{emp.name}</div>
                    <div className="text-xs">{formatDisplayDate(emp.leaveDate)} - {formatDisplayDate(emp.returnDate)} · {emp.type}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* News */}
            <div>
              <div className="font-semibold text-gray-900 mb-2">Legal Leave News</div>
              <input className="w-full mb-2 px-3 py-2 rounded-lg border border-[#E5E3DF] text-sm" placeholder="Search news or topics..." />
              <div className="flex flex-col gap-2">
                {news.map((n, i) => (
                  <div key={i} className={`rounded-lg px-3 py-2 ${n.featured ? 'bg-[#FCF6F3] border-l-4 border-[#A85B2A]' : 'bg-[#F8F6F3]' }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {n.featured && <span className="text-xs font-semibold text-[#A85B2A] bg-[#EDE6DE] px-2 py-0.5 rounded">Featured</span>}
                      <span className="font-medium text-gray-900 text-sm">{n.title}</span>
                    </div>
                    <div className="text-xs text-gray-500">{n.date} · {n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Employee Form Sheet */}
          <Sheet open={isEmployeeSheetOpen} onOpenChange={setIsEmployeeSheetOpen}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{selectedEmployee ? 'Employee Details' : 'Add New Employee'}</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <EmployeeForm
                  employee={selectedEmployee || undefined}
                  onSubmit={handleEmployeeSubmit}
                  onCancel={() => {
                    setIsEmployeeSheetOpen(false);
                    setSelectedEmployee(null);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the employee record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
