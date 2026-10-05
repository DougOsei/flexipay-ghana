import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Store, Shield, LogOut, CheckCircle2 } from 'lucide-react';

export default function RoleSwitcher() {
  const { user, role, switchRole, logout } = useAuth();

  return (
    <div className="bg-red-900 text-white text-xs border-b border-red-800 px-4 py-1.5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 font-semibold text-red-200">
          <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse"></span>
          🇬🇭 Ghana Live Demo Mode
        </span>
        <span className="text-red-600 hidden sm:inline">|</span>
        <span className="text-red-200 hidden md:inline">
          Active Role: <strong className="text-white capitalize">{role}</strong> {user ? `(${user.name})` : '(Guest / Logged Out)'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        <span className="text-red-300 mr-1 text-[11px] font-medium hidden sm:inline">Switch Persona:</span>

        {/* Customer Button */}
        <button
          onClick={() => switchRole('customer', 'kwesi@gmail.com')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded transition ${
            role === 'customer'
              ? 'bg-white text-red-700 font-semibold shadow-sm'
              : 'bg-red-800 text-red-200 hover:bg-red-700'
          }`}
          title="Switch to Customer (Kwesi Mensah)"
        >
          <User className="w-3.5 h-3.5" />
          <span>Customer (Buyer)</span>
        </button>

        {/* Franko Trading Vendor */}
        <button
          onClick={() => switchRole('vendor', 'franko@frankotrading.com')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded transition ${
            role === 'vendor' && user?.email === 'franko@frankotrading.com'
              ? 'bg-white text-red-700 font-semibold shadow-sm'
              : 'bg-red-800 text-red-200 hover:bg-red-700'
          }`}
          title="Switch to Vendor: Franko Trading Hub"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Vendor (Franko Hub)</span>
        </button>

        {/* Kab-Fam Electronics Vendor */}
        <button
          onClick={() => switchRole('vendor', 'kabfam@kabfam.com')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded transition ${
            role === 'vendor' && user?.email === 'kabfam@kabfam.com'
              ? 'bg-white text-red-700 font-semibold shadow-sm'
              : 'bg-red-800 text-red-200 hover:bg-red-700'
          }`}
          title="Switch to Vendor: Kab-Fam Cool & Care"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Vendor (Kab-Fam)</span>
        </button>

        {/* Super Admin */}
        <button
          onClick={() => switchRole('admin', 'admin@flexipaygh.com')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded transition ${
            role === 'admin'
              ? 'bg-white text-red-900 font-semibold shadow-sm'
              : 'bg-red-800 text-red-200 hover:bg-red-700'
          }`}
          title="Switch to Super Admin"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin Portal</span>
        </button>

        {/* Guest / Signed Out */}
        <button
          onClick={logout}
          className={`flex items-center gap-1 px-2 py-1 rounded transition ${
            role === 'guest'
              ? 'bg-red-700 text-white font-semibold border border-red-500'
              : 'bg-red-800/80 text-red-300 hover:bg-red-700 hover:text-white'
          }`}
          title="Browse as Guest (Signed Out)"
        >
          <LogOut className="w-3 h-3" />
          <span>Guest</span>
        </button>
      </div>
    </div>
  );
}
