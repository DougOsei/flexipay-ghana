import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
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
  ExternalLink
} from 'lucide-react';

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
    if (!name) return 'GH';
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  };

  // Role color helpers
  const roleColor = {
    customer: { bg: 'bg-red-600', ring: 'ring-red-300', badge: 'bg-red-100 text-red-900 border-red-200', dot: 'bg-red-500', activeBg: 'bg-red-50 text-red-800 border border-red-200/80 shadow-sm', icon: 'text-red-600' },
    vendor:   { bg: 'bg-red-700', ring: 'ring-red-300', badge: 'bg-red-100 text-red-900 border-red-200', dot: 'bg-red-600', activeBg: 'bg-red-50 text-red-900 border border-red-200/80 shadow-sm', icon: 'text-red-700' },
    admin:    { bg: 'bg-red-900', ring: 'ring-red-300', badge: 'bg-red-100 text-red-900 border-red-200', dot: 'bg-red-800', activeBg: 'bg-red-50 text-red-900 border border-red-200/80 shadow-sm', icon: 'text-red-800' },
    guest:    { bg: 'bg-slate-600', ring: 'ring-slate-300', badge: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400', activeBg: 'bg-slate-100 text-slate-800 border border-slate-200/80 shadow-sm', icon: 'text-slate-500' },
  };
  const rc = roleColor[role] || roleColor.guest;

  const getNavItems = () => {
    switch (role) {
      case 'customer':
        return [
          { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
          { id: 'customer', label: 'My Small-Small Hub', icon: CreditCard, badge: customerActiveContractsCount > 0 ? `${customerActiveContractsCount} Active` : null },
          { id: 'how-it-works', label: 'How It Works', icon: HelpCircle },
        ];
      case 'vendor':
        return [
          { id: 'vendor', label: 'Vendor Central', icon: Store, badge: vendorPendingApplicationsCount > 0 ? `${vendorPendingApplicationsCount} Pending` : null },
          { id: 'marketplace', label: 'Browse Catalog', icon: ShoppingBag },
          { id: 'how-it-works', label: 'Merchant Guidelines', icon: HelpCircle },
        ];
      case 'admin':
        return [
          { id: 'admin', label: 'Admin HQ', icon: ShieldCheck, badge: 'Platform Ops' },
          { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
          { id: 'how-it-works', label: 'Rules & Act', icon: HelpCircle },
        ];
      default:
        return [
          { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
          { id: 'how-it-works', label: 'How It Works', icon: HelpCircle },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-40 bg-white/97 backdrop-blur-md border-b border-red-100 shadow-sm transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('marketplace')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-red-700 via-red-600 to-red-400 flex items-center justify-center text-white shadow-md shadow-red-700/30 group-hover:scale-105 transition">
              <span className="text-xl font-black tracking-tight">FP</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                  FlexiPay<span className="text-red-600">GH</span>
                </span>
                <span className="text-xs bg-red-100 text-red-900 border border-red-200 font-bold px-1.5 py-0.5 rounded-full">
                  🇬🇭 Ghana
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide hidden sm:block">
                Buy Now, Pay Small-Small • Multi-Vendor
              </p>
            </div>
          </div>

          {/* Desktop Nav - Role filtered */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition relative group ${
                    isActive ? rc.activeBg : 'text-slate-600 hover:text-slate-900 hover:bg-red-50/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? rc.icon : 'text-slate-400 group-hover:text-red-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm bg-red-100 text-red-900 border-red-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Bar */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Bell — logged in only */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-red-700 hover:bg-red-50 transition"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-red-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-3 border-b border-red-50">
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-red-500" />
                        Notifications &amp; MoMo Alerts
                      </h4>
                      <span className="text-xs bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded-full">
                        {notifications.length} alerts
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-red-50 mt-2">
                      {notifications.length === 0 ? (
                        <p className="py-6 text-center text-xs text-slate-400">No new alerts.</p>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`py-2.5 px-2 rounded-lg cursor-pointer transition ${!n.read ? 'bg-red-50/70 hover:bg-red-100/60' : 'opacity-70 hover:opacity-100 hover:bg-white'}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-xs text-slate-900">{n.title}</span>
                              {!n.read && <span className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0"></span>}
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile OR Sign In */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-red-50 border border-red-100 transition"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-sm ${rc.bg}`}>
                    {getInitials(user.name)}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 leading-tight max-w-[130px] truncate">{user.name}</p>
                    <p className="text-[11px] font-medium capitalize flex items-center gap-1 text-slate-500">
                      <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`}></span>
                      {role === 'customer' ? 'Buyer' : role === 'vendor' ? 'Vendor' : 'Administrator'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-red-100 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 divide-y divide-red-50">

                    {/* Header */}
                    <div className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0 ${rc.bg}`}>
                          {getInitials(user.name)}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-sm text-slate-900 truncate">{user.name}</h4>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 border ${rc.badge}`}>
                            <CheckCircle2 className="w-3 h-3 text-red-600" />
                            {role === 'customer' && 'Ghana Card NIA Verified'}
                            {role === 'vendor' && 'GRA Registered Merchant'}
                            {role === 'admin' && 'Platform Super Administrator'}
                          </span>
                        </div>
                      </div>

                      {role === 'customer' && (
                        <div className="mt-2.5 bg-red-50 p-2.5 rounded-xl border border-red-100 text-[11px] space-y-1">
                          <div className="flex justify-between text-slate-600">
                            <span>Ghana Card:</span>
                            <span className="font-mono font-bold text-slate-800">{user.ghanaCard || 'GHA-721839201-4'}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>GPS Address:</span>
                            <span className="font-mono text-slate-800">{user.digitalAddress || 'GA-183-9022'}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>HP Limit:</span>
                            <span className="font-bold text-red-700">GH₵ {user.hirePurchaseLimitGHS?.toLocaleString() || '25,000'}</span>
                          </div>
                        </div>
                      )}

                      {role === 'vendor' && (
                        <div className="mt-2.5 bg-red-50 p-2.5 rounded-xl border border-red-100 text-[11px] space-y-1">
                          <div className="flex justify-between text-slate-600">
                            <span>Store:</span>
                            <span className="font-bold text-red-900">{user.storeName || 'Franko Trading Hub'}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>MoMo Wallet:</span>
                            <span className="font-mono font-bold text-slate-800">{user.phone || '0244000111'}</span>
                          </div>
                        </div>
                      )}

                      {role === 'admin' && (
                        <div className="mt-2.5 bg-red-50 p-2.5 rounded-xl border border-red-100 text-[11px] space-y-1">
                          <div className="flex justify-between text-slate-600">
                            <span>Access Level:</span>
                            <span className="font-bold text-red-900">Tier 1 Full Oversight</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Escrow:</span>
                            <span className="text-slate-800">Bank of Ghana Regulated</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick links */}
                    <div className="py-2 space-y-1">
                      {role === 'customer' && (
                        <button onClick={() => { setActiveTab('customer'); setUserDropdownOpen(false); }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition">
                          <span className="flex items-center gap-2"><CreditCard className="w-3.5 h-3.5 text-red-600" />My Small-Small Hub</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </button>
                      )}
                      {role === 'vendor' && (
                        <button onClick={() => { setActiveTab('vendor'); setUserDropdownOpen(false); }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition">
                          <span className="flex items-center gap-2"><Store className="w-3.5 h-3.5 text-red-600" />Vendor Central Dashboard</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </button>
                      )}
                      {role === 'admin' && (
                        <button onClick={() => { setActiveTab('admin'); setUserDropdownOpen(false); }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition">
                          <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-red-700" />Admin HQ</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </button>
                      )}
                      <button onClick={() => { setActiveTab('marketplace'); setUserDropdownOpen(false); }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-slate-900 rounded-lg transition">
                        <span className="flex items-center gap-2"><ShoppingBag className="w-3.5 h-3.5 text-slate-500" />Browse Marketplace</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>

                    {/* Persona switcher */}
                    <div className="py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-2">Switch Persona:</p>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { label: 'Buyer', r: 'customer', email: 'kwesi@gmail.com' },
                          { label: 'Vendor', r: 'vendor', email: 'franko@frankotrading.com' },
                          { label: 'Admin', r: 'admin', email: 'admin@flexipaygh.com' },
                        ].map(p => (
                          <button key={p.r}
                            onClick={() => { switchRole(p.r, p.email); setUserDropdownOpen(false); }}
                            className={`px-2 py-1 rounded text-[11px] font-medium text-center transition ${role === p.r ? 'bg-red-600 text-white font-bold' : 'bg-red-50 text-red-800 hover:bg-red-100'}`}>
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sign Out */}
                    <div className="pt-2">
                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); setActiveTab('marketplace'); }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out (Browse as Guest)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest */
              <div className="flex items-center gap-2" ref={signInRef}>
                <div className="relative">
                  <button
                    onClick={() => setSignInDropdownOpen(!signInDropdownOpen)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm transition"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {signInDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-red-100 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="pb-2 border-b border-red-50">
                        <p className="text-xs font-bold text-slate-900">Select Demo Persona to Sign In</p>
                        <p className="text-[11px] text-slate-500">Test the platform as buyer, merchant or admin</p>
                      </div>
                      <div className="mt-2 space-y-1">
                        {[
                          { initials: 'KM', name: 'Kwesi Mensah', sub: 'Customer • Verified Buyer', r: 'customer', email: 'kwesi@gmail.com', tab: 'customer' },
                          { initials: 'FT', name: 'Franko Trading Hub', sub: 'Vendor • Circle Accra', r: 'vendor', email: 'franko@frankotrading.com', tab: 'vendor' },
                          { initials: 'AD', name: 'Super Administrator', sub: 'Admin Oversight', r: 'admin', email: 'admin@flexipaygh.com', tab: 'admin' },
                        ].map(p => (
                          <button key={p.r}
                            onClick={() => { switchRole(p.r, p.email); setSignInDropdownOpen(false); setActiveTab(p.tab); }}
                            className="w-full text-left p-2 rounded-xl hover:bg-red-50 transition flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">{p.initials}</div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{p.name}</p>
                              <p className="text-[11px] text-slate-500">{p.sub}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => { switchRole('vendor', 'franko@frankotrading.com'); setActiveTab('vendor'); }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 transition"
                >
                  <Store className="w-3.5 h-3.5 text-red-600" />
                  <span>Open Store</span>
                </button>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-red-700 hover:bg-red-50 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-red-100 py-3 space-y-2 animate-in fade-in">
            {user ? (
              <div className="p-3 bg-red-50 rounded-xl border border-red-100 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white ${rc.bg}`}>
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{role} Account</p>
                  </div>
                </div>
                <button onClick={() => { logout(); setMobileMenuOpen(false); setActiveTab('marketplace'); }}
                  className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1">
                  <LogOut className="w-3 h-3" />Sign Out
                </button>
              </div>
            ) : (
              <div className="p-3 bg-red-50 rounded-xl border border-red-100 mb-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-red-900">Browsing as Guest</p>
                  <p className="text-[10px] text-red-700">Sign in to buy on installment</p>
                </div>
                <button onClick={() => { switchRole('customer', 'kwesi@gmail.com'); setMobileMenuOpen(false); setActiveTab('customer'); }}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold shadow-sm">
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive ? 'bg-red-600 text-white font-bold' : 'text-slate-700 hover:bg-red-50 hover:text-red-800'
                    }`}>
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 border border-white/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-red-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">Switch Role:</p>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Buyer', r: 'customer', email: 'kwesi@gmail.com' },
                  { label: 'Vendor', r: 'vendor', email: 'franko@frankotrading.com' },
                  { label: 'Admin', r: 'admin', email: 'admin@flexipaygh.com' },
                ].map(p => (
                  <button key={p.r}
                    onClick={() => { switchRole(p.r, p.email); setMobileMenuOpen(false); }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center ${role === p.r ? 'bg-red-600 text-white' : 'bg-red-50 text-red-800'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
