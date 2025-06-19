
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const PrivacyInfo: React.FC = () => {
  return (
    <div id="privacy" className="section bg-whisper-green-light/30 dark:bg-dark-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-2 text-2xl font-bold dark:text-dark-text-primary">
          Your Privacy is Our Priority
        </h2>
        <p className="text-center text-gray-600 dark:text-dark-text-secondary mb-12 max-w-2xl mx-auto">
          We've built WhisperWell with privacy at its core. Here's how we protect your anonymity and data.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="dark:bg-dark-card border-gray-200 dark:border-dark-card">
            <CardHeader className="space-y-1">
              <div className="h-12 w-12 rounded-full bg-whisper-blue-light dark:bg-dark-background flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-whisper-blue dark:text-whisper-blue-light" />
              </div>
              <CardTitle className="dark:text-dark-text-primary">No Registration Needed</CardTitle>
              <CardDescription className="dark:text-dark-text-secondary">
                Complete anonymity, no accounts required
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-dark-text-secondary">
                Use our service without creating an account or providing personal information. 
                We only need your email temporarily to send you meeting details.
              </p>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-dark-card border-gray-200 dark:border-dark-card">
            <CardHeader className="space-y-1">
              <div className="h-12 w-12 rounded-full bg-whisper-blue-light dark:bg-dark-background flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-whisper-blue dark:text-whisper-blue-light" />
              </div>
              <CardTitle className="dark:text-dark-text-primary">No Data Storage</CardTitle>
              <CardDescription className="dark:text-dark-text-secondary">
                Your information is never permanently stored
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-dark-text-secondary">
                After your session, all your information is automatically deleted from our systems.
                We don't keep logs, cookies, or any identifiable information.
              </p>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-dark-card border-gray-200 dark:border-dark-card">
            <CardHeader className="space-y-1">
              <div className="h-12 w-12 rounded-full bg-whisper-blue-light dark:bg-dark-background flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-whisper-blue dark:text-whisper-blue-light" />
              </div>
              <CardTitle className="dark:text-dark-text-primary">Private Communications</CardTitle>
              <CardDescription className="dark:text-dark-text-secondary">
                Secure meetings with volunteer counselors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-dark-text-secondary">
                Your conversations with counselors are not recorded or monitored.
                You control what you share and can remain as anonymous as you wish.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 bg-white dark:bg-dark-card border dark:border-dark-card rounded-lg p-6 max-w-3xl mx-auto">
          <h3 className="text-xl font-medium mb-4 dark:text-dark-text-primary">
            Our Privacy Commitment
          </h3>
          <div className="space-y-4 text-gray-600 dark:text-dark-text-secondary">
            <p>
              WhisperWell is built on the principle that everyone deserves access to emotional support
              without compromising their privacy.
            </p>
            <p>
              We've designed our platform to minimize data collection and storage while still providing
              the means for you to connect with volunteer counselors.
            </p>
            <p>
              <strong className="dark:text-dark-text-primary">What we collect:</strong> Temporarily, only your email address to send meeting links.
            </p>
            <p>
              <strong className="dark:text-dark-text-primary">What we don't collect:</strong> Personal identification details, IP addresses, browser fingerprints,
              or any information that could identify you personally.
            </p>
            <p>
              <strong className="dark:text-dark-text-primary">What we don't do:</strong> We never sell data, use tracking cookies, or share your information
              with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyInfo;
