
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-whisper-blue" />
              <span className="text-xl font-medium">WhisperWell</span>
            </div>
            <p className="text-gray-600 mb-4">
              A safe space to share your thoughts and receive support, 
              with complete anonymity and privacy.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-whisper-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-gray-600 hover:text-whisper-blue transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/#privacy" className="text-gray-600 hover:text-whisper-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-600 hover:text-whisper-blue transition-colors">
                  Admin Access
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Important Notice</h3>
            <p className="text-gray-600 mb-4">
              This service is not a substitute for professional mental health treatment. 
              If you are in immediate danger or having thoughts of harming yourself or others, 
              please contact emergency services immediately.
            </p>
            <p className="text-whisper-urgent font-medium">
              Emergency: Call 988 or your local emergency number.
            </p>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} WhisperWell. All rights reserved.</p>
          <p className="text-sm mt-1">This platform is committed to your privacy and anonymity.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
