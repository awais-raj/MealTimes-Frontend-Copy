import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Building2, CheckCircle, ArrowRight, Book, Award, DollarSign, Users, Calendar } from 'lucide-react';

const OnboardingGuide = () => {
  const [selectedGuide, setSelectedGuide] = useState<'chef' | 'corporate'>('chef');

  const chefSteps = [
    {
      title: 'Complete Profile',
      description: 'Fill in your professional details, certifications, and specialties',
      icon: ChefHat,
      link: '/chef-application'
    },
    {
      title: 'Menu Setup',
      description: 'Create your signature dishes and meal packages',
      icon: Book,
      link: '/meals'
    },
    {
      title: 'Verification',
      description: 'Submit required documents for verification',
      icon: CheckCircle,
      link: '#'
    },
    {
      title: 'Start Earning',
      description: 'Begin accepting orders and growing your business',
      icon: DollarSign,
      link: '/dashboard'
    }
  ];

  const corporateSteps = [
    {
      title: 'Company Registration',
      description: 'Register your company and select a meal plan',
      icon: Building2,
      link: '/register'
    },
    {
      title: 'Employee Management',
      description: 'Add employees and set up departments',
      icon: Users,
      link: '/corporate-account'
    },
    {
      title: 'Meal Planning',
      description: 'Set up meal allowances and dietary preferences',
      icon: Calendar,
      link: '/meal-plans'
    },
    {
      title: 'Start Operating',
      description: 'Begin managing your corporate meal program',
      icon: Award,
      link: '/dashboard'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Onboarding Guide</h1>
          <p className="mt-4 text-xl text-gray-600">
            Get started with our corporate meal management platform
          </p>
        </div>

        {/* Guide Type Selector */}
        <div className="flex justify-center space-x-4 mb-12">
          <button
            onClick={() => setSelectedGuide('chef')}
            className={`px-6 py-3 rounded-lg font-medium ${
              selectedGuide === 'chef'
                ? 'bg-brand-red text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <ChefHat className="h-5 w-5 mr-2" />
              Home Chef Guide
            </div>
          </button>
          <button
            onClick={() => setSelectedGuide('corporate')}
            className={`px-6 py-3 rounded-lg font-medium ${
              selectedGuide === 'corporate'
                ? 'bg-brand-red text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Corporate Guide
            </div>
          </button>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(selectedGuide === 'chef' ? chefSteps : corporateSteps).map((step, index) => (
            <div key={index} className="relative">
              {index < 3 && (
                <div className="hidden lg:block absolute top-8 left-full w-full border-t-2 border-dashed border-gray-200 z-0" />
              )}
              <div className="relative bg-white rounded-lg shadow-lg p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 bg-brand-light rounded-full flex items-center justify-center">
                    {React.createElement(step.icon, { className: "h-6 w-6 text-brand-red" })}
                  </div>
                  <span className="text-2xl font-bold text-gray-300">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <Link
                  to={step.link}
                  className="inline-flex items-center text-brand-red hover:text-brand-orange"
                >
                  Get Started <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            {selectedGuide === 'chef' ? 'Benefits for Home Chefs' : 'Benefits for Corporations'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {selectedGuide === 'chef' ? (
              <>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <DollarSign className="h-8 w-8 text-brand-red mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Steady Income</h3>
                  <p className="text-gray-600">
                    Secure regular orders and predictable revenue through corporate clients
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <Users className="h-8 w-8 text-brand-red mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Grow Your Network</h3>
                  <p className="text-gray-600">
                    Connect with corporate clients and expand your customer base
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <Award className="h-8 w-8 text-brand-red mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Professional Growth</h3>
                  <p className="text-gray-600">
                    Access tools and resources to scale your culinary business
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <Users className="h-8 w-8 text-brand-red mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Employee Satisfaction</h3>
                  <p className="text-gray-600">
                    Boost morale with quality meals and flexible options
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <DollarSign className="h-8 w-8 text-brand-red mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Cost Management</h3>
                  <p className="text-gray-600">
                    Streamline meal expenses and track departmental budgets
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <Calendar className="h-8 w-8 text-brand-red mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Easy Administration</h3>
                  <p className="text-gray-600">
                    Simplified meal management and automated processes
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Join our platform and transform your {selectedGuide === 'chef' ? 'culinary business' : 'corporate dining'} today
          </p>
          <Link
            to={selectedGuide === 'chef' ? '/chef-application' : '/register'}
            className="inline-flex items-center px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-brand-orange transition-colors"
          >
            Get Started <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;