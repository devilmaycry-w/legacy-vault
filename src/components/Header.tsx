import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Clock, Upload, Users, Star, X, Search } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [spinningIdx, setSpinningIdx] = useState<number | null>(null);
  const [brandHover, setBrandHover] = useState(false);

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
    <header className="sticky top-0 z-50 bg-[#181411] border-b border-[#382f29] px-6 sm:px-10 py-4">
      <div className="flex items-center justify-between">
        {/* Brand with premium font and interactive star */}
        <Link
          to={currentUser ? '/dashboard' : '/'}
          className={`
            flex items-center gap-3 select-none
            transition-colors
            group
            ${brandHover ? 'text-[#a78bfa]' : 'text-white'}
          `}
          onMouseEnter={() => setBrandHover(true)}
          onMouseLeave={() => setBrandHover(false)}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: '1.5rem',
            letterSpacing: '0.01em'
          }}
        >
          <Star
            className="w-7 h-7 transition-all duration-300"
            color={brandHover ? '#a78bfa' : '#e9883e'}
            fill={brandHover ? '#a78bfa' : 'none'}
            strokeWidth={brandHover ? 2 : 2.5}
            style={{
              filter: brandHover ? 'drop-shadow(0 0 6px #a78bfa88)' : 'none',
              transition: 'all 0.3s cubic-bezier(.4,2,.6,1)'
            }}
          />
          <span
            className={`
              transition-colors duration-300
              ${brandHover ? 'text-[#a78bfa]' : 'text-white'}
            `}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              letterSpacing: '0.01em'
            }}
          >
            Legacy
          </span>
        </Link>

        {currentUser ? (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigationItems.map(({ to, label, icon: Icon }, idx) => (
                <Link
                  key={to}
                  to={to}
                  className={`
                    group relative flex items-center gap-2 px-3 py-2 rounded-lg transition
                    ${isActiveRoute(to) ? 'bg-[#232323] text-[#e9883e] font-semibold shadow-lg' : 'text-white'}
                    hover:bg-[#232323] hover:text-[#a78bfa] hover:shadow-xl
                  `}
                >
                  <Icon
                    className={`
                      w-5 h-5 transition-transform duration-300
                      group-hover:animate-spin
                    `}
                  />
                  <span
                    className={`
                      relative
                      after:content-['']
                      after:block
                      after:absolute
                      after:left-0
                      after:-bottom-1
                      after:w-0
                      after:h-0.5
                      after:bg-gradient-to-r after:from-blue-500 after:to-purple-500
                      after:transition-all
                      after:duration-300
                      group-hover:after:w-full
                      group-hover:after:h-0.5
                    `}
                  >
                    {label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-white hover:text-[#e9883e] transition-colors"
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
                {/* Solid Backdrop */}
                <div 
                  className="absolute inset-0 bg-black/80"
                  onClick={() => setMobileOpen(false)}
                />
                {/* Sidebar */}
                <div className="absolute top-0 left-0 h-full w-72 max-w-[80vw] bg-black text-white shadow-2xl flex flex-col">
                  {/* Sidebar Header */}
                  <div className="p-6 border-b border-[#232323] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Star className="w-6 h-6 text-[#e9883e]" />
                      <h1
                        className="text-xl font-bold text-white font-serif"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Legacy
                      </h1>
                    </div>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="text-white hover:text-[#e9883e] transition-colors p-1"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  {/* User Profile */}
                  <div className="p-4 border-b border-[#232323]">
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
                  {/* Search Bar */}
                  <div className="p-4 border-b border-[#232323]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#b8a99d]" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-[#232323] border border-[#232323] rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-[#b8a99d] focus:outline-none focus:border-[#a78bfa] focus:ring-0 text-sm"
                      />
                    </div>
                  </div>
                  {/* Navigation & Sign Out */}
                  <nav className="px-4 py-4 flex-1 overflow-y-auto flex flex-col justify-between">
                    <div className="space-y-1">
                      {navigationItems.map(({ to, label, icon: Icon }, idx) => (
                        <button
                          key={to}
                          onClick={() => {
                            setSpinningIdx(idx);
                            setTimeout(() => setSpinningIdx(null), 600);
                            setMobileOpen(false);
                            navigate(to);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors
                            ${isActiveRoute(to)
                              ? 'bg-[#232323] text-[#a78bfa]'
                              : 'hover:bg-[#232323] text-white'}
                            group
                          `}
                        >
                          <Icon
                            className={`
                              w-5 h-5 transition-transform duration-300
                              ${spinningIdx === idx ? 'animate-spin' : ''}
                              group-hover:animate-spin
                            `}
                          />
                          <span
                            className={`
                              relative
                              after:content-['']
                              after:block
                              after:absolute
                              after:left-0
                              after:-bottom-1
                              after:w-0
                              after:h-0.5
                              after:bg-gradient-to-r after:from-blue-500 after:to-purple-500
                              after:transition-all
                              after:duration-300
                              group-hover:after:w-full
                              group-hover:after:h-0.5
                            `}
                          >
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                    {/* Sign Out Button - only on mobile sidebar */}
                    <div className="mt-8 border-t border-[#232323] pt-4">
                      <button
                        onClick={async () => {
                          try {
                            await logout();
                            setMobileOpen(false);
                            navigate('/');
                          } catch (e) {
                            // Optionally handle error
                          }
                        }}
                        className="
                          w-full flex items-center gap-2 px-3 py-2 rounded-lg
                          text-red-400 hover:text-white hover:bg-red-500
                          transition-all font-semibold
                        "
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </nav>
                </div>
              </div>
            )}
          </>
        ) : (
          <nav className="flex items-center gap-6">
            <Link to="/login" className="text-white hover:text-[#e9883e] transition-colors">
              Login
            </Link>
            <Link 
              to="/signup" 
              className="
                bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500
                text-white px-5 py-2 rounded-lg font-semibold shadow-lg
                hover:from-purple-500 hover:to-blue-500 hover:shadow-xl
                transition-all duration-200
              "
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
