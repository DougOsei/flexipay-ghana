import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Store, Shield, LogOut, CheckCircle2, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RoleSwitcher() {
  const { user, role, switchRole, logout } = useAuth();

  const personas = [
    { id: 'customer', email: 'kwesi@gmail.com', label: 'Buyer (Kwesi)', icon: User, title: 'Switch to Customer: Kwesi Mensah' },
    { id: 'vendor', email: 'franko@frankotrading.com', label: 'Vendor (Franko)', icon: Store, title: 'Switch to Vendor: Franko Trading Hub' },
    { id: 'vendor_kabfam', roleName: 'vendor', email: 'kabfam@kabfam.com', label: 'Vendor (Kab-Fam)', icon: Store, title: 'Switch to Vendor: Kab-Fam Cool & Care' },
    { id: 'admin', email: 'admin@flexipaygh.com', label: 'Admin HQ', icon: Shield, title: 'Switch to Platform Super Admin' },
  ];

  return (
    <nav aria-label="Demo Persona Switcher" className="bg-red-950 text-white text-xs border-b border-red-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-inner select-none">
      <div className="flex items-center gap-2.5">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-900/90 border border-red-700/60 text-[11px] font-bold text-red-100">
          <Activity className="w-3.5 h-3.5 text-red-300 animate-pulse" aria-hidden="true" />
          <span>Ghana Live Sandbox</span>
        </div>
        <span className="text-red-700 hidden sm:inline" aria-hidden="true">•</span>
        <span className="text-red-200/90 hidden md:inline text-[11px]">
          Current Persona: <strong className="text-white capitalize">{role}</strong> {user ? `(${user.name})` : '(Guest / Logged Out)'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        <span className="text-red-300 mr-1 text-[11px] font-semibold hidden sm:inline">Switch Role:</span>

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
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => switchRole(p.roleName || p.id, p.email)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-950 ${
                isActive
                  ? 'bg-white text-red-900 shadow-md ring-2 ring-white/60'
                  : 'bg-red-900/80 text-red-100 hover:bg-red-800 hover:text-white border border-red-800'
              }`}
              title={p.title}
              aria-label={p.title}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{p.label}</span>
            </motion.button>
          );
        })}

        {/* Guest Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={logout}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-950 ${
            role === 'guest'
              ? 'bg-red-800 text-white font-bold border border-red-500 shadow-sm'
              : 'bg-red-900/60 text-red-300 hover:bg-red-800 hover:text-white'
          }`}
          title="Browse as Guest (Signed Out)"
          aria-label="Browse as Guest"
        >
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Guest</span>
        </motion.button>
      </div>
    </nav>
  );
}
