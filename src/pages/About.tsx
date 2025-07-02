import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Truck, Shield, Clock, Award, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-brand-red">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80"
            alt="Corporate kitchen"
          />
          <div className="absolute inset-0 bg-brand-red mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">About MealHub</h1>
          <p className="mt-6 max-w-3xl text-xl text-white">
            Revolutionizing corporate meal management through technology and culinary excellence
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-brand-red font-semibold tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Connecting Companies with Culinary Excellence
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We're on a mission to transform corporate dining by connecting businesses with talented local chefs, 
              ensuring employees have access to delicious, nutritious meals every day.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-brand-light py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-brand-red" />
                <h3 className="ml-3 text-xl font-medium text-gray-900">Quality Assured</h3>
              </div>
              <p className="mt-4 text-gray-500">
                All our chefs are vetted professionals with proven track records in culinary excellence.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-brand-red" />
                <h3 className="ml-3 text-xl font-medium text-gray-900">Timely Delivery</h3>
              </div>
              <p className="mt-4 text-gray-500">
                Real-time tracking ensures your meals arrive exactly when you need them.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-brand-red" />
                <h3 className="ml-3 text-xl font-medium text-gray-900">Dietary Care</h3>
              </div>
              <p className="mt-4 text-gray-500">
                Customizable meal plans catering to all dietary preferences and restrictions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-brand-red">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-5xl font-extrabold text-white">500+</p>
              <p className="mt-2 text-xl font-medium text-white">Corporate Partners</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold text-white">50k+</p>
              <p className="mt-2 text-xl font-medium text-white">Daily Meals</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold text-white">100+</p>
              <p className="mt-2 text-xl font-medium text-white">Expert Chefs</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Ready to transform your corporate dining?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Join MealHub today and give your employees access to delicious, nutritious meals from top local chefs.
              </p>
              <div className="mt-8 space-x-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-red hover:bg-brand-orange"
                >
                  Get Started
                </Link>
                <Link
                  to="/meals"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-brand-red bg-white border-brand-red hover:bg-brand-light"
                >
                  View Meals
                </Link>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
              <div className="col-span-1 flex justify-center py-8 px-8 bg-brand-light">
                <Award className="h-12 w-12 text-brand-red" />
              </div>
              <div className="col-span-1 flex justify-center py-8 px-8 bg-brand-light">
                <ChefHat className="h-12 w-12 text-brand-red" />
              </div>
              <div className="col-span-1 flex justify-center py-8 px-8 bg-brand-light">
                <Truck className="h-12 w-12 text-brand-red" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;