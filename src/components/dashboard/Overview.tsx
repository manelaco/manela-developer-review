import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, UserPlus, FileText } from 'lucide-react';
import { actionCards, mockEvents, mockReturning, mockNews } from '@/lib/mockData';

interface OverviewProps {
  employees: any[];
  isLoading: boolean;
  onAddEmployee: () => void;
}

const Overview: React.FC<OverviewProps> = ({ employees, isLoading, onAddEmployee }) => {
  return (
    <div className="space-y-6">
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actionCards.map((card, index) => (
          <Card key={index} className={card.color}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                {card.icon === 'Calendar' && <Calendar className={`h-6 w-6 ${card.iconColor}`} />}
                {card.icon === 'UserPlus' && <UserPlus className={`h-6 w-6 ${card.iconColor}`} />}
                {card.icon === 'FileText' && <FileText className={`h-6 w-6 ${card.iconColor}`} />}
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start">
                {card.btn}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Leave and return dates for the next 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEvents.map((event, index) => (
              <div key={index} className={`p-3 rounded-lg ${event.color}`}>
                <div className="font-medium">{event.name}</div>
                <div className="text-sm">{event.date}</div>
                <div className="text-sm">{event.type}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Returning Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Returning Soon</CardTitle>
          <CardDescription>Employees returning from leave</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReturning.map((employee, index) => (
              <div key={index} className={`p-3 rounded-lg ${employee.color}`}>
                <div className="font-medium">{employee.name}</div>
                <div className="text-sm">{employee.date}</div>
                <div className="text-sm">{employee.note}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Latest News */}
      <Card>
        <CardHeader>
          <CardTitle>Latest News</CardTitle>
          <CardDescription>Updates and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockNews.map((news, index) => (
              <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                <div className="font-medium">{news.title}</div>
                <div className="text-sm text-gray-500">
                  {news.date} · {news.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview; 