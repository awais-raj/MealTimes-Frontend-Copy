import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Menu, LogOut, User, Settings, ChefHat, Building2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'Admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard' },
          { to: '/admin/users', label: 'Users' },
          { to: '/admin/subscription-plans', label: 'Subscription Plans' },
          { to: '/admin/reports', label: 'Reports' },
        ];
      case 'Company':
        return [
          { to: '/corporate/dashboard', label: 'Dashboard' },
          { to: '/corporate/subscription-plans', label: 'Subscription Plans' },
          { to: '/corporate/account', label: 'Account' },
        ];
      case 'Employee':
        return [
          { to: '/employee/dashboard', label: 'Dashboard' },
          { to: '/employee/meals', label: 'Browse Meals' },
          { to: '/employee/preferences', label: 'Preferences' },
        ];
      case 'Chef':
        return [
          { to: '/chef/dashboard', label: 'Dashboard' },
          { to: '/chef/meals', label: 'My Meals' },
          { to: '/chef/upload-meal', label: 'Upload Meal' },
          { to: '/chef/orders', label: 'Orders' },
          { to: '/chef/profile', label: 'Profile' },
        ];
      default:
        return [];
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'Admin':
        return <Settings className="h-5 w-5" />;
      case 'Company':
        return <Building2 className="h-5 w-5" />;
      case 'Employee':
        return <User className="h-5 w-5" />;
      case 'Chef':
        return <ChefHat className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-brand-red" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-brand-red to-brand-orange bg-clip-text text-transparent">
                  MealTimes
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                {getNavLinks().map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-gray-700 hover:text-brand-red px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center space-x-2 text-gray-700 px-3 py-2">
                  {getRoleIcon()}
                  <span className="text-sm font-medium capitalize">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-brand-red px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-brand-red px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-red text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-orange transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-brand-red focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                {getNavLinks().map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-red"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-red"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-red"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-red"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}