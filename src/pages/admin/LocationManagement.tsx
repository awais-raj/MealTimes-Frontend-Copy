import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Plus, Edit, Trash2, Search, Globe, Navigation, X, Save } from 'lucide-react';
import { locations } from '../../lib/api';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  formattedAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

type LocationForm = z.infer<typeof locationSchema>;

const LocationPicker = ({ onLocationSelect, initialPosition }: any) => {
  const [position, setPosition] = useState(initialPosition || [33.6844, 73.0479]); // Default to Islamabad

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '300px', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents />
      <Marker position={position}>
        <Popup>Selected Location</Popup>
      </Marker>
    </MapContainer>
  );
};

const LocationManagement = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [mapPosition, setMapPosition] = useState([33.6844, 73.0479]);

  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<LocationForm>({
    resolver: zodResolver(locationSchema),
  });

  // Mock query for locations list (you can implement get all locations endpoint)
  const { data: locationsData, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: () => Promise.resolve([]), // Replace with actual API call when available
  });

  const geocodeMutation = useMutation({
    mutationFn: (address: string) => locations.geocodeAddress(address),
    onSuccess: (response) => {
      if (response.isSuccess && response.data) {
        const { latitude, longitude, formattedAddress, city, state, postalCode, country } = response.data;
        setValue('latitude', latitude);
        setValue('longitude', longitude);
        setValue('formattedAddress', formattedAddress);
        setValue('city', city);
        setValue('state', state);
        setValue('postalCode', postalCode);
        setValue('country', country);
        setMapPosition([latitude, longitude]);
      }
    },
  });

  const createLocationMutation = useMutation({
    mutationFn: (data: LocationForm) => locations.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setShowCreateModal(false);
      reset();
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: (data: LocationForm) => locations.update(selectedLocation.locationID, {
      locationID: selectedLocation.locationID,
      ...data
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setShowEditModal(false);
      setSelectedLocation(null);
      reset();
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: (id: string) => locations.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  const handleGeocodeSearch = () => {
    if (searchAddress.trim()) {
      geocodeMutation.mutate(searchAddress);
    }
  };

  const handleMapLocationSelect = async (lat: number, lng: number) => {
    setValue('latitude', lat);
    setValue('longitude', lng);
    
    // Reverse geocode to get address
    try {
      const response = await locations.reverseGeocode(lat, lng);
      if (response.isSuccess && response.data) {
        const { formattedAddress, city, state, postalCode, country } = response.data;
        setValue('formattedAddress', formattedAddress);
        setValue('city', city);
        setValue('state', state);
        setValue('postalCode', postalCode);
        setValue('country', country);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const handleEdit = (location: any) => {
    setSelectedLocation(location);
    reset({
      latitude: location.latitude,
      longitude: location.longitude,
      formattedAddress: location.formattedAddress,
      city: location.city,
      state: location.state,
      postalCode: location.postalCode,
      country: location.country,
    });
    setMapPosition([location.latitude, location.longitude]);
    setShowEditModal(true);
  };

  const handleDelete = (location: any) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      deleteLocationMutation.mutate(location.locationID.toString());
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Location Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage service locations and coverage areas
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </button>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample location cards - replace with real data */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <MapPin className="h-8 w-8 text-brand-red" />
            <div className="flex space-x-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sample Location</h3>
          <p className="text-sm text-gray-600 mb-2">Islamabad, Pakistan</p>
          <p className="text-xs text-gray-500">Lat: 33.6844, Lng: 73.0479</p>
        </div>
      </div>

      {/* Create Location Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Location</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit((data) => createLocationMutation.mutate(data))} className="space-y-6">
              {/* Address Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Address
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                    placeholder="Enter address to search..."
                  />
                  <button
                    type="button"
                    onClick={handleGeocodeSearch}
                    disabled={geocodeMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Map */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Location on Map
                </label>
                <LocationPicker
                  onLocationSelect={handleMapLocationSelect}
                  initialPosition={mapPosition}
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    {...register('latitude', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  />
                  {errors.latitude && (
                    <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    {...register('longitude', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  />
                  {errors.longitude && (
                    <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>
                  )}
                </div>
              </div>

              {/* Address Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Formatted Address</label>
                <input
                  type="text"
                  {...register('formattedAddress')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    {...register('city')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    {...register('state')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    {...register('postalCode')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    {...register('country')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLocationMutation.isPending}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {createLocationMutation.isPending ? 'Creating...' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationManagement;