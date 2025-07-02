import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Utensils, 
  Building2, 
  Users,
  ChefHat,
  Wallet,
  Calendar,
  Bell,
  Heart,
  Star,
  MessageCircle,
  UserPlus,
  Briefcase,
  Award,
  Coffee,
  Users2
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-brand-light">
      {/* Hero Section */}
      <div className="relative bg-chef-hero bg-cover bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Corporate Meal Management
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-100">
              Connecting companies with local chefs for delicious, customized meal plans
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-red hover:bg-brand-orange transition-colors md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
              <Link
                to="/meals"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-red bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                View Meals
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* For Companies */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <Building2 className="h-12 w-12 text-brand-red mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold text-gray-900">For Companies</h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Transform your corporate dining experience
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Wallet className="h-8 w-8 text-brand-red mb-4" />
                <h3 className="text-xl font-semibold mb-2">Cost Management</h3>
                <p className="text-gray-600">Optimize your meal budget with flexible plans and analytics</p>
              </div>
              <div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Calendar className="h-8 w-8 text-brand-red mb-4" />
                <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
                <p className="text-gray-600">Streamline meal planning and delivery coordination</p>
              </div>
              <div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Bell className="h-8 w-8 text-brand-red mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
                <p className="text-gray-600">Stay informed with delivery tracking and notifications</p>
              </div>
            </div>
          </div>

          {/* For Employees */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <Briefcase className="h-12 w-12 text-brand-red mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold text-gray-900">For Employees</h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Enjoy hassle-free, delicious meals at work
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Heart className="h-8 w-8 text-brand-red mb-4" />
                <h3 className="text-xl font-semibold mb-2">Personalized Meals</h3>
                <p className="text-gray-600">Choose from a variety of meals that match your preferences</p>
              </div>
              <div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Coffee className="h-8 w-8 text-brand-red mb-4" />
                <h3 className="text-xl font-semibold mb-2">Convenient Ordering</h3>
                <p className="text-gray-600">Order meals easily through our mobile-friendly platform</p>
              </div>
              <div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Star className="h-8 w-8 text-brand-red mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
                <p className="text-gray-600">Enjoy restaurant-quality meals at your workplace</p>
              </div>
            </div>
          </div>

          {/* For Home Chefs */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <ChefHat className="h-12 w-12 text-brand-red mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold text-gray-900">For Home Chefs</h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Grow your culinary business with corporate clients
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Wallet className="h-8 w-8 text-brand-red mb-4" />
                <h3 className="text-xl font-semibold mb-2">Steady Income</h3>
                <p className="text-gray-600">Secure regular orders and predictable revenue</p>
              </div>
              <div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Award className="h-8 w-8 text-brand-red mb-4" />
                <h3 className="text-xl font-semibold mb-2">Professional Growth</h3>
                <p className="text-gray-600">Build your reputation and expand your client base</p>
              </div>
              <div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Users className="h-8 w-8 text-brand-red mb-4" />
                <h3 className="text-xl font-semibold mb-2">Business Support</h3>
                <p className="text-gray-600">Access tools and resources to scale your operations</p>
              </div>
            </div>
          </div>

          {/* For Community */}
          <div>
            <div className="text-center mb-16">
              <Users2 className="h-12 w-12 text-brand-red mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold text-gray-900">For Community</h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Join a thriving food community
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <MessageCircle className="h-8 w-8 text-brand-red mb-4" />
                <h3 className="text-xl font-semibold mb-2">Share Experiences</h3>
                <p className="text-gray-600">Connect with other food enthusiasts and share stories</p>
              </div>
              <div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <UserPlus className="h-8 w-8 text-brand-red mb-4" />
                <h3 className="text-xl font-semibold mb-2">Network Growth</h3>
                <p className="text-gray-600">Build relationships with local food professionals</p>
              </div>
              <div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Star className="h-8 w-8 text-brand-red mb-4" />
                <h3 className="text-xl font-semibold mb-2">Events & Workshops</h3>
                <p className="text-gray-600">Participate in community events and culinary workshops</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-kitchen bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-brand-orange">Join us today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-red hover:bg-brand-orange transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-brand-red bg-white hover:bg-gray-50"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;