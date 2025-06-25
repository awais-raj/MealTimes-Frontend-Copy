import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryPersons, delivery } from '../../lib/api';
import { 
  Truck, 
  Package, 
  Clock, 
  CheckCircle, 
  MapPin,
  User,
  Mail,
  Phone,
  Car,
  Edit,
  Save,
  X,
  Navigation
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    deliveryPersonID: 0,
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    vehicleInfo: ''
  });

  const deliveryPersonId = user?.deliveryPerson?.deliveryPersonID;

  // Fetch delivery person details
  const { data: deliveryPersonResponse, isLoading: profileLoading } = useQuery({
    queryKey: ['delivery-person-details', deliveryPersonId],
    queryFn: () => deliveryPersons.getById(deliveryPersonId?.toString() || ''),
    enabled: !!deliveryPersonId,
  });

  // Fetch assigned deliveries
  const { data: deliveriesResponse, isLoading: deliveriesLoading } = useQuery({
    queryKey: ['assigned-deliveries', deliveryPersonId],
    queryFn: () => deliveryPersons.getAssignedDeliveries(deliveryPersonId?.toString() || ''),
    enabled: !!deliveryPersonId,
  });

  const deliveryPerson = deliveryPersonResponse?.data;
  const assignedDeliveries = deliveriesResponse?.data || [];

  // Update delivery person mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => deliveryPersons.update(deliveryPersonId?.toString() || '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-person-details', deliveryPersonId] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    },
  });

  // Update delivery status mutation
  const updateDeliveryStatusMutation = useMutation({
    mutationFn: (data: { deliveryID: number; newStatus: string }) =>
      delivery.updateDeliveryStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assigned-deliveries', deliveryPersonId] });
    },
    onError: (error) => {
      console.error('Delivery status update failed:', error);
    },
  });

  const handleEdit = () => {
    if (deliveryPerson) {
      setEditForm({
        deliveryPersonID: deliveryPerson.deliveryPersonID,
        fullName: deliveryPerson.fullName,
        email: deliveryPerson.email,
        phoneNumber: deliveryPerson.phoneNumber || '',
        address: deliveryPerson.address || '',
        vehicleInfo: deliveryPerson.vehicleInfo || ''
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editForm);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      deliveryPersonID: 0,
      fullName: '',
      email: '',
      phoneNumber: '',
      address: '',
      vehicleInfo: ''
    });
  };

  const handleStatusUpdate = (deliveryId: number, newStatus: string) => {
    updateDeliveryStatusMutation.mutate({
      deliveryID: deliveryId,
      newStatus
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'assigned':
        return <Package className="h-5 w-5 text-purple-500" />;
      case 'intransit':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      case 'intransit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate statistics
  const totalDeliveries = assignedDeliveries.length;
  const pendingDeliveries = assignedDeliveries.filter((delivery: any) => delivery.status === 'Assigned').length;
  const inTransitDeliveries = assignedDeliveries.filter((delivery: any) => delivery.status === 'InTransit').length;
  const completedDeliveries = assignedDeliveries.filter((delivery: any) => delivery.status === 'Delivered').length;

  if (profileLoading || deliveriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {deliveryPerson?.fullName}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-brand-red" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Deliveries</dt>
                  <dd className="text-lg font-semibold text-gray-900">{totalDeliveries}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-semibold text-gray-900">{pendingDeliveries}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Truck className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Transit</dt>
                  <dd className="text-lg font-semibold text-gray-900">{inTransitDeliveries}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-semibold text-gray-900">{completedDeliveries}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-brand-light flex items-center justify-center">
              <Truck className="h-6 w-6 text-brand-red" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
              <p className="text-gray-600">Delivery Person ID: #{deliveryPerson?.deliveryPersonID}</p>
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
                disabled={updateProfileMutation.isPending}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
              />
            ) : (
              <p className="text-gray-900 font-medium">{deliveryPerson?.fullName}</p>
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
              <p className="text-gray-900 font-medium">{deliveryPerson?.email}</p>
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
              <p className="text-gray-900 font-medium">{deliveryPerson?.phoneNumber || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Car className="h-4 w-4 inline mr-2" />
              Vehicle Info
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.vehicleInfo}
                onChange={(e) => setEditForm({ ...editForm, vehicleInfo: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
              />
            ) : (
              <p className="text-gray-900 font-medium">{deliveryPerson?.vehicleInfo || 'Not provided'}</p>
            )}
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
              <p className="text-gray-900 font-medium">{deliveryPerson?.address || 'Not provided'}</p>
            )}
          </div>
        </div>

        {updateProfileMutation.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">
              Failed to update profile. Please try again.
            </p>
          </div>
        )}
      </div>

      {/* Assigned Deliveries */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Assigned Deliveries</h2>
        
        {assignedDeliveries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignedDeliveries.map((delivery: any) => (
                  <tr key={delivery.deliveryID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">#{delivery.deliveryID}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">#{delivery.orderID}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{delivery.deliveryServiceName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{delivery.trackingNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(delivery.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {delivery.status === 'Assigned' && (
                        <button
                          onClick={() => handleStatusUpdate(delivery.deliveryID, 'InTransit')}
                          disabled={updateDeliveryStatusMutation.isPending}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium disabled:opacity-50"
                        >
                          Start Delivery
                        </button>
                      )}
                      {delivery.status === 'InTransit' && (
                        <button
                          onClick={() => handleStatusUpdate(delivery.deliveryID, 'Delivered')}
                          disabled={updateDeliveryStatusMutation.isPending}
                          className="text-green-600 hover:text-green-900 text-sm font-medium disabled:opacity-50"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {delivery.status === 'Delivered' && (
                        <span className="text-sm text-gray-500">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Navigation className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No deliveries assigned</h3>
            <p className="mt-1 text-sm text-gray-500">
              Delivery assignments will appear here when available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;