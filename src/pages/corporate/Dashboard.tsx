import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { companies } from '../../lib/api';
import { 
  Building2, 
  Users, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save, 
  X,
  UserPlus,
  Settings,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CorporateDashboard = () => {
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

  // Fetch company details
  const { data: companyResponse, isLoading: companyLoading } = useQuery({
    queryKey: ['company-details', companyId],
    queryFn: () => companies.getById(companyId?.toString() || ''),
    enabled: !!companyId,
  });

  // Fetch company employees
  const { data: employeesResponse, isLoading: employeesLoading } = useQuery({
    queryKey: ['company-employees', companyId],
    queryFn: () => companies.getEmployees(companyId?.toString() || ''),
    enabled: !!companyId,
  });

  const company = companyResponse?.data;
  const employees = employeesResponse?.data || [];

  // Update company mutation
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

  if (companyLoading || employeesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Corporate Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {company?.companyName}</p>
      </div>

      {/* Company Overview */}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/corporate/subscription-plans"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-brand-red" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
              <p className="text-sm text-gray-600">View and manage plans</p>
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-brand-red" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Employees</h3>
              <p className="text-2xl font-bold text-brand-red">{employees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-brand-red" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Since</h3>
              <p className="text-sm text-gray-600">
                {company?.planStartDate 
                  ? new Date(company.planStartDate).toLocaleDateString()
                  : 'Not subscribed'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Employees List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Company Employees</h2>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            {employees.length} employees
          </div>
        </div>

        {employees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dietary Preferences
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee: any) => (
                  <tr key={employee.employeeID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-brand-light flex items-center justify-center">
                          <span className="text-brand-red font-medium">
                            {employee.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.dietaryPreferences || 'None specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        #{employee.employeeID}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Employees will appear here once they register with your company.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CorporateDashboard;