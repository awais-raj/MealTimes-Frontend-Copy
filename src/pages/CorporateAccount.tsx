import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Users, Wallet, BarChart as ChartBar, Receipt, Settings, Edit, Save, X, Mail, Phone, MapPin } from 'lucide-react';
import { companies } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const CorporateAccount = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    companyID: 0,
    companyName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

  const companyId = user?.corporateCompany?.companyID;

  const { data: companyResponse, isLoading } = useQuery({
    queryKey: ['company-details', companyId],
    queryFn: () => companies.getById(companyId?.toString() || ''),
    enabled: !!companyId,
  });

  const updateCompanyMutation = useMutation({
    mutationFn: (data: any) => companies.update(companyId?.toString() || '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-details', companyId] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Company update failed:', error);
    },
  });

  const company = companyResponse?.data;

  const handleEdit = () => {
    if (company) {
      setEditForm({
        companyID: company.companyID,
        companyName: company.companyName,
        email: company.email,
        phoneNumber: company.phoneNumber || '',
        address: company.address
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    updateCompanyMutation.mutate(editForm);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      companyID: 0,
      companyName: '',
      email: '',
      phoneNumber: '',
      address: ''
    });
  };

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
          <p className="mt-2 text-gray-600">Manage your company's profile and settings</p>
        </div>

        {/* Company Profile */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Building2 className="h-10 w-10 text-brand-red" />
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
                <p className="text-gray-600">
                  {company?.activePlanName ? `${company.activePlanName} Plan` : 'No Active Plan'}
                </p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={updateCompanyMutation.isPending}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateCompanyMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="h-4 w-4 inline mr-2" />
                Company Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                />
              ) : (
                <p className="text-gray-900 font-medium">{company?.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                />
              ) : (
                <p className="text-gray-900 font-medium">{company?.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                />
              ) : (
                <p className="text-gray-900 font-medium">{company?.phoneNumber || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company ID
              </label>
              <p className="text-gray-900 font-medium">#{company?.companyID}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                />
              ) : (
                <p className="text-gray-900 font-medium">{company?.address}</p>
              )}
            </div>
          </div>

          {/* Subscription Info */}
          {company?.planStartDate && company?.planEndDate && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Active Subscription</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-600">Plan:</span>
                  <span className="ml-2 font-medium">{company.activePlanName}</span>
                </div>
                <div>
                  <span className="text-green-600">Plan Start:</span>
                  <span className="ml-2 font-medium">{new Date(company.planStartDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-green-600">Plan End:</span>
                  <span className="ml-2 font-medium">{new Date(company.planEndDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          {updateCompanyMutation.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                Failed to update company profile. Please try again.
              </p>
            </div>
          )}
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Notification Preferences</h4>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-red focus:ring-brand-red" defaultChecked />
                  <span className="ml-2 text-sm text-gray-600">Order notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-red focus:ring-brand-red" defaultChecked />
                  <span className="ml-2 text-sm text-gray-600">Monthly reports</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-red focus:ring-brand-red" />
                  <span className="ml-2 text-sm text-gray-600">Marketing emails</span>
                </label>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Account Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Status</label>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Type</label>
                  <p className="text-sm text-gray-900">Corporate Account</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateAccount;