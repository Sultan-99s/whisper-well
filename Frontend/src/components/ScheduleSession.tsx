import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CalendarIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

// API functions
const getAvailableSlotsForDate = async (dateString: string): Promise<string[]> => {
  try {
    const response = await fetch(`http://localhost:8000/slots/available?date=${dateString}`);
    if (!response.ok) {
      throw new Error('Failed to fetch available slots');
    }
    const data = await response.json();
    return data.slots;
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return [];
  }
};

const bookSlot = async (email: string, date: string, timeSlot: string) => {
  try {
    const response = await fetch('http://localhost:8000/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        date: date,
        time_slot: timeSlot,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to book slot');
    }

    return await response.json();
  } catch (error) {
    console.error('Error booking slot:', error);
    throw error;
  }
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const ScheduleSession: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Load available slots when date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (date) {
        setLoading(true);
        try {
          const dateString = format(date, 'yyyy-MM-dd');
          const slots = await getAvailableSlotsForDate(dateString);
          setAvailableTimeSlots(slots);
        } catch (error) {
          toast.error('Failed to load available slots');
          setAvailableTimeSlots([]);
        } finally {
          setLoading(false);
        }
      } else {
        setAvailableTimeSlots([]);
      }
    };

    fetchSlots();
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    if (!date || !timeSlot) {
      toast.error('Please select a date and time for your session');
      return;
    }
    
    setBookingLoading(true);
    
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      const bookingResult = await bookSlot(email, dateString, timeSlot);
      
      toast.success('Session scheduled successfully!', {
        description: `We've sent a confirmation to ${email}. Check your inbox for meeting details.`
      });
      
      // Reset form
      setDate(undefined);
      setTimeSlot(null);
      setEmail('');
      setEmailError('');
      setShowEmailForm(false);
      setAvailableTimeSlots([]);
      
    } catch (error: any) {
      if (error.message.includes('already booked')) {
        toast.error('This time slot has just been booked by someone else. Please select another time.');
        // Refresh available slots
        if (date) {
          const dateString = format(date, 'yyyy-MM-dd');
          const slots = await getAvailableSlotsForDate(dateString);
          setAvailableTimeSlots(slots);
          setTimeSlot(null);
          setShowEmailForm(false);
        }
      } else {
        toast.error('There was a problem booking your session. Please try again.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const handleTimeSelection = (time: string) => {
    setTimeSlot(time);
    setShowEmailForm(true);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear error when user starts typing again
    if (emailError && validateEmail(newEmail)) {
      setEmailError('');
    }
  };

  return (
    <div id="schedule" className="section bg-whisper-blue-light/30 dark:bg-dark-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-2 text-2xl font-bold dark:text-dark-text-primary">
          Schedule a Session
        </h2>
        <p className="text-center text-gray-600 dark:text-dark-text-secondary mb-12 max-w-2xl mx-auto">
          Book a free, anonymous counseling session with one of our volunteers. 
          Select a date and time that works for you, and we'll send you a secure meeting link.
        </p>
        
        <Card className="max-w-3xl mx-auto dark:bg-dark-card border-gray-200 dark:border-dark-card">
          <CardHeader>
            <CardTitle className="dark:text-dark-text-primary">Book Your Session</CardTitle>
            <CardDescription className="dark:text-dark-text-secondary">
              Choose an available date and time slot below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="flex items-center gap-2 text-lg font-medium mb-4 dark:text-dark-text-primary">
                  <CalendarIcon className="h-5 w-5" /> Select Date
                </h3>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border shadow p-3 dark:bg-dark-card dark:border-dark-card"
                  disabled={{ before: new Date() }}
                />
              </div>
              
              <div className="flex-1">
                <h3 className="flex items-center gap-2 text-lg font-medium mb-4 dark:text-dark-text-primary">
                  <Clock className="h-5 w-5" /> Available Times
                </h3>
                
                {date ? (
                  <>
                    {loading ? (
                      <div className="h-40 flex items-center justify-center border rounded-md dark:border-dark-card dark:bg-dark-background">
                        <p className="text-gray-500 dark:text-dark-text-secondary">Loading available slots...</p>
                      </div>
                    ) : availableTimeSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableTimeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={timeSlot === time ? "default" : "outline"}
                            onClick={() => handleTimeSelection(time)}
                            className="justify-start dark:border-dark-card dark:hover:bg-dark-card"
                          >
                            {time} <CheckCircle className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="h-40 flex items-center justify-center border rounded-md dark:border-dark-card dark:bg-dark-background">
                        <p className="text-gray-500 dark:text-dark-text-secondary">No available slots for this date. Please select another date.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-40 flex items-center justify-center border rounded-md dark:border-dark-card dark:bg-dark-background">
                    <p className="text-gray-500 dark:text-dark-text-secondary">Please select a date first</p>
                  </div>
                )}
              </div>
            </div>
            
            {showEmailForm && (
              <form onSubmit={handleSubmit} className="mt-6 border-t dark:border-dark-card pt-6 animate-fade-in">
                <h3 className="text-lg font-medium mb-4 dark:text-dark-text-primary">Enter Your Email</h3>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-4">
                  We'll send the meeting link to this email address. Your email will be removed from our system after the session.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="your-email@example.com"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      className={`w-full dark:bg-dark-background dark:border-dark-card dark:text-dark-text-primary dark:placeholder-dark-text-secondary ${emailError ? 'border-red-500' : ''}`}
                    />
                    {emailError && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {emailError}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-1">
                      Your email will only be used to send you the meeting link.
                    </p>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowEmailForm(false)}
                      disabled={bookingLoading}
                      className="dark:border-dark-card dark:hover:bg-dark-card"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={!email || bookingLoading}
                    >
                      {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start border-t dark:border-dark-card pt-6">
            <div className="bg-blue-50 dark:bg-dark-card p-3 rounded-md text-blue-800 dark:text-whisper-blue-light text-sm w-full">
              <strong>Your privacy matters:</strong> We don't store any personal data beyond what's needed to facilitate your session.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleSession;