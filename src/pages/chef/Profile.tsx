import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ChefHat, 
  Star, 
  Award, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Edit,
  User
} from 'lucide-react';
import { auth, chefs } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

const ChefProfile = () => {
  const { user } = useAuth();

  // ✅ Use chef ID directly from auth context (like in UploadMeal)
  const chefId = user?.homeChef?.chefID;

  // ✅ Fetch chef profile using the chefId
  const { data: chefData, isLoading } = useQuery({
    queryKey: ['chef-profile', chefId],
    queryFn: () => chefs.getById(chefId.toString()),
    enabled: !!chefId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading profile...</div>
      </div>
    );
  }

  const chef = chefData?.data;

  if (!chef) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <ChefHat className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chef Profile Not Found</h1>
          <p className="text-gray-600">
            Unable to load chef profile information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-48">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80"
              alt="Chef Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end">
              <div className="flex items-center space-x-6">
                <div className="h-24 w-24 rounded-full border-4 border-white bg-brand-red flex items-center justify-center">
                  <ChefHat className="h-12 w-12 text-white" />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">{chef.fullName}</h1>
                  <p className="text-gray-200">Professional Chef</p>
                  <div className="flex items-center mt-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-white">4.8 (125 reviews)</span>
                  </div>
                </div>
              </div>
              <button className="ml-auto bg-brand-red text-white px-4 py-2 rounded-md hover:bg-brand-orange transition-colors flex items-center">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{chef.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{chef.phoneNumber}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{chef.address}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <span>Chef ID: {chef.chefID}</span>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Account Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium">{chef.userID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chef ID</p>
                  <p className="font-medium">{chef.chefID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Email</p>
                  <p className="font-medium">{chef.email}</p>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Availability</h2>
              <div className="space-y-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="capitalize">{day}</span>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <ChefHat className="h-8 w-8 text-brand-red" />
                  <span className="text-2xl font-bold">12</span>
                </div>
                <p className="mt-2 text-gray-600">Total Meals</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <Star className="h-8 w-8 text-brand-red" />
                  <span className="text-2xl font-bold">4.8</span>
                </div>
                <p className="mt-2 text-gray-600">Average Rating</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <Award className="h-8 w-8 text-brand-red" />
                  <span className="text-2xl font-bold">89</span>
                </div>
                <p className="mt-2 text-gray-600">Completed Orders</p>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-600 mb-4">
                Passionate chef with over 10 years of experience in creating delicious and nutritious meals. 
                Specializing in traditional and modern cuisine with a focus on fresh, local ingredients.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-brand-red mr-2" />
                  <span>Traditional Cuisine</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-brand-red mr-2" />
                  <span>Healthy Cooking</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-brand-red mr-2" />
                  <span>Meal Planning</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-brand-red mr-2" />
                  <span>Dietary Restrictions</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">New meal uploaded</p>
                    <p className="text-sm text-gray-500">Chicken Karahi added to menu</p>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Order completed</p>
                    <p className="text-sm text-gray-500">Delivered to Tech Colleagues</p>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Profile updated</p>
                    <p className="text-sm text-gray-500">Contact information updated</p>
                  </div>
                  <span className="text-sm text-gray-500">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefProfile;