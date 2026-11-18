import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleSwitcher from './components/RoleSwitcher';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import CustomerPortal from './pages/CustomerPortal';
import VendorPortal from './pages/VendorPortal';
import AdminPortal from './pages/AdminPortal';
import HowItWorks from './pages/HowItWorks';
import ApplicationModal from './components/ApplicationModal';
import MoMoPaymentModal from './components/MoMoPaymentModal';
import ContractReceiptModal from './components/ContractReceiptModal';
import { ShieldCheck, Heart, Sparkles, AlertCircle, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function UnauthorizedNotice({ requiredRole, onSwitch, onGoMarketplace }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="max-w-xl mx-auto my-12 bg-white rounded-3xl border border-red-100 p-8 shadow-md text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 mx-auto flex items-center justify-center mb-4 shadow-2xs">
        <Lock className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">
        {requiredRole} Access Restricted
      </h3>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        This portal is reserved for registered <span className="font-semibold text-slate-900">{requiredRole}</span> accounts under Ghana Hire Purchase regulations. Switch your account or return to the marketplace to continue.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSwitch}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-sm shadow-red-600/30"
        >
          <span>Switch to {requiredRole} Account</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onGoMarketplace}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition"
        >
          Browse Marketplace
        </motion.button>
      </div>
    </motion.div>
  );
}

function MainAppContent() {
  const { role, toastMessage, switchRole } = useAuth();

  const [activeTab, setActiveTab] = useState('marketplace');
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Tab guard: sync activeTab whenever role changes
  useEffect(() => {
    if (role === 'customer' && (activeTab === 'vendor' || activeTab === 'admin')) {
      setActiveTab('customer');
    } else if (role === 'vendor' && (activeTab === 'customer' || activeTab === 'admin')) {
      setActiveTab('vendor');
    } else if (role === 'admin' && (activeTab === 'customer' || activeTab === 'vendor')) {
      setActiveTab('admin');
    } else if (role === 'guest' && (activeTab === 'customer' || activeTab === 'vendor' || activeTab === 'admin')) {
      setActiveTab('marketplace');
    }
  }, [role]);

  const [applicationModalData, setApplicationModalData] = useState(null);
  const [paymentModalData, setPaymentModalData] = useState(null);
  const [receiptModalContract, setReceiptModalContract] = useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProductId(product.id);
    setActiveTab('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyHP = (product, initialPlan = null) => {
    setApplicationModalData({ product, initialPlan });
  };

  const handlePayInstallment = (contract, installment) => {
    setPaymentModalData({ contract, installment });
  };

  const handleViewReceipt = (contract) => {
    setReceiptModalContract(contract);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 font-sans selection:bg-red-600 selection:text-white">
      
      {/* 1. Global Persona / Role Switcher Bar */}
      <RoleSwitcher />

      {/* 2. Global Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 3. Main View Router with Silk-Smooth Animated Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (activeTab === 'details' ? `-${selectedProductId}` : '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'marketplace' && (
              <Marketplace
                onSelectProduct={handleSelectProduct}
                onApplyHP={handleApplyHP}
              />
            )}

            {activeTab === 'details' && (
              <ProductDetails
                productId={selectedProductId}
                onBack={() => setActiveTab('marketplace')}
                onApplyHP={handleApplyHP}
              />
            )}

            {activeTab === 'customer' && (
              role === 'customer' ? (
                <CustomerPortal
                  onPayInstallment={handlePayInstallment}
                  onViewReceipt={handleViewReceipt}
                />
              ) : (
                <UnauthorizedNotice
                  requiredRole="Customer"
                  onSwitch={() => switchRole('customer', 'kwesi@gmail.com')}
                  onGoMarketplace={() => setActiveTab('marketplace')}
                />
              )
            )}

            {activeTab === 'vendor' && (
              role === 'vendor' ? (
                <VendorPortal
                  onViewReceipt={handleViewReceipt}
                />
              ) : (
                <UnauthorizedNotice
                  requiredRole="Vendor"
                  onSwitch={() => switchRole('vendor', 'franko@frankotrading.com')}
                  onGoMarketplace={() => setActiveTab('marketplace')}
                />
              )
            )}

            {activeTab === 'admin' && (
              role === 'admin' ? (
                <AdminPortal
                  onViewReceipt={handleViewReceipt}
                />
              ) : (
                <UnauthorizedNotice
                  requiredRole="Super Admin"
                  onSwitch={() => switchRole('admin', 'admin@flexipaygh.com')}
                  onGoMarketplace={() => setActiveTab('marketplace')}
                />
              )
            )}

            {activeTab === 'how-it-works' && (
              <HowItWorks
                onGoMarketplace={() => setActiveTab('marketplace')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Global Modals with Animated Backdrops */}
      <AnimatePresence>
        {applicationModalData && (
          <ApplicationModal
            product={applicationModalData.product}
            initialPlan={applicationModalData.initialPlan}
            onClose={() => setApplicationModalData(null)}
            onSuccess={(newContract) => {
              setActiveTab('customer');
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {paymentModalData && (
          <MoMoPaymentModal
            contract={paymentModalData.contract}
            installment={paymentModalData.installment}
            onClose={() => setPaymentModalData(null)}
            onSuccess={() => {}}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {receiptModalContract && (
          <ContractReceiptModal
            contract={receiptModalContract}
            onClose={() => setReceiptModalContract(null)}
          />
        )}
      </AnimatePresence>

      {/* 5. Floating Toast Notification with Spring Physics */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key={toastMessage.id || 'toast'}
            initial={{ opacity: 0, y: 25, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="fixed bottom-5 right-5 z-50 pointer-events-auto"
          >
            <div className={`p-4 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 max-w-sm text-white ${
              toastMessage.type === 'error' ? 'bg-red-600 border-red-500' :
              toastMessage.type === 'warning' ? 'bg-orange-600 border-orange-500' :
              'bg-slate-900 border-slate-700'
            }`}>
              <span className="text-base">🇬🇭</span>
              <span className="leading-snug">{toastMessage.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Footer */}
      <footer className="mt-auto bg-red-950 text-white border-t border-red-900 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center font-black text-red-700 shadow-sm">
                  FP
                </div>
                <span className="text-lg font-black tracking-tight">FlexiPay<span className="text-red-300">GH</span></span>
              </div>
              <p className="text-xs text-red-200/90 leading-relaxed">
                Ghana's trusted multi-vendor hire purchase platform. Buy laptops, phones, home appliances, and mobility equipment with verified national ID and flexible Mobile Money repayments.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-300 mb-3">Popular Hubs</h4>
              <ul className="space-y-2 text-xs text-red-200/80">
                <li>Phones &amp; Tablets (Circle, Accra)</li>
                <li>Home Appliances (Spintex Road)</li>
                <li>Computing &amp; Solar (Adum, Kumasi)</li>
                <li>Cargo Motorbikes &amp; Tricycles (Abossey Okai)</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-300 mb-3">Compliance &amp; Laws</h4>
              <ul className="space-y-2 text-xs text-red-200/80">
                <li>Hire Purchase Act of Ghana (1974)</li>
                <li>Ghana Card / NIA Verification</li>
                <li>Data Protection Act 2012</li>
                <li>GRA e-VAT Tax Compliance</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-300 mb-3">Accepted Payment Rails</h4>
              <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
                <span className="bg-yellow-400 text-slate-900 py-1.5 px-2 rounded-lg shadow-2xs">MTN MoMo *170#</span>
                <span className="bg-white text-red-700 py-1.5 px-2 rounded-lg shadow-2xs">Telecel Cash *110#</span>
                <span className="bg-blue-600 text-white py-1.5 px-2 rounded-lg shadow-2xs">AT Money *110#</span>
                <span className="bg-red-700 text-white py-1.5 px-2 rounded-lg border border-red-600 shadow-2xs">GhQR / Bank Card</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-red-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-red-300">
            <p>© {new Date().getFullYear()} FlexiPay Ghana Ltd. All rights reserved.</p>
            <p className="flex items-center gap-1 text-red-200">
              Built for Ghana with <Heart className="w-3.5 h-3.5 text-red-400 fill-current inline" /> in Accra &amp; Kumasi
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
