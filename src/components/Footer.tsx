import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigation = {
    company: [
      { name: 'About', href: '/about' },
      { name: 'Support', href: '/support' },
    ],
    social: [
      { name: 'Facebook', icon: Facebook, href: '#' },
      { name: 'Twitter', icon: Twitter, href: '#' },
      { name: 'Instagram', icon: Instagram, href: '#' },
      { name: 'LinkedIn', icon: Linkedin, href: '#' },
    ],
  };

  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Top section with logo and social links */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <Clock className="h-8 w-8 text-brand-red" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-brand-red to-brand-orange bg-clip-text text-transparent">
              MealTimes
            </span>
          </div>
          <div className="flex space-x-6">
            {navigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-brand-red"
              >
                <item.icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-4">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={handleLinkClick}
                    className="text-base text-gray-500 hover:text-brand-red"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-gray-200">
          <div className="flex items-center">
            <Mail className="h-6 w-6 text-brand-red mr-3" />
            <span className="text-gray-500">contact@mealtimes.com</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-6 w-6 text-brand-red mr-3" />
            <span className="text-gray-500">+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-brand-red mr-3" />
            <span className="text-gray-500">123 Culinary Street, NY 10001</span>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} MealTimes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;