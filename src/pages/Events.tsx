import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Users, MapPin, Clock, ChefHat } from 'lucide-react';
import { events } from '../lib/api';

const Events = () => {
  const { data: upcomingEvents, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: events.getUpcoming,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Events & Catering</h1>
          <p className="mt-4 text-xl text-gray-600">
            Plan your next corporate event with our expert catering services
          </p>
        </div>

        {/* Event Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Calendar className="h-12 w-12 text-brand-red mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Corporate Events</h3>
            <p className="text-gray-600">
              Perfect for team meetings, conferences, and company celebrations
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <ChefHat className="h-12 w-12 text-brand-red mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Custom Menus</h3>
            <p className="text-gray-600">
              Tailored menus to match your event theme and dietary requirements
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Users className="h-12 w-12 text-brand-red mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Full Service</h3>
            <p className="text-gray-600">
              Complete event planning and catering service
            </p>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
          <div className="space-y-6">
            {upcomingEvents?.map((event) => (
              <div key={event.id} className="border-b border-gray-200 pb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>{event.date}</span>
                        <Clock className="h-5 w-5 ml-4 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>{event.location}</span>
                        <Users className="h-5 w-5 ml-4 mr-2" />
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <button className="px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Menu</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {event.menu.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-brand-red rounded-lg shadow-lg p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Plan Your Event</h2>
            <p className="text-lg mb-6">
              Let us help you create an unforgettable experience for your team
            </p>
            <button className="px-8 py-3 bg-white text-brand-red rounded-md hover:bg-gray-100 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;