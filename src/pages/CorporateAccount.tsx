import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Users, Wallet, BarChart as ChartBar, Receipt, Settings } from 'lucide-react';
import { corporate } from '../lib/api';

const CorporateAccount = () => {
  const { data: account, isLoading } = useQuery({
    queryKey: ['corporate-account'],
    queryFn: corporate.getAccountDetails,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading account details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Corporate Account Management</h1>
          <p className="mt-2 text-gray-600">Manage your company's meal program and settings</p>
        </div>

        {/* Company Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Building2 className="h-10 w-10 text-brand-red" />
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">{account?.company.name}</h2>
                <p className="text-gray-600">{account?.company.plan} Plan</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors">
              Upgrade Plan
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-brand-red" />
                <span className="ml-2 text-gray-600">Total Employees</span>
              </div>
              <p className="mt-2 text-2xl font-bold">{account?.company.employees}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <Wallet className="h-6 w-6 text-brand-red" />
                <span className="ml-2 text-gray-600">Monthly Budget</span>
              </div>
              <p className="mt-2 text-2xl font-bold">${account?.company.mealAllowance.monthly}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <Receipt className="h-6 w-6 text-brand-red" />
                <span className="ml-2 text-gray-600">Current Bill</span>
              </div>
              <p className="mt-2 text-2xl font-bold">${account?.company.billing.current}</p>
            </div>
          </div>
        </div>

        {/* Department Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Department Budgets</h3>
            <div className="space-y-4">
              {account?.company.departments.map((dept) => (
                <div key={dept.name} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{dept.name}</span>
                    <span className="text-brand-red font-semibold">${dept.budget}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{dept.employees} employees</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Billing History</h3>
            <div className="space-y-4">
              {account?.company.billing.history.map((bill) => (
                <div key={bill.month} className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">{bill.month}</span>
                  <span className="font-medium">${bill.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Meal Allowance Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Daily Limit</label>
                  <input
                    type="number"
                    value={account?.company.mealAllowance.daily}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Limit</label>
                  <input
                    type="number"
                    value={account?.company.mealAllowance.monthly}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Notification Preferences</h4>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-red focus:ring-brand-red" />
                  <span className="ml-2 text-sm text-gray-600">Daily budget alerts</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-red focus:ring-brand-red" />
                  <span className="ml-2 text-sm text-gray-600">Monthly reports</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-red focus:ring-brand-red" />
                  <span className="ml-2 text-sm text-gray-600">Employee activity notifications</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateAccount;