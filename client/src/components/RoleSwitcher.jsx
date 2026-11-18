import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Store, Shield, LogOut, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RoleSwitcher() {
  const { user, role, switchRole, logout } = useAuth();

  const personas = [
    { id: 'customer', email: 'kwesi@gmail.com', label: 'Customer (Buyer)', icon: User, title: 'Switch to Customer (Kwesi Mensah)' },
    { id: 'vendor', email: 'franko@frankotrading.com', label: 'Vendor (Franko)', icon: Store, title: 'Switch to Vendor: Franko Trading Hub' },
    { id: 'vendor_kabfam', roleName: 'vendor', email: 'kabfam@kabfam.com', label: 'Vendor (Kab-Fam)', icon: Store, title: 'Switch to Vendor: Kab-Fam Cool & Care' },
    { id: 'admin', email: 'admin@flexipaygh.com', label: 'Admin HQ', icon: Shield, title: 'Switch to Super Admin' },
  ];

  return (
    <div className="bg-red-950 text-white text-xs border-b border-red-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-inner">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-bold text-red-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          🇬🇭 Ghana Live Demo Mode
        </span>
        <span className="text-red-700 hidden sm:inline">•</span>
        <span className="text-red-200/90 hidden md:inline text-[11px]">
          Active: <strong className="text-white capitalize">{role}</strong> {user ? `(${user.name})` : '(Guest / Logged Out)'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        <span className="text-red-300 mr-1 text-[11px] font-semibold hidden sm:inline">Switch Persona:</span>

        {personas.map((p) => {
          const Icon = p.icon;
          const isActive = (p.id === 'vendor_kabfam' 
            ? role === 'vendor' && user?.email === p.email
            : p.id === 'vendor' 
              ? role === 'vendor' && user?.email === p.email
              : role === p.id);

          return (
            <motion.button
              key={p.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => switchRole(p.roleName || p.id, p.email)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition shadow-sm ${
                isActive
                  ? 'bg-white text-red-700 shadow-md ring-2 ring-white/50'
                  : 'bg-red-900/80 text-red-200 hover:bg-red-800/90 hover:text-white border border-red-800'
              }`}
              title={p.title}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{p.label}</span>
            </motion.button>
          );
        })}

        {/* Guest Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={logout}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
            role === 'guest'
              ? 'bg-red-800 text-white font-bold border border-red-500 shadow-sm'
              : 'bg-red-900/60 text-red-300 hover:bg-red-800 hover:text-white'
          }`}
          title="Browse as Guest (Signed Out)"
        >
          <LogOut className="w-3 h-3" />
          <span>Guest</span>
        </motion.button>
      </div>
    </div>
  );
}
