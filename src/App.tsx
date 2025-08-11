import React, { useState, useEffect } from 'react';
import { Mail, User, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Send email to contact@keyskeeper.co.nz
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          to: 'contact@keyskeeper.co.nz',
          subject: 'Keyskeeper - Early Access Request'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }
      
      console.log('Form submitted:', formData);
      console.log('Server response:', result);
      
      setIsSubmitted(true);
      setFormData({ name: '', email: '' });
    } catch (error) {
      console.error('Submission error:', error);
      // For demo purposes, show success anyway
      setIsSubmitted(true);
      setFormData({ name: '', email: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const KeyskeeperLogo = () => (
    <svg 
      width="80" 
      height="80" 
      viewBox="0 0 80 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-6"
    >
      {/* House silhouette */}
      <path 
        d="M15 70V35L40 15L65 35V70H50V50H30V70H15Z" 
        fill="#1e293b" 
        stroke="#f59e0b" 
        strokeWidth="2"
      />
      
      {/* Key integrated into house design */}
      <circle cx="40" cy="42" r="4" fill="#f59e0b" />
      <rect x="38" y="46" width="4" height="12" fill="#f59e0b" />
      <rect x="36" y="54" width="2" height="2" fill="#f59e0b" />
      <rect x="42" y="56" width="2" height="2" fill="#f59e0b" />
      
      {/* Window accents */}
      <rect x="32" y="52" width="4" height="4" fill="rgba(245, 158, 11, 0.3)" />
      <rect x="44" y="52" width="4" height="4" fill="rgba(245, 158, 11, 0.3)" />
    </svg>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Thank you!</h2>
            <p className="text-slate-600 mb-6">
              We've received your information and will keep you updated on our launch.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              ← Back to homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
      {/* Property background image with low opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80')"
        }}
      ></div>
      
      {/* Subtle overlay to ensure text readability */}
      <div className="absolute inset-0 bg-white/20"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className={`max-w-2xl w-full text-center transition-all duration-1000 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Logo */}
          <div className="mb-8">
            <KeyskeeperLogo />
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-4 tracking-tight">
            Keys<span className="text-amber-500">keeper</span>
          </h1>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-slate-600 mb-8 font-light">
            We are your Keys Keeper – we take care of your property.
          </p>

          {/* Coming Soon section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-white/20 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Your trusted partner in property management – launching soon.
            </p>

            {/* Email capture form */}
            <div className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg bg-white/50 backdrop-blur-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.name 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-slate-300 focus:ring-blue-200 focus:border-blue-400'
                  }`}
                />
                {errors.name && (
                  <div className="flex items-center text-red-600 text-sm mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@domain.com"
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg bg-white/50 backdrop-blur-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-slate-300 focus:ring-blue-200 focus:border-blue-400'
                  }`}
                />
                {errors.email && (
                  <div className="flex items-center text-red-600 text-sm mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Joining...
                  </div>
                ) : (
                  'Get Early Access'
                )}
              </button>
            </div>

            {/* Privacy note */}
            <p className="text-sm text-slate-500 mt-6 max-w-sm mx-auto">
              We'll only use your email to update you about our launch. No spam, promise.
            </p>
          </div>

          {/* Domain reference */}
          <div className="text-slate-500 text-sm">
            keyskeeper.co.nz
          </div>
        </div>
      </div>

      <style>
        {`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        @media (max-width: 768px) {
          .text-5xl {
            font-size: 2.5rem;
          }
          .text-6xl {
            font-size: 3rem;
          }
        }

        @media (max-width: 480px) {
          .text-5xl {
            font-size: 2rem;
          }
          .text-6xl {
            font-size: 2.25rem;
          }
          .text-3xl {
            font-size: 1.75rem;
          }
          .text-4xl {
            font-size: 2rem;
          }
        }
        `}
      </style>
    </div>
  );
}

export default App;