import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAppUrl } from '../utils/apiBootstrap';
import { 
  Home,
  ShoppingBag, 
  Store, 
  ShieldCheck, 
  HelpCircle, 
  Bell, 
  Menu, 
  X, 
  CreditCard, 
  CheckCircle2, 
  Search,
  LogOut,
  ChevronDown,
  User,
  ExternalLink,
  Smartphone,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ activeTab, setActiveTab, onNavigateCategory, onHeaderSearch }) {
  const { 
    user, 
    role, 
    notifications, 
    unreadCount, 
    markNotificationRead, 
    switchRole, 
    logout,
    customerActiveContractsCount
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'G';
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onHeaderSearch) {
      onHeaderSearch(searchTerm);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, action: () => setActiveTab('home') },
    { id: 'marketplace', label: 'Shop All', icon: ShoppingBag, action: () => onNavigateCategory ? onNavigateCategory('All') : setActiveTab('marketplace') },
    { id: 'phones', label: 'Phones & TVs', icon: Smartphone, action: () => onNavigateCategory && onNavigateCategory('Phones & Tablets') },
    { id: 'how-it-works', label: 'How It Works', icon: HelpCircle, action: () => setActiveTab('how-it-works') },
  ];

  return (
    <>
      {/* 1. Modern E-Commerce Announcement & Portal Utility Bar */}
      <div className="bg-slate-950 text-white text-[11px] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400 shrink-0" aria-hidden="true" />
            <span className="truncate">
              Same-Day Pickup in Accra &amp; Kumasi • Instant Ghana Card Approval • Pay Small-Small via MoMo
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-semibold">
            <a
              href={getAppUrl('vendor/')}
              className="flex items-center gap-1 text-red-300 hover:text-white transition"
            >
              <Store className="w-3 h-3" aria-hidden="true" />
              <span>Sell on FlexiPay</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70 hidden sm:inline" aria-hidden="true" />
            </a>
            <span className="text-slate-700">|</span>
            <a
              href={getAppUrl('admin/')}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition"
            >
              <span>Admin HQ</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70 hidden sm:inline" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Sticky Glassmorphic E-Commerce Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-4">

            {/* Brand Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
              role="button"
              aria-label="FlexiPay Ghana Storefront Home"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('home'); }}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-700 via-red-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-600/25">
                <span className="text-lg font-black tracking-tight">FP</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-red-600 transition-colors">
                    FlexiPay<span className="text-red-600">GH</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wide hidden sm:block">
                  Buy Now, Pay Small-Small
                </p>
              </div>
            </motion.div>

            {/* Primary E-Commerce Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary Storefront Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-red-700 bg-red-50/90'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-600' : 'text-slate-400'}`} aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Integrated Header Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search phones, TVs, fridges..."
                aria-label="Search store catalog"
                className="w-full pl-9 pr-14 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-red-400 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition cursor-pointer"
              >
                Find
              </button>
            </form>

            {/* Right Shopper Actions */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* My HP Plans / Orders Pill */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab('customer')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  activeTab === 'customer'
                    ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/30'
                    : 'bg-red-50/80 hover:bg-red-100 text-red-800 border-red-200/80'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">My HP Plans</span>
                {role === 'customer' && customerActiveContractsCount > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    activeTab === 'customer' ? 'bg-white text-red-700' : 'bg-red-600 text-white'
                  }`}>
                    {customerActiveContractsCount}
                  </span>
                )}
              </motion.button>

              {/* Notifications Bell */}
              {role === 'customer' && (
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    aria-label="Account notifications"
                    className="relative p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notifDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                      >
                        <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">Account Alerts</span>
                          <span className="text-[11px] font-semibold text-red-600">{unreadCount} unread</span>
                        </div>
                        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                          {notifications.length === 0 ? (
                            <p className="p-4 text-center text-xs text-slate-400">No alerts yet.</p>
                          ) : (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                onClick={() => markNotificationRead(n.id)}
                                className={`p-3 text-xs cursor-pointer hover:bg-slate-50 ${!n.read ? 'bg-red-50/40' : ''}`}
                              >
                                <p className="font-bold text-slate-900">{n.title}</p>
                                <p className="text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Shopper Account Dropdown */}
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="Shopper Account Menu"
                  className="flex items-center gap-2 p-1 pr-2 rounded-xl border border-slate-200 hover:border-red-300 bg-white transition cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center">
                    {user ? getInitials(user.name) : <User className="w-3.5 h-3.5" />}
                  </div>
                  <span className="hidden xl:block text-xs font-bold text-slate-800 max-w-24 truncate">
                    {user ? user.name.split(' ')[0] : 'Sign In'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 mt-2 w-68 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                    >
                      {user ? (
                        <>
                          <div className="p-4 bg-slate-50 border-b border-slate-100">
                            <p className="font-extrabold text-sm text-slate-900">{user.name}</p>
                            <p className="text-[11px] text-slate-500">{user.email}</p>
                            {user.ghanaCard && (
                              <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" /> Ghana Card Verified
                              </span>
                            )}
                          </div>
                          <div className="p-2 space-y-1 text-xs">
                            <button
                              onClick={() => { setActiveTab('customer'); setUserDropdownOpen(false); }}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 font-bold text-slate-700 hover:text-red-700 flex items-center gap-2 cursor-pointer"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>My Hire-Purchase Plans</span>
                            </button>
                            <button
                              onClick={() => { logout(); setUserDropdownOpen(false); }}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 font-bold text-red-600 flex items-center gap-2 cursor-pointer"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="p-3 space-y-2 text-xs">
                          <p className="font-bold text-slate-800 px-1">Sign In as Shopper</p>
                          <button
                            onClick={() => { switchRole('customer', 'kwesi@gmail.com'); setUserDropdownOpen(false); }}
                            className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <User className="w-3.5 h-3.5" />
                            <span>Continue as Kwesi Mensah</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-slate-100 bg-white overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search store..."
                    className="w-full pl-9 pr-14 py-2 rounded-xl bg-slate-100 text-xs focus:outline-none"
                  />
                  <button type="submit" className="absolute right-1 top-1 bottom-1 px-3 rounded-lg bg-red-600 text-white text-xs font-bold">
                    Go
                  </button>
                </form>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { item.action(); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                          activeTab === item.id ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
