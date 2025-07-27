import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Support from './pages/Support';
import ChefApplication from './pages/ChefApplication';
import DeliveryPersonApplication from './pages/DeliveryPersonApplication';
import PublicMeals from './pages/PublicMeals';
import ResetPassword from './pages/ResetPassword';

// Protected Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/admin/Reports';
import FeedbackManagement from './pages/admin/FeedbackManagement';
import PlatformPerformance from './pages/admin/PlatformPerformance';
import SubscriptionPlanManagement from './pages/admin/SubscriptionPlanManagement';
import CreateSubscriptionPlan from './pages/admin/CreateSubscriptionPlan';
import EditSubscriptionPlan from './pages/admin/EditSubscriptionPlan';

import CorporateDashboard from './pages/corporate/Dashboard';
import CorporateAccount from './pages/CorporateAccount';
import SubscriptionPlans from './pages/corporate/SubscriptionPlans';

import EmployeeDashboard from './pages/employee/Dashboard';
import DietaryPreferences from './pages/employee/DietaryPreferences';
import Feedback from './pages/employee/Feedback';
import Meals from './pages/Meals';
import OrderTracking from './pages/OrderTracking';

import ChefDashboard from './pages/chef/Dashboard';
import ChefProfile from './pages/chef/Profile';
import UploadMeal from './pages/chef/UploadMeal';
import OrderManagement from './pages/chef/OrderManagement';
import MealManagement from './pages/chef/MealManagement';
import EditMeal from './pages/chef/EditMeal';
import LocationManagement from './pages/admin/LocationManagement';
import ChefLocationSetup from './pages/chef/LocationSetup';
import CompanyLocationSetup from './pages/corporate/LocationSetup';
import NearbyMeals from './pages/employee/NearbyMeals';

import DeliveryDashboard from './pages/delivery/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Protected Route Component
type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Role-specific dashboard redirect
const DashboardRedirect = () => {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'Admin':
      return <Navigate to="/admin/dashboard" />;
    case 'Company':
      return <Navigate to="/corporate/dashboard" />;
    case 'Employee':
      return <Navigate to="/employee/dashboard" />;
    case 'Chef':
      return <Navigate to="/chef/dashboard" />;
    case 'DeliveryPerson':
      return <Navigate to="/delivery/dashboard" />;
    default:
      return <Navigate to="/" />;
  }
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/chef-application" element={<ChefApplication />} />
                  <Route path="/delivery-application" element={<DeliveryPersonApplication />} />
                  <Route path="/meals" element={<PublicMeals />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/support" element={<Support />} />

                  {/* Dashboard Redirect */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['Admin', 'Company', 'Employee', 'Chef', 'DeliveryPerson']}>
                        <DashboardRedirect />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Admin Routes */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/users" 
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <UserManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/reports" 
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <Reports />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/feedback" 
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <FeedbackManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/performance" 
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <PlatformPerformance />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/subscription-plans" 
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <SubscriptionPlanManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/subscription-plans/create" 
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <CreateSubscriptionPlan />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/subscription-plans/edit/:planId" 
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <EditSubscriptionPlan />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/locations" 
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <LocationManagement />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Corporate Routes */}
                  <Route 
                    path="/corporate/dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['Company']}>
                        <CorporateDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/corporate/account" 
                    element={
                      <ProtectedRoute allowedRoles={['Company']}>
                        <CorporateAccount />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/corporate/subscription-plans" 
                    element={
                      <ProtectedRoute allowedRoles={['Company']}>
                        <SubscriptionPlans />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/corporate/location-setup" 
                    element={
                      <ProtectedRoute allowedRoles={['Company']}>
                        <CompanyLocationSetup />
                      </ProtectedRoute>
                    } 
                  />
                  {/* Employee Routes */}
                  <Route 
                    path="/employee/dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['Employee']}>
                        <EmployeeDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/employee/meals" 
                    element={
                      <ProtectedRoute allowedRoles={['Employee']}>
                        <Meals />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/employee/orders/:orderId" 
                    element={
                      <ProtectedRoute allowedRoles={['Employee']}>
                        <OrderTracking />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/employee/preferences" 
                    element={
                      <ProtectedRoute allowedRoles={['Employee']}>
                        <DietaryPreferences />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/employee/feedback" 
                    element={
                      <ProtectedRoute allowedRoles={['Employee']}>
                        <Feedback />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/employee/nearby-meals" 
                    element={
                      <ProtectedRoute allowedRoles={['Employee']}>
                        <NearbyMeals />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Chef Routes */}
                  <Route 
                    path="/chef/dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['Chef']}>
                        <ChefDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/chef/profile" 
                    element={
                      <ProtectedRoute allowedRoles={['Chef']}>
                        <ChefProfile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/chef/upload-meal" 
                    element={
                      <ProtectedRoute allowedRoles={['Chef']}>
                        <UploadMeal />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/chef/meals" 
                    element={
                      <ProtectedRoute allowedRoles={['Chef']}>
                        <MealManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/chef/edit-meal/:mealId" 
                    element={
                      <ProtectedRoute allowedRoles={['Chef']}>
                        <EditMeal />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/chef/orders" 
                    element={
                      <ProtectedRoute allowedRoles={['Chef']}>
                        <OrderManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/chef/location-setup" 
                    element={
                      <ProtectedRoute allowedRoles={['Chef']}>
                        <ChefLocationSetup />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Delivery Person Routes */}
                  <Route 
                    path="/delivery/dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['DeliveryPerson']}>
                        <DeliveryDashboard />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;