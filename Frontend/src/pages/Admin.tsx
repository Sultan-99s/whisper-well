import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminCalendar from '@/components/AdminCalendar';
import EmergencyQueue from '@/components/EmergencyQueue';
import DeclinedRequests from '@/components/DeclinedRequests';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Helper function to get all booked sessions from localStorage
const getAllBookedSessions = () => {
  try {
    const bookedSlots = localStorage.getItem('bookedSlots');
    if (!bookedSlots) return [];
    
    const bookings = JSON.parse(bookedSlots);
    const sessions = [];
    
    for (const date in bookings) {
      for (const time in bookings[date]) {
        sessions.push({
          id: `${date}-${time}`,
          email: bookings[date][time],
          date: format(new Date(date), 'MMM d, yyyy'),
          time: time
        });
      }
    }
    
    // Sort by date and time
    return sessions.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  } catch (error) {
    console.error('Error retrieving booked sessions:', error);
    return [];
  }
};

// In a real application, you'd implement proper authentication
const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [bookedSessions, setBookedSessions] = useState([]);
  
  useEffect(() => {
    // Load booked sessions when component mounts and when authenticated
    if (isAuthenticated) {
      setBookedSessions(getAllBookedSessions());
    }
  }, [isAuthenticated]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This is a simple mock authentication for demonstration
    // In a real application, use proper authentication methods
    if (password === 'admin123') {
      setIsAuthenticated(true);
      toast.success('Logged in successfully');
    } else {
      toast.error('Invalid password');
    }
  };
  
  // Function to send a meeting link (mock implementation)
  const sendMeetingLink = (email: string) => {
    // In a real application, this would send an email via your backend
    toast.success(`Meeting link sent to ${email}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-background">
      <Header />
      
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-dark-text-primary">
            Admin Dashboard
          </h1>
          
          {!isAuthenticated ? (
            <Card className="max-w-md mx-auto border dark:border-dark-border dark:bg-dark-card">
              <CardHeader>
                <CardTitle className="dark:text-dark-text-primary">Admin Login</CardTitle>
                <CardDescription className="dark:text-dark-text-secondary">
                  Enter your admin password to access the dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="dark:bg-dark-input dark:text-dark-text-primary dark:border-dark-border"
                  />
                  <Button type="submit" className="w-full dark:bg-whisper-blue dark:text-white">
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="urgent" className="space-y-4">
              <TabsList className="dark:bg-dark-card">
                <TabsTrigger 
                  value="urgent" 
                  className="data-[state=active]:bg-whisper-blue-light dark:data-[state=active]:bg-dark-active dark:text-dark-text-primary"
                >
                  Urgent Requests
                </TabsTrigger>
                <TabsTrigger 
                  value="booked"
                  className="data-[state=active]:bg-whisper-blue-light dark:data-[state=active]:bg-dark-active dark:text-dark-text-primary"
                >
                  Booked Sessions
                </TabsTrigger>
                <TabsTrigger 
                  value="availability"
                  className="data-[state=active]:bg-whisper-blue-light dark:data-[state=active]:bg-dark-active dark:text-dark-text-primary"
                >
                  Manage Availability
                </TabsTrigger>
                <TabsTrigger 
                  value="declined"
                  className="data-[state=active]:bg-whisper-blue-light dark:data-[state=active]:bg-dark-active dark:text-dark-text-primary"
                >
                  Declined Requests
                </TabsTrigger>
              </TabsList>

              <TabsContent value="urgent">
                <EmergencyQueue />
              </TabsContent>

              <TabsContent value="booked">
                <Card className="dark:bg-dark-card dark:border-dark-border">
                  <CardHeader>
                    <CardTitle className="dark:text-dark-text-primary">Booked Sessions</CardTitle>
                    <CardDescription className="dark:text-dark-text-secondary">
                      All confirmed counseling sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bookedSessions.length > 0 ? (
                      <div className="space-y-4">
                        {bookedSessions.map((session) => (
                          <div 
                            key={session.id} 
                            className="border dark:border-dark-border rounded-md p-4 bg-white dark:bg-dark-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-dark-text-primary">{session.email}</h4>
                              <p className="text-gray-600 dark:text-dark-text-secondary text-sm">
                                {session.date} at {session.time}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              className="shrink-0 dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-active"
                              onClick={() => sendMeetingLink(session.email)}
                            >
                              Send Meeting Link
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 dark:text-dark-text-secondary">
                        <p>No booked sessions at this time.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="availability">
                <AdminCalendar />
              </TabsContent>

              <TabsContent value="declined">
                <DeclinedRequests />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
