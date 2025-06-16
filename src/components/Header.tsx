import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Clock, Upload, Users, Star, X, User, Search } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/timeline', label: 'Timeline', icon: Clock },
    { to: '/upload', label: 'Upload', icon: Upload },
    { to: '/members', label: 'Members', icon: Users }
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  const getDisplayName = () => {
    if (!currentUser) return 'User';
    return currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#181411]/90 backdrop-blur-md border-b border-[#382f29] px-6 sm:px-10 py-4">
      <div className="flex items-center justify-between">
        <Link to={currentUser ? '/dashboard' : '/'} className="flex items-center gap-3">
          <Star className="w-6 h-6 text-[#e9883e]" />
          <h1 className="text-xl font-bold text-white font-serif">Legacy</h1>
        </Link>

        {currentUser ? (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/dashboard" className="text-[#b8a99d] hover:text-[#e9883e] transition-colors">
                Dashboard
              </Link>
              <Link to="/timeline" className="text-[#b8a99d] hover:text-[#e9883e] transition-colors">
                Timeline
              </Link>
              <Link to="/upload" className="text-[#b8a99d] hover:text-[#e9883e] transition-colors">
                Upload
              </Link>
              <Link to="/members" className="text-[#b8a99d] hover:text-[#e9883e] transition-colors">
                Members
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-[#b8a99d] hover:text-[#e9883e] transition-colors"
              >
                <div className="relative w-6 h-6">
                  <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${mobileOpen ? 'rotate-45 top-2.5' : 'top-1'}`}></span>
                  <span className={`absolute h-0.5 w-6 bg-current top-2.5 transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${mobileOpen ? '-rotate-45 top-2.5' : 'top-4'}`}></span>
                </div>
              </button>

              {/* Profile Avatar */}
              <div className="hidden md:block">
                <ProfileAvatar />
              </div>
            </div>

            {/* Mobile Sidebar */}
            {mobileOpen && (
              <div className="fixed inset-0 z-50 md:hidden">
                {/* Enhanced Backdrop with stronger blur */}
                <div 
                  className="absolute inset-0 bg-black/80 backdrop-blur-lg transition-opacity duration-300" 
                  onClick={() => setMobileOpen(false)} 
                />

                {/* Sidebar Container with solid background */}
                <div className="absolute top-0 left-0 h-full w-80 bg-[#181411] shadow-2xl transition-transform duration-300 ease-in-out animate-slideInLeft">
                  
                  {/* Header with User Profile */}
                  <div className="p-6 border-b border-[#382f29]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Star className="w-6 h-6 text-[#e9883e]" />
                        <h1 className="text-xl font-bold text-white font-serif">Legacy</h1>
                      </div>
                      <button
                        onClick={() => setMobileOpen(false)}
                        className="text-[#b8a99d] hover:text-white transition-colors p-1"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {/* User Profile Card */}
                    <div className="bg-[#2c2520] rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        {currentUser?.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt="Profile"
                            className="w-12 h-12 rounded-full border-2 border-[#e9883e] object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#e9883e] text-[#181411] flex items-center justify-center text-sm font-bold border-2 border-[#e9883e]">
                            {getUserInitials(getDisplayName())}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm truncate">{getDisplayName()}</h3>
                          <p className="text-[#b8a99d] text-xs truncate">{currentUser?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#b8a99d]" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-[#2c2520] border border-[#382f29] rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-[#b8a99d] focus:outline-none focus:border-[#e9883e] focus:ring-0 text-sm"
                      />
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="px-4 pb-4">
                    <div className="space-y-1">
                      {navigationItems.map(({ to, label, icon: Icon }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActiveRoute(to)
                              ? 'bg-[#382f29] text-[#e9883e] shadow-sm'
                              : 'text-[#b8a99d] hover:bg-[#2c2520] hover:text-white'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isActiveRoute(to) ? 'text-[#e9883e]' : 'text-[#b8a99d]'}`} />
                          <span>{label}</span>
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>
              </div>
            )}
          </>
        ) : (
          <nav className="flex items-center gap-6">
            <Link to="/login" className="text-[#b8a99d] hover:text-[#e9883e] transition-colors">
              Login
            </Link>
            <Link 
              to="/signup" 
              className="bg-[#e9883e] text-[#181411] px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;