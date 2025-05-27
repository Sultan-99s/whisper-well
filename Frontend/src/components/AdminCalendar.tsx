
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CalendarIcon, Clock, CheckIcon, PlusCircle, MinusCircle } from 'lucide-react';
import { format } from 'date-fns';

// Helper functions for localStorage operations
// const getAvailabilityForDate = (dateString: string) => {
//   try {
//     const availabilityData = localStorage.getItem('counselorAvailability');
//     const availability = availabilityData ? JSON.parse(availabilityData) : {};
//     return availability[dateString] || [];
//   } catch (error) {
//     console.error('Error retrieving availability:', error);
//     return [];
//   }
// };

const getAvailabilityForDate = async (dateString: string): Promise<string[]> => {
  try {
    const res = await fetch(`http://localhost:8000/slots/available?date=${dateString}`);
    if (!res.ok) throw new Error('Failed to fetch slots');
    const data = await res.json();
    return data.slots; // assuming API returns { "slots": ["10:00 AM", ...] }
  } catch (error) {
    console.error('Error fetching availability:', error);
    return [];
  }
};

// const saveAvailabilityForDate = (dateString: string, slots: string[]) => {
//   try {
//     const availabilityData = localStorage.getItem('counselorAvailability');
//     const availability = availabilityData ? JSON.parse(availabilityData) : {};
//     availability[dateString] = slots;
//     localStorage.setItem('counselorAvailability', JSON.stringify(availability));
//     return true;
//   } catch (error) {
//     console.error('Error saving availability:', error);
//     return false;
//   }
// };

const saveAvailabilityForDate = async (dateString: string, slots: string[]) => {
  try {
    const res = await fetch('http://localhost:8000/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: dateString,
        slots: slots,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text(); // Optional: log backend response
      console.error('Server error response:', errorText);
      throw new Error('Failed to save availability');
    }

    return await res.json(); // Return response data if needed
  } catch (error: any) {
    console.error('Error in saveAvailabilityForDate:', error.message);
    throw error;
  }
};


const AdminCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [customSlot, setCustomSlot] = useState<string>('');
  
  // Default time slots
  const defaultTimeSlots = [
    '6:00 AM', '10:00 AM', '5:00 PM', '7:00 PM', '10:00 PM', '11:00 PM'
  ];
  
  // Load saved availability when date changes
  // useEffect(() => {
  //   if (date) {
  //     const dateString = format(date, 'yyyy-MM-dd');
  //     const savedSlots = getAvailabilityForDate(dateString);
  //     setAvailableSlots(savedSlots.length > 0 ? savedSlots : []);
  //   }
  // }, [date]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (date) {
        const dateString = format(date, 'yyyy-MM-dd');
        const savedSlots = await getAvailabilityForDate(dateString);
        setAvailableSlots(savedSlots);
      }
    };
    fetchSlots();
  }, [date]);
  
  const toggleTimeSlot = (slot: string) => {
    setAvailableSlots(prev => 
      prev.includes(slot) 
        ? prev.filter(s => s !== slot)
        : [...prev, slot].sort((a, b) => {
            // Simple time sorting logic
            const timeA = new Date(`1/1/2020 ${a}`).getTime();
            const timeB = new Date(`1/1/2020 ${b}`).getTime();
            return timeA - timeB;
          })
    );
  };
  
  const addCustomSlot = () => {
    if (!customSlot) return;
    
    // Simple validation for time format (could be enhanced)
    const timeRegex = /^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/i;
    if (!timeRegex.test(customSlot)) {
      toast.error('Invalid time format. Please use format like "9:00 AM"');
      return;
    }
    
    if (availableSlots.includes(customSlot)) {
      toast.error('This time slot already exists');
      return;
    }
    
    setAvailableSlots(prev => 
      [...prev, customSlot].sort((a, b) => {
        // Simple time sorting logic
        const timeA = new Date(`1/1/2020 ${a}`).getTime();
        const timeB = new Date(`1/1/2020 ${b}`).getTime();
        return timeA - timeB;
      })
    );
    setCustomSlot('');
  };
  
  // const saveAvailability = () => {
  //   if (!date) {
  //     toast.error('Please select a date first');
  //     return;
  //   }
    
  //   const dateString = format(date, 'yyyy-MM-dd');
  //   if (saveAvailabilityForDate(dateString, availableSlots)) {
  //     toast.success('Availability updated', {
  //       description: `Your availability for ${format(date, 'MMMM d, yyyy')} has been updated.`,
  //     });
  //   } else {
  //     toast.error('Failed to save availability');
  //   }
  // };

  const saveAvailability = async () => {
    if (!date) {
      toast.error('Please select a date first');
      return;
    }
  
    const dateString = format(date, 'yyyy-MM-dd');
    const success = await saveAvailabilityForDate(dateString, availableSlots); // 🔥 Added await
  
    if (success) {
      toast.success('Availability updated', {
        description: `Your availability for ${format(date, 'MMMM d, yyyy')} has been updated.`,
      });
    } else {
      toast.error('Failed to save availability');
    }
  };  
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Your Availability</CardTitle>
        <CardDescription>
          Set which hours you're available to counsel on each day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
              <CalendarIcon className="h-5 w-5" /> Select Date
            </h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow p-3"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
              <Clock className="h-5 w-5" /> Available Times for {date ? format(date, 'MMMM d, yyyy') : 'selected date'}
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {defaultTimeSlots.map((time) => {
                const isAvailable = availableSlots.includes(time);
                return (
                  <Button
                    key={time}
                    variant={isAvailable ? "default" : "outline"}
                    onClick={() => toggleTimeSlot(time)}
                    className="justify-between"
                  >
                    <span>{time}</span>
                    {isAvailable && <CheckIcon className="h-4 w-4 ml-2" />}
                  </Button>
                );
              })}
            </div>
            
            {/* Custom time slot section */}
            <div className="mt-6 border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Add Custom Time Slot</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSlot}
                  onChange={(e) => setCustomSlot(e.target.value)}
                  placeholder="e.g., 6:30 PM"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button onClick={addCustomSlot} variant="outline" size="icon">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Custom slots list */}
            {availableSlots.filter(slot => !defaultTimeSlots.includes(slot)).length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Custom Time Slots</h4>
                <div className="space-y-2">
                  {availableSlots
                    .filter(slot => !defaultTimeSlots.includes(slot))
                    .map((slot) => (
                      <div key={slot} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <span>{slot}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleTimeSlot(slot)}
                          className="h-8 w-8"
                        >
                          <MinusCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-6">
        <Button onClick={saveAvailability}>
          Save Availability
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminCalendar;
