import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';

const Header: React.FC = () => {
  // Scroll to the section when clicking on a hash link
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="border-b dark:border-gray-800">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-whisper-blue" />
          <span className="text-xl font-medium">WhisperWell</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-whisper-blue transition-colors">
            Home
          </Link>
          <Link 
            to="/#how-it-works" 
            className="text-gray-600 hover:text-whisper-blue transition-colors"
            onClick={(e) => {
              e.preventDefault();
              if (window.location.pathname === '/') {
                scrollToSection('how-it-works');
              } else {
                window.location.href = '/#how-it-works';
              }
            }}
          >
            How It Works
          </Link>
          <Link 
            to="/#privacy" 
            className="text-gray-600 hover:text-whisper-blue transition-colors"
            onClick={(e) => {
              e.preventDefault();
              if (window.location.pathname === '/') {
                scrollToSection('privacy');
              } else {
                window.location.href = '/#privacy';
              }
            }}
          >
            Privacy
          </Link>
          <Link to="/admin" className="text-gray-600 hover:text-whisper-blue transition-colors">
            Admin
          </Link>
        </nav>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              if (window.location.pathname === '/') {
                scrollToSection('schedule');
              } else {
                window.location.href = '/#schedule';
              }
            }}
          >
            Schedule Session
          </Button>
          <Button 
            variant="destructive"
            onClick={() => {
              if (window.location.pathname === '/') {
                scrollToSection('urgent');
              } else {
                window.location.href = '/#urgent';
              }
            }}
          >
            Urgent Help
          </Button>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
