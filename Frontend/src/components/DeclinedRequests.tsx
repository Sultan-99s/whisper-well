import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DeclinedRequest {
  id: number;
  email: string;
  type: 'urgent' | 'booking';
  created_at: string;
  reason: string;
}

const DeclinedRequests: React.FC = () => {
  const [declinedRequests, setDeclinedRequests] = useState<DeclinedRequest[]>([]);

  useEffect(() => {
    fetchDeclinedRequests();
  }, []);

  const fetchDeclinedRequests = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/declined-requests');
      if (!response.ok) throw new Error('Failed to fetch declined requests');
      const data = await response.json();
      setDeclinedRequests(data.declined_requests);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Declined Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {declinedRequests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{request.email}</p>
                  <p className="text-sm text-gray-600">{new Date(request.created_at).toLocaleString()}</p>
                </div>
                <Badge variant="outline" className={request.type === 'urgent' ? 'bg-red-50' : 'bg-yellow-50'}>
                  {request.type === 'urgent' ? 'Declined Request' : 'Spam Booking'}
                </Badge>
              </div>
              {request.reason && (
                <p className="mt-2 text-sm text-gray-600">Reason: {request.reason}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeclinedRequests;