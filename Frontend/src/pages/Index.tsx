
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScheduleSession from '@/components/ScheduleSession';
import EmergencyRequest from '@/components/EmergencyRequest';
import PrivacyInfo from '@/components/PrivacyInfo';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-whisper-blue-light to-white py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Anonymous Support When You Need It Most
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Connect with volunteer counselors for free, one-on-one private sessions. 
              No account needed, complete privacy guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="#schedule">Schedule a Session</a>
              </Button>
              <Button size="lg" variant="destructive" asChild>
                <a href="#urgent">Need Urgent Help?</a>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="section">
          <div className="container mx-auto">
            <h2 className="text-center mb-2">How It Works</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              A simple, private process to connect you with support
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-whisper-blue-light flex items-center justify-center mb-4">
                  <span className="text-whisper-blue font-bold">1</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Choose a Time</h3>
                <p className="text-gray-600">
                  Browse our calendar and select an available time slot that works for you.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-whisper-blue-light flex items-center justify-center mb-4">
                  <span className="text-whisper-blue font-bold">2</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Receive Link</h3>
                <p className="text-gray-600">
                  Provide your email (just for the meeting link) and receive your private meeting details.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-whisper-blue-light flex items-center justify-center mb-4">
                  <span className="text-whisper-blue font-bold">3</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Join Session</h3>
                <p className="text-gray-600">
                  Click the link at your scheduled time to connect with a volunteer counselor anonymously.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Schedule Session Component */}
        <ScheduleSession />
        
        {/* Emergency Request Component */}
        <EmergencyRequest />
        
        {/* Privacy Info Component */}
        <PrivacyInfo />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
