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
    <div id="urgent" className="section py-16 dark:bg-dark-background">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-2 text-2xl font-bold dark:text-dark-text-primary">
          Need Urgent Support?
        </h2>
        <p className="text-center text-gray-600 dark:text-dark-text-secondary mb-12 max-w-2xl mx-auto">
          If you need immediate support, use this form to request urgent assistance. 
          A counselor will contact you as soon as possible.
        </p>
        
        <div className="max-w-3xl mx-auto">
          <Alert className="mb-6 border-whisper-urgent/30 bg-whisper-urgent/5 dark:bg-whisper-urgent/10 dark:border-whisper-urgent/20">
            <AlertTriangle className="h-4 w-4 text-whisper-urgent" />
            <AlertTitle className="dark:text-whisper-urgent">Emergency Services Notice</AlertTitle>
            <AlertDescription className="dark:text-dark-text-secondary">
              If you're in immediate danger or experiencing thoughts of harming yourself or others, 
              please contact emergency services by calling 988 or your local emergency number immediately.
            </AlertDescription>
          </Alert>
          
          <Card className="dark:bg-dark-card border-gray-200 dark:border-dark-card overflow-hidden">
            <CardHeader className="bg-whisper-urgent/10 dark:bg-whisper-urgent/20">
              <CardTitle className="dark:text-dark-text-primary">Request Urgent Support</CardTitle>
              <CardDescription className="dark:text-dark-text-secondary">
                This will place you in our priority queue for the next available counselor
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 dark:bg-dark-card">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 dark:text-dark-text-primary">
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
                    className="dark:bg-dark-background dark:border-dark-card dark:text-dark-text-primary dark:placeholder-dark-text-secondary"
                  />
                  <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-1">
                    We'll contact you at this email as soon as possible.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1 dark:text-dark-text-primary">
                    Brief Description (Optional)
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Briefly describe what you'd like to talk about..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] dark:bg-dark-background dark:border-dark-card dark:text-dark-text-primary dark:placeholder-dark-text-secondary"
                    disabled={isSubmitting}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-whisper-urgent hover:bg-whisper-urgent/90 dark:bg-whisper-urgent dark:hover:bg-whisper-urgent/90 dark:text-white" 
                  disabled={isSubmitting || !email}
                >
                  {isSubmitting ? 'Submitting...' : 'Request Urgent Support'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex-col items-start border-t dark:border-dark-card pt-6 dark:bg-dark-card">
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
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