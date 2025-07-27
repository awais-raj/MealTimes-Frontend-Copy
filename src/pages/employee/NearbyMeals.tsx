import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Search, Filter, UtensilsCrossed, Clock, Star, ChefHat, Navigation } from 'lucide-react';
import { locations } from '../../lib/api';
import { useCurrency } from '../../contexts/CurrencyContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const NearbyMeals = () => {
  const { formatPrice } = useCurrency();
  const [searchLocation, setSearchLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(20);
  const [locationFilter, setLocationFilter] = useState({
    latitude: 33.6844,
    longitude: 73.0479,
    radiusKm: 20,
    city: '',
    state: ''
  });

  const { data: nearbyMealsResponse, isLoading, refetch } = useQuery({
    queryKey: ['nearby-meals', locationFilter],
    queryFn: () => locations.getNearbyMeals(locationFilter),
    enabled: !!locationFilter.latitude && !!locationFilter.longitude,
  });

  const nearbyMeals = nearbyMealsResponse?.data || [];

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setLocationFilter(prev => ({
            ...prev,
            latitude,
            longitude
          }));
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your current location. Please search for your location manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleLocationSearch = async () => {
    if (searchLocation.trim()) {
      try {
        const response = await locations.geocodeAddress(searchLocation);
        if (response.isSuccess && response.data) {
          const { latitude, longitude, city, state } = response.data;
          setLocationFilter({
            latitude,
            longitude,
            radiusKm: radius,
            city: city || '',
            state: state || ''
          });
          setCurrentLocation({ lat: latitude, lng: longitude });
        }
      } catch (error) {
        console.error('Geocoding failed:', error);
        alert('Failed to find location. Please try a different search.');
      }
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    setLocationFilter(prev => ({
      ...prev,
      radiusKm: newRadius
    }));
  };

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Hero Section */}
      <div className="relative bg-kitchen bg-cover bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find Nearby Meals
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-100">
            Discover delicious meals from chefs in your area
          </p>
        </div>
      </div>

      {/* Location Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search by Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                  placeholder="Enter your location..."
                />
              </div>
            </div>
            
            <div>
              <select
                value={radius}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm rounded-md"
              >
                <option value={5}>5 km radius</option>
                <option value={10}>10 km radius</option>
                <option value={20}>20 km radius</option>
                <option value={50}>50 km radius</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleLocationSearch}
                className="flex-1 bg-brand-red text-white px-4 py-2 rounded-md hover:bg-brand-orange transition-colors"
              >
                <Search className="h-4 w-4 inline mr-2" />
                Search
              </button>
              <button
                onClick={getCurrentLocation}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <Navigation className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Map View */}
        {currentLocation && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Location</h2>
            <div className="h-64 rounded-lg overflow-hidden">
              <MapContainer
                center={[currentLocation.lat, currentLocation.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[currentLocation.lat, currentLocation.lng]}>
                  <Popup>Your Location</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Nearby Meals</h2>
            <div className="text-sm text-gray-500">
              {nearbyMeals.length} meals found within {radius}km
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-xl font-semibold">Searching for nearby meals...</div>
            </div>
          ) : nearbyMeals.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {nearbyMeals.map((meal: any) => (
                <div key={meal.mealID} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={meal.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                      alt={meal.mealName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-brand-red">
                        {formatPrice(meal.price)}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold text-gray-900">{meal.mealName}</h2>
                      <span className="px-2 py-1 bg-brand-light text-brand-red text-xs font-semibold rounded">
                        {meal.mealCategory}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{meal.mealDescription}</p>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center text-gray-500">
                        <UtensilsCrossed className="h-4 w-4 mr-1" />
                        <span className="text-sm">Meal ID: {meal.mealID}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{meal.preparationTime} min</span>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        <span className="text-sm">{meal.rating || 'New'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <ChefHat className="h-4 w-4 mr-1" />
                        <span>Chef {meal.chefName}</span>
                      </div>
                      {meal.distance && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{meal.distance.toFixed(1)} km away</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <UtensilsCrossed className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No nearby meals found</h3>
              <p className="text-gray-500 mb-4">
                Try expanding your search radius or searching in a different location.
              </p>
              <button
                onClick={() => handleRadiusChange(50)}
                className="inline-flex items-center px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Expand to 50km
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyMeals;