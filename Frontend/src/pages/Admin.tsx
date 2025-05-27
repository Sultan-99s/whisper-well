
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminCalendar from '@/components/AdminCalendar';
import EmergencyQueue from '@/components/EmergencyQueue';
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          {!isAuthenticated ? (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>
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
                  />
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="urgent">
              <TabsList className="mb-8">
                <TabsTrigger value="urgent">Urgent Requests</TabsTrigger>
                <TabsTrigger value="booked">Booked Sessions</TabsTrigger>
                <TabsTrigger value="availability">Manage Availability</TabsTrigger>
              </TabsList>
              
              <TabsContent value="urgent">
                <EmergencyQueue />
              </TabsContent>
              
              <TabsContent value="booked">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                    <CardDescription>
                      All your scheduled counseling sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bookedSessions.length > 0 ? (
                      <div className="space-y-4">
                        {bookedSessions.map((session) => (
                          <div key={session.id} className="border rounded-md p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h4 className="font-medium">{session.email}</h4>
                              <p className="text-gray-600 text-sm">
                                {session.date} at {session.time}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              className="shrink-0"
                              onClick={() => sendMeetingLink(session.email)}
                            >
                              Send Meeting Link
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <p>No booked sessions at this time.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="availability">
                <AdminCalendar />
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
