import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AlertTriangle, Mail, Clock, CheckCircle } from 'lucide-react';

interface UrgentRequest {
  id: number;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

interface Booking {
  id: number;
  email: string;
  date: string;
  time_slot: string;
  booked_at?: string;
}

// API functions
const fetchUrgentRequests = async (): Promise<UrgentRequest[]> => {
  try {
    const response = await fetch('http://localhost:8000/admin/urgent-requests');
    if (!response.ok) throw new Error('Failed to fetch urgent requests');
    const data = await response.json();
    return data.urgent_requests;
  } catch (error) {
    console.error('Error fetching urgent requests:', error);
    return [];
  }
};

const fetchBookings = async (): Promise<Booking[]> => {
  try {
    const response = await fetch('http://localhost:8000/admin/bookings');
    if (!response.ok) throw new Error('Failed to fetch bookings');
    const data = await response.json();
    return data.bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

const updateUrgentRequestStatus = async (requestId: number, status: string) => {
  try {
    const response = await fetch(`http://localhost:8000/admin/urgent-requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update status');
    return await response.json();
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};

const EmergencyQueue: React.FC = () => {
  const [urgentRequests, setUrgentRequests] = useState<UrgentRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [requestsData, bookingsData] = await Promise.all([
        fetchUrgentRequests(),
        fetchBookings()
      ]);
      setUrgentRequests(requestsData);
      setBookings(bookingsData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: number, newStatus: string) => {
    try {
      await updateUrgentRequestStatus(requestId, newStatus);
      
      // Update local state
      setUrgentRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
      
      toast.success(`Request marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update request status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Urgent Requests Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Urgent Support Requests
          </CardTitle>
          <CardDescription>
            Priority requests that need immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {urgentRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No urgent requests at the moment</p>
          ) : (
            <div className="space-y-4">
              {urgentRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{request.email}</span>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatDateTime(request.created_at)}
                    </div>
                  </div>
                  
                  {request.message && (
                    <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded">
                      {request.message}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    {request.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(request.id, 'reviewed')}
                      >
                        Mark as Reviewed
                      </Button>
                    )}
                    {request.status === 'reviewed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(request.id, 'resolved')}
                      >
                        Mark as Resolved
                      </Button>
                    )}
                    {request.status === 'resolved' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Resolved</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Sessions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Scheduled Sessions
          </CardTitle>
          <CardDescription>
            Upcoming counseling sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No scheduled sessions</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{booking.email}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {booking.date} at {booking.time_slot}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Scheduled
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button onClick={loadData} variant="outline">
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default EmergencyQueue;