import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import VendorPortal from '../pages/VendorPortal';
import ContractReceiptModal from '../components/ContractReceiptModal';
import { getAppUrl } from '../utils/apiBootstrap';
import {
  Store,
  Users,
  CreditCard,
  Package,
  ExternalLink,
  ShieldCheck,
  Bell,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function VendorDashboardShell() {
  const {
    user,
    notifications,
    unreadCount,
    markNotificationRead,
    switchRole,
    toastMessage
  } = useAuth();

  const [vendorTab, setVendorTab] = useState('applications');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [receiptModalContract, setReceiptModalContract] = useState(null);

  const navItems = [
    { id: 'applications', label: 'HP Applications', icon: Users },
    { id: 'installments', label: 'Repayments & Payouts', icon: CreditCard },
    { id: 'products', label: 'Inventory & Catalog', icon: Package },
  ];

  const handleNavClick = (id) => {
    setVendorTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900 selection:bg-red-600 selection:text-white">
      
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-68 bg-slate-950 text-white shrink-0 border-r border-slate-800">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center font-black text-lg shadow-lg shadow-red-600/30">
            FP
          </div>
          <div>
            <span className="font-black text-base tracking-tight block">
              FlexiPay<span className="text-red-400">GH</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-red-400">
              Seller Central
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5" aria-label="Vendor Dashboard Navigation">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Store Operations
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = vendorTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  active
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-6 mt-6 border-t border-slate-800/80 space-y-1.5">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Quick Switch Account
            </p>
            <button
              onClick={() => switchRole('vendor', 'franko@frankotrading.com')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                user?.email === 'franko@frankotrading.com'
                  ? 'bg-white/10 text-white border border-white/15'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span className="truncate">Franko Trading Hub</span>
              <Store className="w-3.5 h-3.5 text-red-400 shrink-0" />
            </button>
            <button
              onClick={() => switchRole('vendor', 'kabfam@kabfam.com')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                user?.email === 'kabfam@kabfam.com'
                  ? 'bg-white/10 text-white border border-white/15'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span className="truncate">Kab-Fam Cool &amp; Care</span>
              <Store className="w-3.5 h-3.5 text-red-400 shrink-0" />
            </button>
          </div>
        </nav>

        {/* Bottom Portal Links */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <a
            href={getAppUrl('')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 transition border border-slate-800"
          >
            <span>Customer Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
          <a
            href={getAppUrl('admin/')}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <span>Admin Operations HQ</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden flex"
          >
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="relative w-68 bg-slate-950 text-white h-full flex flex-col z-10 shadow-2xl"
            >
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-black text-white">FP</div>
                  <div>
                    <span className="font-black text-sm block">FlexiPay Seller</span>
                    <span className="text-[10px] text-red-400 font-bold uppercase">Merchant Portal</span>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        vendorTab === item.id ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-slate-800 space-y-2">
                <a href={getAppUrl('')} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 text-xs font-bold text-slate-200">
                  <span>Back to Storefront</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Command Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open seller menu"
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-red-600 hidden sm:block" />
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                Merchant Seller Center
              </h2>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Escrow Live
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                aria-label="Seller notifications"
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 transition cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Store Alerts</span>
                    <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs">Close</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-slate-400">No store alerts yet.</p>
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
                </div>
              )}
            </div>

            {/* Active Merchant Account Pill */}
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Merchant Partner'}</p>
                <p className="text-[10px] text-slate-500 font-medium">{user?.email}</p>
              </div>
            </div>

            <a
              href={getAppUrl('')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <span className="hidden sm:inline">Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <VendorPortal
            externalTab={vendorTab}
            onTabChange={setVendorTab}
            onViewReceipt={(contract) => setReceiptModalContract(contract)}
          />
        </main>
      </div>

      {/* Receipt Modal */}
      <AnimatePresence>
        {receiptModalContract && (
          <ContractReceiptModal
            contract={receiptModalContract}
            onClose={() => setReceiptModalContract(null)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key={toastMessage.id || 'toast'}
            initial={{ opacity: 0, y: 25, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.94 }}
            className="fixed bottom-5 right-5 z-50"
          >
            <div className={`p-4 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 max-w-sm text-white ${
              toastMessage.type === 'error' ? 'bg-red-600 border-red-500' :
              toastMessage.type === 'warning' ? 'bg-orange-600 border-orange-500' :
              'bg-slate-900 border-slate-700'
            }`}>
              {toastMessage.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-white shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <span>{toastMessage.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VendorApp() {
  return (
    <AuthProvider initialRole="vendor">
      <VendorDashboardShell />
    </AuthProvider>
  );
}
