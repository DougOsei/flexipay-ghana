import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import AdminPortal from '../pages/AdminPortal';
import ContractReceiptModal from '../components/ContractReceiptModal';
import { getAppUrl } from '../utils/apiBootstrap';
import {
  ShieldCheck,
  Store,
  FileText,
  ExternalLink,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  Activity,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AdminDashboardShell() {
  const { user, toastMessage } = useAuth();
  const [adminSection, setAdminSection] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [receiptModalContract, setReceiptModalContract] = useState(null);

  const navItems = [
    { id: 'all', label: 'Executive Overview', icon: LayoutGrid },
    { id: 'vendors', label: 'Vendor Governance', icon: Store },
    { id: 'contracts', label: 'HP Contracts Ledger', icon: FileText },
  ];

  const handleNavClick = (id) => {
    setAdminSection(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900 selection:bg-red-600 selection:text-white">
      
      {/* Desktop Executive Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-68 bg-slate-950 text-white shrink-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center font-black text-lg shadow-lg shadow-red-600/30">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-black text-base tracking-tight block">
              FlexiPay<span className="text-red-400">HQ</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-red-400">
              Platform Oversight
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5" aria-label="Admin Operations Navigation">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Risk &amp; Governance
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = adminSection === item.id;
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
        </nav>

        {/* Cross-App Links */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <a
            href={getAppUrl('')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 transition border border-slate-800"
          >
            <span>Customer Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
          <a
            href={getAppUrl('vendor/')}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <span>Vendor Seller Center</span>
            <Store className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>

      {/* Mobile Sidebar */}
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
              className="relative w-68 bg-slate-950 text-white h-full flex flex-col z-10 shadow-2xl"
            >
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <span className="font-black text-sm">FlexiPay Admin HQ</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close menu"
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
                        adminSection === item.id ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-slate-800">
                <a href={getAppUrl('')} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 text-xs font-bold text-slate-200">
                  <span>Back to Storefront</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin menu"
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-600 hidden sm:block" />
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                Central Regulatory &amp; Operations Console
              </h2>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">
                Act 349 Compliant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 pr-3 border-r border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                HQ
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Admin HQ'}</p>
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

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <AdminPortal
            activeSection={adminSection}
            onViewReceipt={(contract) => setReceiptModalContract(contract)}
          />
        </main>
      </div>

      <AnimatePresence>
        {receiptModalContract && (
          <ContractReceiptModal
            contract={receiptModalContract}
            onClose={() => setReceiptModalContract(null)}
          />
        )}
      </AnimatePresence>

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

export default function AdminApp() {
  return (
    <AuthProvider initialRole="admin">
      <AdminDashboardShell />
    </AuthProvider>
  );
}
