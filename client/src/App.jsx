import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import CustomerPortal from './pages/CustomerPortal';
import HowItWorks from './pages/HowItWorks';
import ApplicationModal from './components/ApplicationModal';
import MoMoPaymentModal from './components/MoMoPaymentModal';
import ContractReceiptModal from './components/ContractReceiptModal';
import { getAppUrl } from './utils/apiBootstrap';
import { Heart, AlertCircle, CheckCircle, Lock, ArrowRight, Store, ShieldCheck, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function SignInPrompt({ onSignIn, onGoMarketplace }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="max-w-lg mx-auto my-12 bg-white rounded-3xl border border-red-100 p-8 shadow-md text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 mx-auto flex items-center justify-center mb-4 shadow-2xs">
        <Lock className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">
        Sign In to View Your HP Plans
      </h3>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Access your active hire-purchase contracts, download legal agreements, and pay monthly installments via Mobile Money.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSignIn}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-sm shadow-red-600/30 cursor-pointer"
        >
          <span>Sign In as Kwesi Mensah</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onGoMarketplace}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition cursor-pointer"
        >
          Continue Shopping
        </motion.button>
      </div>
    </motion.div>
  );
}

function StorefrontContent() {
  const { role, toastMessage, switchRole } = useAuth();

  const [activeTab, setActiveTab] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [marketplaceCategory, setMarketplaceCategory] = useState('All');
  const [marketplaceSearch, setMarketplaceSearch] = useState('');

  const [applicationModalData, setApplicationModalData] = useState(null);
  const [paymentModalData, setPaymentModalData] = useState(null);
  const [receiptModalContract, setReceiptModalContract] = useState(null);

  const handleExploreMarketplace = (category = 'All') => {
    setMarketplaceCategory(category);
    setMarketplaceSearch('');
    setActiveTab('marketplace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeaderSearch = (query) => {
    setMarketplaceCategory('All');
    setMarketplaceSearch(query);
    setActiveTab('marketplace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      
      {/* Storefront E-Commerce Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigateCategory={handleExploreMarketplace}
        onHeaderSearch={handleHeaderSearch}
      />

      {/* Main Storefront Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (activeTab === 'details' ? `-${selectedProductId}` : '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'home' && (
              <HomePage
                onExploreMarketplace={handleExploreMarketplace}
                onSelectProduct={handleSelectProduct}
                onApplyHP={handleApplyHP}
                onGoHowItWorks={() => {
                  setActiveTab('how-it-works');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'marketplace' && (
              <Marketplace
                initialCategory={marketplaceCategory}
                initialSearch={marketplaceSearch}
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
                <SignInPrompt
                  onSignIn={() => switchRole('customer', 'kwesi@gmail.com')}
                  onGoMarketplace={() => handleExploreMarketplace('All')}
                />
              )
            )}

            {activeTab === 'how-it-works' && (
              <HowItWorks onGoMarketplace={() => handleExploreMarketplace('All')} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {applicationModalData && (
          <ApplicationModal
            product={applicationModalData.product}
            initialPlan={applicationModalData.initialPlan}
            onClose={() => setApplicationModalData(null)}
            onSuccess={(newContract) => {
              setApplicationModalData(null);
              if (role === 'customer') {
                setActiveTab('customer');
              }
              if (newContract) {
                setReceiptModalContract(newContract);
              }
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
            onSuccess={() => {
              setPaymentModalData(null);
              setActiveTab('customer');
              window.location.reload();
            }}
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

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key={toastMessage.id || 'toast'}
            initial={{ opacity: 0, y: 25, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="fixed bottom-5 right-5 z-50 pointer-events-auto"
          >
            <div className={`p-4 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 max-w-sm text-white ${
              toastMessage.type === 'error' ? 'bg-red-600 border-red-500' :
              toastMessage.type === 'warning' ? 'bg-orange-600 border-orange-500' :
              'bg-slate-900 border-slate-700'
            }`}>
              {toastMessage.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-white shrink-0" aria-hidden="true" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
              )}
              <span className="leading-snug">{toastMessage.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern E-Commerce Footer */}
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
                Ghana's trusted multi-vendor hire purchase storefront. Shop electronics, phones, home appliances, and mobility gear with verified national ID and Mobile Money installments.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-300 mb-3">Shop Storefront</h4>
              <ul className="space-y-2 text-xs text-red-200/80">
                <li>
                  <button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition cursor-pointer">
                    Storefront Home
                  </button>
                </li>
                <li>
                  <button onClick={() => handleExploreMarketplace('Phones & Tablets')} className="hover:text-white transition cursor-pointer">
                    Phones &amp; Tablets
                  </button>
                </li>
                <li>
                  <button onClick={() => handleExploreMarketplace('Home Appliances')} className="hover:text-white transition cursor-pointer">
                    Home Appliances
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('how-it-works'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition cursor-pointer">
                    How Hire Purchase Works
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-300 mb-3">Dedicated Portals</h4>
              <ul className="space-y-2.5 text-xs text-red-200/80">
                <li>
                  <a href={getAppUrl('vendor/')} className="hover:text-white transition inline-flex items-center gap-1.5 font-semibold">
                    <Store className="w-3.5 h-3.5 text-red-400" />
                    <span>Vendor Seller Central</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </li>
                <li>
                  <a href={getAppUrl('admin/')} className="hover:text-white transition inline-flex items-center gap-1.5 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                    <span>Admin Oversight HQ</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </li>
                <li className="pt-1 text-[11px] text-red-300/80">
                  Hire Purchase Act of Ghana (1974)
                </li>
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
    <AuthProvider initialRole="customer">
      <StorefrontContent />
    </AuthProvider>
  );
}
