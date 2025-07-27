import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Building2, Search, Save, Navigation, CheckCircle, AlertTriangle } from 'lucide-react';
import { locations } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
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
  const [position, setPosition] = useState(initialPosition || [33.6844, 73.0479]);

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
      style={{ height: '400px', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents />
      <Marker position={position}>
        <Popup>Company Location</Popup>
      </Marker>
    </MapContainer>
  );
};

const CompanyLocationSetup = () => {
  const { user } = useAuth();
  const [searchAddress, setSearchAddress] = useState('');
  const [mapPosition, setMapPosition] = useState([33.6844, 73.0479]);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);

  const companyId = user?.corporateCompany?.companyID;

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LocationForm>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      latitude: 33.6844,
      longitude: 73.0479,
    },
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
    onError: () => {
      setSaveResult({ success: false, message: 'Failed to find address. Please try a different search.' });
    },
  });

  const assignLocationMutation = useMutation({
    mutationFn: (data: LocationForm) => locations.assignToCompany(companyId!, data),
    onSuccess: (response) => {
      if (response.isSuccess) {
        setSaveResult({ success: true, message: 'Company location set successfully! Your employees can now place orders.' });
      } else {
        setSaveResult({ success: false, message: response.message || 'Failed to set company location.' });
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to set location. Please try again.';
      setSaveResult({ success: false, message: errorMessage });
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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setValue('latitude', latitude);
          setValue('longitude', longitude);
          setMapPosition([latitude, longitude]);
          handleMapLocationSelect(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setSaveResult({ success: false, message: 'Unable to get your current location. Please select manually on the map.' });
        }
      );
    } else {
      setSaveResult({ success: false, message: 'Geolocation is not supported by this browser.' });
    }
  };

  const closeSaveResult = () => {
    setSaveResult(null);
  };

  if (!companyId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Company Access Required</h1>
          <p className="text-gray-600">
            You need to be logged in as a company to set up your location.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Building2 className="h-8 w-8 text-brand-red mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Set Up Company Location</h1>
            </div>
            <p className="text-gray-600">
              Set your company's location to help us find nearby chefs and calculate accurate delivery times for your employees.
            </p>
          </div>

          <form onSubmit={handleSubmit((data) => assignLocationMutation.mutate(data))} className="space-y-8">
            {/* Address Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Company Address
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  placeholder="Enter your company address..."
                />
                <button
                  type="button"
                  onClick={handleGeocodeSearch}
                  disabled={geocodeMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <Search className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Navigation className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Search for your company address or use current location
              </p>
            </div>

            {/* Map */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Company Location
              </label>
              <LocationPicker
                onLocationSelect={handleMapLocationSelect}
                initialPosition={mapPosition}
              />
              <p className="mt-2 text-sm text-gray-500">
                Click on the map to set your exact company location
              </p>
            </div>

            {/* Coordinates Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Latitude</label>
                <input
                  type="number"
                  step="any"
                  {...register('latitude', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  readOnly
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
                  readOnly
                />
                {errors.longitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>
                )}
              </div>
            </div>

            {/* Address Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Address</label>
              <input
                type="text"
                {...register('formattedAddress')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                placeholder="Complete address will appear here"
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
                <label className="block text-sm font-medium text-gray-700">State/Province</label>
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

            {/* Important Notice */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Building2 className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Important:</strong> Your company location will be used to find nearby chefs and calculate delivery distances. 
                    This ensures your employees get fresh meals delivered quickly.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={assignLocationMutation.isPending}
                className="flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {assignLocationMutation.isPending ? 'Setting Location...' : 'Set Company Location'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Save Result Modal */}
      {saveResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              {saveResult.success ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              ) : (
                <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              )}
              <h3 className={`text-lg font-semibold mb-2 ${
                saveResult.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {saveResult.success ? 'Location Set Successfully!' : 'Location Setup Failed'}
              </h3>
              <p className={`mb-6 ${
                saveResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {saveResult.message}
              </p>
              <button
                onClick={closeSaveResult}
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                  saveResult.success 
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyLocationSetup;