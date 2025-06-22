import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const CorporateDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Corporate Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Active Meal Plans</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Total Employees</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Monthly Budget</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">$0</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 transition-colors">
            Manage Meal Plans
          </button>
          <button className="bg-green-600 text-white rounded-lg px-4 py-3 hover:bg-green-700 transition-colors">
            Add Employees
          </button>
          <button className="bg-purple-600 text-white rounded-lg px-4 py-3 hover:bg-purple-700 transition-colors">
            View Reports
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 text-center text-gray-500">
            No recent activity to display
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateDashboard;