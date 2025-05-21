import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FileText, Users, BookOpen, FileCheck, MessageCircle, Briefcase, ArrowRight, Bell, Settings, Clock, Book, Bookmark, GalleryHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { toast } from 'sonner';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';

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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<OnboardingData>({});
  const [loading, setLoading] = useState(true);

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

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
        {/* Left sidebar content goes here */}
      </Sidebar>
      <Sidebar side="right" variant="sidebar" collapsible="offcanvas">
        {/* Right sidebar content goes here */}
      </Sidebar>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Logo />
            
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Settings className="h-5 w-5 text-gray-600" />
              </Button>
              <Avatar className="border-2 border-gray-200">
                <AvatarFallback className="bg-manela text-white font-medium">{userInitials}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-6 py-10">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-3 text-gray-900">Welcome to your Manela Dashboard</h1>
            <p className="text-gray-600 text-lg">
              {data.companyName || 'Your Company'} · {domain}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-gray-900">Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Company Size:</span>
                    <span className="font-medium text-gray-900">{data.companySize || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Industry:</span>
                    <span className="font-medium text-gray-900">{data.industry || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Your Role:</span>
                    <span className="font-medium text-gray-900">{data.role || 'HR Manager'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Tenant:</span>
                    <span className="font-medium text-gray-900">{data.tenant || 'hr'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-gray-900">Platform Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  {(data.platforms || []).filter(p => p.selected).map(platform => (
                    <div key={platform.id} className="flex justify-between items-center">
                      <span className="text-gray-500">{platform.name}:</span>
                      <Badge variant="outline" className="bg-manela/10 text-manela border-manela/20">
                        {platform.seats} seat{platform.seats !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  ))}
                  {(!data.platforms || data.platforms.filter(p => p.selected).length === 0) && (
                    <div className="text-gray-500">No platforms selected</div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-gray-900">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-900 text-sm font-medium">Account active</span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-3">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Resources</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resourceCards.map(resource => (
                <Card key={resource.id} className="bg-white shadow-sm hover:shadow-md transition-shadow border-gray-100 overflow-hidden">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={resourceImages[resource.id]}
                      alt={resource.title}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${colorClasses[resource.id]}`}>
                        {resource.icon}
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-900">{resource.title}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-600">{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{resource.longDesc}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{resource.readTime}</span>
                      </div>
                      <span>{resource.updatedAt}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" className="w-full justify-between group">
                      <span>Read more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
