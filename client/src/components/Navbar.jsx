import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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
  ArrowRight,
  Sparkles,
  LogOut,
  ChevronDown,
  User,
  PlusCircle,
  Shield,
  Smartphone,
  MapPin,
  ExternalLink,
  Building2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    user, 
    role, 
    notifications, 
    unreadCount, 
    markNotificationRead, 
    switchRole, 
    logout,
    customerActiveContractsCount,
    vendorPendingApplicationsCount
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [signInDropdownOpen, setSignInDropdownOpen] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);
  const signInRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (signInRef.current && !signInRef.current.contains(event.target)) {
        setSignInDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'FP';
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  };

  const roleColor = {
    customer: { bg: 'bg-red-600', badge: 'bg-red-50 text-red-900 border-red-200', dot: 'bg-red-600' },
    vendor:   { bg: 'bg-red-700', badge: 'bg-red-50 text-red-900 border-red-200', dot: 'bg-red-700' },
    admin:    { bg: 'bg-red-900', badge: 'bg-red-50 text-red-900 border-red-200', dot: 'bg-red-900' },
    guest:    { bg: 'bg-slate-600', badge: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-500' },
  };
  const rc = roleColor[role] || roleColor.guest;

  const getNavItems = () => {
    switch (role) {
      case 'customer':
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
          { id: 'customer', label: 'My Small-Small Hub', icon: CreditCard, badge: customerActiveContractsCount > 0 ? `${customerActiveContractsCount} Active` : null },
          { id: 'how-it-works', label: 'How It Works', icon: HelpCircle },
        ];
      case 'vendor':
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'vendor', label: 'Vendor Central', icon: Store, badge: vendorPendingApplicationsCount > 0 ? `${vendorPendingApplicationsCount} Pending` : null },
          { id: 'marketplace', label: 'Browse Catalog', icon: ShoppingBag },
          { id: 'how-it-works', label: 'Merchant Guidelines', icon: HelpCircle },
        ];
      case 'admin':
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'admin', label: 'Admin HQ', icon: ShieldCheck, badge: 'Platform Oversight' },
          { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
          { id: 'how-it-works', label: 'Regulations & Act', icon: HelpCircle },
        ];
      default:
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
          { id: 'how-it-works', label: 'How It Works', icon: HelpCircle },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-red-100 shadow-xs transition duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Brand Logo with Professional Typography */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            role="button"
            aria-label="FlexiPay Ghana Home"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('home'); }}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-700 via-red-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-600/30 group-hover:shadow-lg group-hover:shadow-red-600/40 transition-all duration-300">
              <span className="text-xl font-black tracking-tight">FP</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-red-700 transition-colors">
                  FlexiPay<span className="text-red-600">GH</span>
                </span>
                <span className="text-[10px] bg-red-50 text-red-900 border border-red-200/90 font-extrabold px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" aria-hidden="true"></span>
                  Ghana
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide hidden sm:block">
                Hire Purchase &amp; BNPL Marketplace
              </p>
            </div>
          </motion.div>

          {/* Desktop Nav with Layout Animation */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                    isActive ? 'text-red-700' : 'text-slate-600 hover:text-slate-900 hover:bg-red-50/60'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-red-50 border border-red-200 rounded-xl shadow-2xs -z-0"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 relative z-10 transition-colors ${isActive ? 'text-red-600' : 'text-slate-400 group-hover:text-red-500'}`} aria-hidden="true" />
                  <span className="relative z-10">{item.label}</span>
                  {item.badge && (
                    <span className="relative z-10 text-[10px] font-extrabold px-2 py-0.5 rounded-full border shadow-2xs bg-red-100 text-red-900 border-red-200">
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Right Bar */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Notification Bell with Badge */}
            {user && (
              <div className="relative" ref={notifRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2.5 rounded-xl text-slate-600 hover:text-red-700 hover:bg-red-50/80 border border-transparent hover:border-red-100 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                  aria-label={`Notifications, ${unreadCount} unread`}
                >
                  <Bell className="w-5 h-5" aria-hidden="true" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow ring-2 ring-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {notifDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-red-100 p-4 z-50 divide-y divide-red-50 origin-top-right"
                      role="region"
                      aria-label="Notification center"
                    >
                      <div className="flex items-center justify-between pb-3">
                        <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-red-600" aria-hidden="true" />
                          <span>Notifications &amp; MoMo Alerts</span>
                        </h4>
                        <span className="text-xs bg-red-50 text-red-900 font-bold px-2 py-0.5 rounded-full border border-red-100">
                          {notifications.length} alerts
                        </span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-red-50 mt-2 pt-1">
                        {notifications.length === 0 ? (
                          <p className="py-6 text-center text-xs text-slate-400">No new alerts.</p>
                        ) : (
                          notifications.map(n => (
                            <motion.div
                              key={n.id}
                              whileHover={{ x: 2 }}
                              onClick={() => markNotificationRead(n.id)}
                              className={`py-2.5 px-2.5 rounded-xl cursor-pointer transition ${!n.read ? 'bg-red-50/80 hover:bg-red-100/70' : 'opacity-75 hover:opacity-100 hover:bg-slate-50'}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-xs text-slate-900">{n.title}</span>
                                {!n.read && <span className="w-2 h-2 rounded-full bg-red-600 mt-1 shrink-0" aria-label="Unread"></span>}
                              </div>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Profile Dropdown OR Sign In */}
            {user ? (
              <div className="relative" ref={userRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-red-50/80 border border-red-100 transition shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User Account Menu"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-2xs ${rc.bg}`}>
                    {getInitials(user.name)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight max-w-[130px] truncate">{user.name}</p>
                    <p className="text-[11px] font-medium capitalize flex items-center gap-1 text-slate-500">
                      <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} aria-hidden="true"></span>
                      {role === 'customer' ? 'Buyer' : role === 'vendor' ? 'Vendor' : 'Administrator'}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 hidden sm:block transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </motion.button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-red-100 p-3.5 z-50 divide-y divide-red-50 origin-top-right"
                    >
                      {/* Header */}
                      <div className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0 shadow-2xs ${rc.bg}`}>
                            {getInitials(user.name)}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="font-extrabold text-sm text-slate-900 truncate">{user.name}</h4>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-1 border ${rc.badge}`}>
                              <CheckCircle2 className="w-3 h-3 text-red-600" aria-hidden="true" />
                              {role === 'customer' && 'Ghana Card Verified Buyer'}
                              {role === 'vendor' && 'GRA Registered Merchant'}
                              {role === 'admin' && 'Central Platform Administrator'}
                            </span>
                          </div>
                        </div>

                        {role === 'customer' && (
                          <div className="mt-2.5 bg-red-50/70 p-2.5 rounded-xl border border-red-100 text-[11px] space-y-1">
                            <div className="flex justify-between text-slate-600">
                              <span>Ghana Card:</span>
                              <span className="font-mono font-bold text-slate-800">{user.ghanaCard || 'GHA-721839201-4'}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>GPS Address:</span>
                              <span className="font-mono font-bold text-slate-800">{user.digitalAddress || 'GA-183-9022'}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>HP Credit Limit:</span>
                              <span className="font-extrabold text-red-700">GH₵ {user.hirePurchaseLimitGHS?.toLocaleString() || '25,000'}</span>
                            </div>
                          </div>
                        )}

                        {role === 'vendor' && (
                          <div className="mt-2.5 bg-red-50/70 p-2.5 rounded-xl border border-red-100 text-[11px] space-y-1">
                            <div className="flex justify-between text-slate-600">
                              <span>Store Hub:</span>
                              <span className="font-bold text-red-900">{user.storeName || 'Franko Trading Hub'}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>MoMo Wallet:</span>
                              <span className="font-mono font-bold text-slate-800">{user.phone || '0244000111'}</span>
                            </div>
                          </div>
                        )}

                        {role === 'admin' && (
                          <div className="mt-2.5 bg-red-50/70 p-2.5 rounded-xl border border-red-100 text-[11px] space-y-1">
                            <div className="flex justify-between text-slate-600">
                              <span>Access Level:</span>
                              <span className="font-bold text-red-900">Tier 1 Full Oversight</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>Settlement:</span>
                              <span className="font-semibold text-slate-800">Bank of Ghana Escrow</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick links */}
                      <div className="py-2 space-y-1">
                        {role === 'customer' && (
                          <button onClick={() => { setActiveTab('customer'); setUserDropdownOpen(false); }}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition cursor-pointer">
                            <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-red-600" aria-hidden="true" />My Small-Small Hub</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                          </button>
                        )}
                        {role === 'vendor' && (
                          <button onClick={() => { setActiveTab('vendor'); setUserDropdownOpen(false); }}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition cursor-pointer">
                            <span className="flex items-center gap-2"><Store className="w-4 h-4 text-red-600" aria-hidden="true" />Vendor Central Dashboard</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                          </button>
                        )}
                        {role === 'admin' && (
                          <button onClick={() => { setActiveTab('admin'); setUserDropdownOpen(false); }}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition cursor-pointer">
                            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-red-700" aria-hidden="true" />Admin HQ Oversight</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                          </button>
                        )}
                        <button onClick={() => { setActiveTab('marketplace'); setUserDropdownOpen(false); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-slate-900 rounded-xl transition cursor-pointer">
                          <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-slate-500" aria-hidden="true" />Browse Catalog</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        </button>
                      </div>

                      {/* Persona switcher in profile */}
                      <div className="py-2.5">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 px-2">Switch Account Role:</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { label: 'Buyer', r: 'customer', email: 'kwesi@gmail.com' },
                            { label: 'Vendor', r: 'vendor', email: 'franko@frankotrading.com' },
                            { label: 'Admin', r: 'admin', email: 'admin@flexipaygh.com' },
                          ].map(p => (
                            <button key={p.r}
                              onClick={() => { switchRole(p.r, p.email); setUserDropdownOpen(false); }}
                              className={`px-2 py-1.5 rounded-lg text-[11px] font-bold text-center transition cursor-pointer ${role === p.r ? 'bg-red-600 text-white shadow-2xs' : 'bg-red-50 text-red-900 hover:bg-red-100'}`}>
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sign Out */}
                      <div className="pt-2">
                        <button
                          onClick={() => { logout(); setUserDropdownOpen(false); setActiveTab('marketplace'); }}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" aria-hidden="true" />
                          <span>Sign Out (Browse as Guest)</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Guest Sign In */
              <div className="flex items-center gap-2" ref={signInRef}>
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSignInDropdownOpen(!signInDropdownOpen)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/30 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                    aria-expanded={signInDropdownOpen}
                    aria-haspopup="true"
                  >
                    <User className="w-4 h-4" aria-hidden="true" />
                    <span>Sign In</span>
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </motion.button>

                  <AnimatePresence>
                    {signInDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-red-100 p-3.5 z-50 origin-top-right"
                      >
                        <div className="pb-2.5 border-b border-red-50">
                          <p className="text-xs font-black text-slate-900">Select Demo Persona</p>
                          <p className="text-[11px] text-slate-500 font-medium">Test as buyer, merchant or admin</p>
                        </div>
                        <div className="mt-2 space-y-1">
                          {[
                            { initials: 'KM', name: 'Kwesi Mensah', sub: 'Customer • Verified Buyer', r: 'customer', email: 'kwesi@gmail.com', tab: 'customer' },
                            { initials: 'FT', name: 'Franko Trading Hub', sub: 'Vendor • Circle Accra', r: 'vendor', email: 'franko@frankotrading.com', tab: 'vendor' },
                            { initials: 'AD', name: 'Super Administrator', sub: 'Admin Oversight', r: 'admin', email: 'admin@flexipaygh.com', tab: 'admin' },
                          ].map(p => (
                            <button key={p.r}
                              onClick={() => { switchRole(p.r, p.email); setSignInDropdownOpen(false); setActiveTab(p.tab); }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-red-50 transition flex items-center gap-2.5 cursor-pointer">
                              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-black text-xs">{p.initials}</div>
                              <div>
                                <p className="text-xs font-bold text-slate-900">{p.name}</p>
                                <p className="text-[11px] text-slate-500 font-medium">{p.sub}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { switchRole('vendor', 'franko@frankotrading.com'); setActiveTab('vendor'); }}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-red-900 bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer"
                >
                  <Store className="w-4 h-4 text-red-600" aria-hidden="true" />
                  <span>Open Store</span>
                </motion.button>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-slate-600 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile drawer with AnimatePresence */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden border-t border-red-100 py-3 space-y-2"
            >
              {user ? (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white ${rc.bg}`}>
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold capitalize">{role} Account</p>
                    </div>
                  </div>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); setActiveTab('marketplace'); }}
                    className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer">
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />Sign Out
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100 mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-red-900">Browsing as Guest</p>
                    <p className="text-[10px] text-red-700 font-medium">Sign in to buy on installment</p>
                  </div>
                  <button onClick={() => { switchRole('customer', 'kwesi@gmail.com'); setMobileMenuOpen(false); setActiveTab('customer'); }}
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold shadow-xs cursor-pointer">
                    Sign In
                  </button>
                </div>
              )}

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button key={item.id}
                      onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                        isActive ? 'bg-red-600 text-white shadow-xs' : 'text-slate-700 hover:bg-red-50 hover:text-red-800'
                      }`}>
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/20 border border-white/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-red-100">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 px-1">Switch Role:</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Buyer', r: 'customer', email: 'kwesi@gmail.com' },
                    { label: 'Vendor', r: 'vendor', email: 'franko@frankotrading.com' },
                    { label: 'Admin', r: 'admin', email: 'admin@flexipaygh.com' },
                  ].map(p => (
                    <button key={p.r}
                      onClick={() => { switchRole(p.r, p.email); setMobileMenuOpen(false); }}
                      className={`py-2 px-2 rounded-lg text-xs font-bold text-center cursor-pointer ${role === p.r ? 'bg-red-600 text-white shadow-xs' : 'bg-red-50 text-red-900'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
