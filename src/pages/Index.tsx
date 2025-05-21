import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { Users, FileText, BookOpen, MessageCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const startOnboarding = () => {
    // Clear any previous onboarding data
    localStorage.removeItem('onboardingData');
    navigate('/onboarding/step-one');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo />
          <div className="flex gap-4">
            <Button onClick={goToDashboard} variant="outline" className="border-manela text-manela hover:bg-manela hover:text-white">
              Go to Dashboard
            </Button>
            <Button onClick={startOnboarding} className="bg-manela hover:bg-manela-dark">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Simplify your parental leave management
              </h1>
              <p className="text-xl text-gray-600 mb-10">
                All-in-one platform for companies to support employees through parenthood journey,
                from leave planning to successful reintegration.
              </p>
              <Button onClick={startOnboarding} className="h-12 px-8 text-lg bg-manela hover:bg-manela-dark">
                Start free trial
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our comprehensive support system
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-manela bg-opacity-10 flex items-center justify-center text-manela mb-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <CardTitle>Legal Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Stay updated with the latest legal requirements surrounding parental leave in your region.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-manela bg-opacity-10 flex items-center justify-center text-manela mb-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle>Employee Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Easily track leave periods, return dates, and set up automatic email notifications.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-manela bg-opacity-10 flex items-center justify-center text-manela mb-4">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle>Resource Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Access templates, guides, and best practices for all aspects of parental leave management.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-manela bg-opacity-10 flex items-center justify-center text-manela mb-4">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <CardTitle>Reintegration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Support returning parents with proven strategies for successful workplace reintegration.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to transform your parental leave management?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of companies that have simplified their parental leave processes with Manela.
              </p>
              <Button onClick={startOnboarding} className="h-12 px-8 text-lg bg-manela hover:bg-manela-dark">
                Get Started Today
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo />
              <p className="mt-4 text-gray-400">
                Supporting companies and employees through the parental leave journey.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Reviews</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            © 2025 HRDashboard · All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
