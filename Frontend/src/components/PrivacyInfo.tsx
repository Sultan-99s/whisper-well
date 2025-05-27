
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const PrivacyInfo: React.FC = () => {
  return (
    <div id="privacy" className="section bg-whisper-green-light/30">
      <div className="container mx-auto">
        <h2 className="text-center mb-2">Your Privacy is Our Priority</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          We've built WhisperWell with privacy at its core. Here's how we protect your anonymity and data.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="space-y-1">
              <div className="h-12 w-12 rounded-full bg-whisper-blue-light flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-whisper-blue" />
              </div>
              <CardTitle>No Registration Needed</CardTitle>
              <CardDescription>
                Complete anonymity, no accounts required
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Use our service without creating an account or providing personal information. 
                We only need your email temporarily to send you meeting details.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="space-y-1">
              <div className="h-12 w-12 rounded-full bg-whisper-blue-light flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-whisper-blue" />
              </div>
              <CardTitle>No Data Storage</CardTitle>
              <CardDescription>
                Your information is never permanently stored
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                After your session, all your information is automatically deleted from our systems.
                We don't keep logs, cookies, or any identifiable information.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="space-y-1">
              <div className="h-12 w-12 rounded-full bg-whisper-blue-light flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-whisper-blue" />
              </div>
              <CardTitle>Private Communications</CardTitle>
              <CardDescription>
                Secure meetings with volunteer counselors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your conversations with counselors are not recorded or monitored.
                You control what you share and can remain as anonymous as you wish.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 bg-white border rounded-lg p-6 max-w-3xl mx-auto">
          <h3 className="text-xl font-medium mb-4">Our Privacy Commitment</h3>
          <div className="space-y-4 text-gray-600">
            <p>
              WhisperWell is built on the principle that everyone deserves access to emotional support
              without compromising their privacy.
            </p>
            <p>
              We've designed our platform to minimize data collection and storage while still providing
              the means for you to connect with volunteer counselors.
            </p>
            <p>
              <strong>What we collect:</strong> Temporarily, only your email address to send meeting links.
            </p>
            <p>
              <strong>What we don't collect:</strong> Personal identification details, IP addresses, browser fingerprints,
              or any information that could identify you personally.
            </p>
            <p>
              <strong>What we don't do:</strong> We never sell data, use tracking cookies, or share your information
              with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyInfo;
