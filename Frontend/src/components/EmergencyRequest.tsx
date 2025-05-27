import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// API function to submit urgent request
const submitUrgentRequest = async (email: string, message: string) => {
  try {
    const response = await fetch('http://localhost:8000/urgent-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        message: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to submit urgent request');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting urgent request:', error);
    throw error;
  }
};

const EmergencyRequest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await submitUrgentRequest(email, message);
      
      toast.success('Urgent request submitted', {
        description: 'A counselor will contact you as soon as possible. Please check your email.',
      });
      
      // Reset form
      setEmail('');
      setMessage('');
      
    } catch (error: any) {
      console.error('Error submitting urgent request:', error);
      toast.error('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <div id="urgent" className="section">
      <div className="container mx-auto">
        <h2 className="text-center mb-2">Need Urgent Support?</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          If you need immediate support, use this form to request urgent assistance. 
          A counselor will contact you as soon as possible.
        </p>
        
        <div className="max-w-3xl mx-auto">
          <Alert className="mb-6 border-whisper-urgent/30 bg-whisper-urgent/10">
            <AlertTriangle className="h-4 w-4 text-whisper-urgent" />
            <AlertTitle>Emergency Services Notice</AlertTitle>
            <AlertDescription>
              If you're in immediate danger or experiencing thoughts of harming yourself or others, 
              please contact emergency services by calling 988 or your local emergency number immediately.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader className="bg-whisper-urgent/10">
              <CardTitle>Request Urgent Support</CardTitle>
              <CardDescription>
                This will place you in our priority queue for the next available counselor
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your-email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll contact you at this email as soon as possible.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Brief Description (Optional)
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Briefly describe what you'd like to talk about..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                    disabled={isSubmitting}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-whisper-urgent hover:bg-whisper-urgent/90" 
                  disabled={isSubmitting || !email}
                >
                  {isSubmitting ? 'Submitting...' : 'Request Urgent Support'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex-col items-start border-t pt-6">
              <p className="text-sm text-gray-600">
                Your privacy is our priority. Your email will only be used to contact you for this request 
                and will not be stored after your session.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRequest;