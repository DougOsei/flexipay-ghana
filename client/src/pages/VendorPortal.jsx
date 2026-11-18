import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatGHS, formatDate, CATEGORIES, GHANA_REGIONS, MOMO_PROVIDERS } from '../utils/ghanaConstants';
import { 
  Store, 
  CreditCard, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Bell, 
  ArrowUpRight, 
  Package, 
  Smartphone, 
  ShieldCheck, 
  Clock, 
  Users, 
  DollarSign, 
  Layers, 
  FileText,
  Send,
  Loader2,
  Trash2,
  Truck,
  Sparkles,
  MapPin,
  Building
} from 'lucide-react';

export default function VendorPortal({ onViewReceipt }) {
  const { user, showToast } = useAuth();

  // Active vendor store state
  const [vendorsList, setVendorsList] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState('ven_franko');
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active view tab inside Vendor Central
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'installments' | 'products' | 'settings'

  // Register New Vendor Store Modal state
  const [showRegisterStoreModal, setShowRegisterStoreModal] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreTagline, setNewStoreTagline] = useState('');
  const [newStoreEmail, setNewStoreEmail] = useState('');
  const [newStorePhone, setNewStorePhone] = useState('');
  const [newStoreMomo, setNewStoreMomo] = useState('');
  const [newStoreMomoNetwork, setNewStoreMomoNetwork] = useState('MTN_MOMO');
  const [newStoreRegion, setNewStoreRegion] = useState('Greater Accra');
  const [newStoreCity, setNewStoreCity] = useState('');
  const [newStoreGPS, setNewStoreGPS] = useState('');
  const [isRegisteringStore, setIsRegisteringStore] = useState(false);

  // Add Product Modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Phones & Tablets');
  const [newBrand, setNewBrand] = useState('');
  const [newCashPrice, setNewCashPrice] = useState('');
  const [newMarkup, setNewMarkup] = useState('10');
  const [newMinDeposit, setNewMinDeposit] = useState('20');
  const [newStock, setNewStock] = useState('10');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Payout request state
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);

  // Fetch all vendors to populate store switcher
  useEffect(() => {
    fetch('/api/vendors')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.vendors?.length) {
          setVendorsList(data.vendors);
          if (user?.storeId) {
            setSelectedVendorId(user.storeId);
          }
        }
      })
      .catch(err => console.error(err));
  }, [user]);

  // Load selected vendor details & dashboard data
  const loadVendorDashboard = async () => {
    if (!selectedVendorId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/vendors/${selectedVendorId}/dashboard`);
      const data = await res.json();
      if (data.success) {
        setVendorData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendorDashboard();
  }, [selectedVendorId]);

  // Vendor Action: Register New Store
  const handleRegisterStore = async (e) => {
    e.preventDefault();
    if (!newStoreName || !newStoreEmail || !newStorePhone || !newStoreMomo) {
      showToast('Please fill all required store registration fields', 'warning');
      return;
    }
    setIsRegisteringStore(true);
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStoreName,
          tagline: newStoreTagline || 'Verified Ghana Retail Merchant',
          ownerEmail: newStoreEmail,
          phone: newStorePhone,
          momoNumber: newStoreMomo,
          momoNetwork: newStoreMomoNetwork || 'MTN_MOMO',
          region: newStoreRegion || 'Greater Accra',
          city: newStoreCity || 'Accra',
          digitalAddress: newStoreGPS || 'GA-000-0000',
          logo: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=200&q=80',
          coverImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1000&q=80'
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🎉 Store "${data.vendor.name}" registered successfully!`, 'success');
        setShowRegisterStoreModal(false);
        setVendorsList(prev => [...prev, data.vendor]);
        setSelectedVendorId(data.vendor.id);
        setNewStoreName('');
        setNewStoreTagline('');
        setNewStoreEmail('');
        setNewStorePhone('');
        setNewStoreMomo('');
        setNewStoreCity('');
        setNewStoreGPS('');
      } else {
        showToast(data.error || 'Failed to register store', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsRegisteringStore(false);
    }
  };

  // Vendor Action: Approve Application
  const handleApproveContract = async (contractId) => {
    try {
      const res = await fetch(`/api/contracts/${contractId}/approve`, {
        method: 'PATCH'
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Application approved! Dispatch initiated.`, 'success');
        loadVendorDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Vendor Action: Reject Application
  const handleRejectContract = async (contractId) => {
    const reason = prompt('Please specify reason for rejecting application (e.g. Ghana Card unverified or insufficient income):');
    if (!reason) return;
    try {
      const res = await fetch(`/api/contracts/${contractId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Application marked as rejected.', 'info');
        loadVendorDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Vendor Action: Update Delivery Status
  const handleUpdateDelivery = async (contractId, newStatus) => {
    try {
      const res = await fetch(`/api/contracts/${contractId}/delivery`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Delivery status updated to ${newStatus.replace('_', ' ')}!`, 'success');
        loadVendorDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Vendor Action: Send Payment SMS Reminder
  const handleSendReminder = async (contractId) => {
    try {
      const res = await fetch(`/api/contracts/${contractId}/remind`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Vendor Action: Request MoMo Payout
  const handleRequestPayout = async () => {
    const amount = vendorData?.stats?.pendingDisbursement || 500;
    if (amount <= 0) {
      showToast('No pending balance to disburse.', 'warning');
      return;
    }
    setIsRequestingPayout(true);
    try {
      const res = await fetch(`/api/vendors/${selectedVendorId}/request-payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Disbursement of GH₵ ${amount.toLocaleString()} sent to ${vendorData?.stats?.vendor?.momoNumber}!`, 'success');
        loadVendorDashboard();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRequestingPayout(false);
    }
  };

  // Vendor Action: Create New Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newTitle || !newCashPrice) {
      showToast('Please provide Title and Cash Price', 'warning');
      return;
    }

    setIsAddingProduct(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          brand: newBrand || 'Original',
          cashPrice: Number(newCashPrice),
          markupPercent: Number(newMarkup) || 10,
          minDownPaymentPercent: Number(newMinDeposit) || 20,
          allowedTenures: [3, 6, 12],
          vendorId: selectedVendorId,
          vendorName: vendorData?.stats?.vendor?.name,
          vendorCity: vendorData?.stats?.vendor?.city,
          stock: Number(newStock) || 5,
          image: newImage || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
          description: newDesc || 'High performance item backed by standard official warranty.',
          features: ['Ghana Card Installment eligible', 'Includes 1-Year Local Warranty']
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('New product added to store catalog!', 'success');
        setShowAddProductModal(false);
        setNewTitle('');
        setNewCashPrice('');
        setNewBrand('');
        setNewDesc('');
        loadVendorDashboard();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingProduct(false);
    }
  };

  if (loading && !vendorData) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading Vendor Central...</p>
      </div>
    );
  }

  const vendor = vendorData?.stats?.vendor;
  const stats = vendorData?.stats;

  return (
    <div className="space-y-8 pb-20">
      
      {/* Vendor Top Header & Store Switcher */}
      <section className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-red-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
              🏪
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-red-300 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  Verified Merchant
                </span>
                <span className="text-xs text-slate-300">MoMo Wallet: {vendor?.momoNumber} ({vendor?.momoNetwork ? vendor.momoNetwork.replace(/_/g, ' ') : 'MTN MoMo'})</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                {vendor?.name}
              </h1>
              <p className="text-xs text-red-100/80 mt-0.5">
                {vendor?.city} • GPS: <span className="font-mono">{vendor?.digitalAddress}</span>
              </p>
            </div>
          </div>

          {/* Quick Store Picker & Register New Store Action */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex flex-col gap-1.5 shrink-0">
              <span className="text-[10px] uppercase font-bold text-red-200">Switch Store:</span>
              <select
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                className="bg-slate-900 text-white border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-red-500"
              >
                {vendorsList.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.city})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowRegisterStoreModal(true)}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white text-xs font-extrabold flex items-center gap-1.5 transition shadow-md shadow-red-900/40 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Open New Store</span>
            </button>
          </div>
        </div>

        {/* Store Financial Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/60">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Total Sales (GMV)</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
              {formatGHS(stats?.totalGMV || vendor?.totalSalesGHS || 0)}
            </span>
            <span className="text-[10px] text-red-400">Total hire purchase volume</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Collected Repayments</span>
            <span className="text-xl sm:text-2xl font-black text-red-400 mt-1 block">
              {formatGHS(stats?.totalCollected || vendor?.collectedInstallmentsGHS || 0)}
            </span>
            <span className="text-[10px] text-slate-300">Received via Mobile Money</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Active Installment Hirers</span>
            <span className="text-xl sm:text-2xl font-black text-red-300 mt-1 block">
              {stats?.activeContractsCount || 0} Customers
            </span>
            <span className="text-[10px] text-red-200">{stats?.pendingReviewCount || 0} pending review</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Escrow Balance for Payout</span>
              <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
                {formatGHS(stats?.pendingDisbursement || 0)}
              </span>
            </div>
            <button
              type="button"
              disabled={isRequestingPayout}
              onClick={handleRequestPayout}
              className="mt-2 w-full py-1.5 px-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-slate-950 text-xs font-black transition flex items-center justify-center gap-1 shadow"
            >
              {isRequestingPayout ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span>Request MoMo Payout</span>
            </button>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'applications'
              ? 'bg-red-500 text-slate-950 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Hire-Purchase Applications</span>
          {stats?.pendingReviewCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {stats?.pendingReviewCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('installments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'installments'
              ? 'bg-red-500 text-slate-950 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Repayments & Schedules</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-red-500 text-slate-950 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog ({vendorData?.products?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: HIRE PURCHASE APPLICATIONS */}
      {activeTab === 'applications' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Incoming Customer Applications</h3>
              <p className="text-xs text-slate-500">Review buyer Ghana Card verification, guarantor, and approve delivery</p>
            </div>
          </div>

          {vendorData?.recentContracts?.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <p className="text-xs text-slate-400">No applications received yet for this store.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vendorData?.recentContracts?.map((contract) => (
                <div
                  key={contract.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-900">{contract.contractNumber}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          contract.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                          contract.status === 'PENDING_APPROVAL' ? 'bg-red-50 text-red-800' :
                          contract.status === 'COMPLETED' ? 'bg-red-100 text-red-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {(contract?.status || 'PENDING').replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Delivery: {contract.deliveryStatus?.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base mt-1">{contract.productTitle}</h4>
                      <p className="text-xs text-slate-500">
                        Submitted: {formatDate(contract.createdAt)} • Deposit Collected: <strong className="text-red-700">{formatGHS(contract.downPaymentAmount)}</strong>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      {contract.status === 'PENDING_APPROVAL' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApproveContract(contract.id)}
                            className="py-2 px-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Dispatch</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectContract(contract.id)}
                            className="py-2 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {contract.status === 'ACTIVE' && contract.deliveryStatus !== 'DELIVERED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateDelivery(contract.id, 'DELIVERED')}
                          className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Mark Delivered</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onViewReceipt(contract)}
                        className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-white text-xs font-bold transition flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Contract Details</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer Identity & Risk Dossier */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block font-medium">Customer Legal Name</span>
                      <span className="font-bold text-slate-900">{contract.customerName}</span>
                      <span className="text-[11px] text-slate-500 block">{contract.customerPhone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">National ID (Ghana Card)</span>
                      <span className="font-mono font-bold text-red-800">{contract.customerGhanaCard}</span>
                      <span className="text-[11px] text-slate-500 block truncate">{contract.customerAddress}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Guarantor & Employment</span>
                      <span className="font-bold text-slate-900">{contract.guarantorName} ({contract.guarantorPhone})</span>
                      <span className="text-[11px] text-slate-500 block truncate">{contract.employment}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: INSTALLMENTS & COLLECTIONS */}
      {activeTab === 'installments' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Master Installment Collections</h3>
              <p className="text-xs text-slate-500">Track pending and paid installments across all active agreements</p>
            </div>
          </div>

          <div className="space-y-4">
            {vendorData?.recentContracts?.map((contract) => (
              <div key={contract.id} className="border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-500">{contract.contractNumber}</span>
                    <h5 className="font-bold text-slate-900 text-sm">{contract.productTitle}</h5>
                    <span className="text-xs text-slate-500">
                      Customer: <strong>{contract.customerName}</strong> ({contract.customerPhone})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSendReminder(contract.id)}
                      className="py-1.5 px-3 rounded-xl bg-red-50 border border-red-100 text-red-900 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Bell className="w-3.5 h-3.5 text-red-700" />
                      <span>Send SMS / MoMo Reminder</span>
                    </button>
                  </div>
                </div>

                {/* Sub-table for contract installments */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
                  {contract.installments?.map((inst) => (
                    <div
                      key={inst.installmentNumber}
                      className={`p-2.5 rounded-xl border ${
                        inst.status === 'PAID'
                          ? 'bg-red-50/60 border-red-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">#{inst.installmentNumber}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          inst.status === 'PAID' ? 'bg-red-200 text-red-900' : 'bg-red-100 text-red-900'
                        }`}>
                          {inst.status}
                        </span>
                      </div>
                      <div className="font-black text-slate-900 mt-1">{formatGHS(inst.amount)}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{inst.dueDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: PRODUCT CATALOG */}
      {activeTab === 'products' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Store Products & Financing Rules</h3>
              <p className="text-xs text-slate-500">Configure cash prices, hire purchase markups, and minimum deposits</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddProductModal(true)}
              className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendorData?.products?.map((prod) => (
              <div key={prod.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                <img src={prod.image} alt={prod.title} className="w-full h-36 object-cover rounded-xl" />
                <div>
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                    {prod.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1 mt-1">{prod.title}</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Cash Price:</span>
                    <span className="font-bold text-slate-800">{formatGHS(prod.cashPrice)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">HP Markup:</span>
                    <span className="font-bold text-red-700">{prod.markupPercent}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Min Deposit:</span>
                    <span className="font-bold text-slate-800">{prod.minDownPaymentPercent}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">In Showroom:</span>
                    <span className="font-bold text-red-700">{prod.stock} units</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* REGISTER NEW VENDOR STORE ONBOARDING MODAL */}
      {showRegisterStoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  🇬🇭
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Open a New Vendor Store</h3>
                  <p className="text-xs text-slate-500">Sell products on installment and collect repayments via MoMo</p>
                </div>
              </div>
              <button onClick={() => setShowRegisterStoreModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterStore} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Store / Business Name*</label>
                  <input
                    type="text"
                    required
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    placeholder="e.g. Accra City Electronics"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Store Tagline</label>
                  <input
                    type="text"
                    value={newStoreTagline}
                    onChange={(e) => setNewStoreTagline(e.target.value)}
                    placeholder="e.g. Premium Gadgets on Small-Small Pay"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Owner Email*</label>
                  <input
                    type="email"
                    required
                    value={newStoreEmail}
                    onChange={(e) => setNewStoreEmail(e.target.value)}
                    placeholder="merchant@store.gh"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Business Contact Phone*</label>
                  <input
                    type="tel"
                    required
                    value={newStorePhone}
                    onChange={(e) => setNewStorePhone(e.target.value)}
                    placeholder="024XXXXXXX"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Mobile Money Payout Setup */}
              <div className="p-4 bg-red-50/70 border border-red-100 rounded-2xl space-y-3">
                <span className="font-bold text-red-900 block text-xs flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-red-700" />
                  Mobile Money Wallet for Installment Payouts (Ghana)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">MoMo Provider*</label>
                    <select
                      value={newStoreMomoNetwork}
                      onChange={(e) => setNewStoreMomoNetwork(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold"
                    >
                      <option value="MTN_MOMO">MTN Mobile Money (*170#)</option>
                      <option value="TELECEL_CASH">Telecel Cash (*110#)</option>
                      <option value="AT_MONEY">AT Money (*110#)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">MoMo Merchant / Wallet Number*</label>
                    <input
                      type="tel"
                      required
                      value={newStoreMomo}
                      onChange={(e) => setNewStoreMomo(e.target.value)}
                      placeholder="0244XXXXXX"
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Location & GPS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Region*</label>
                  <select
                    value={newStoreRegion}
                    onChange={(e) => setNewStoreRegion(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    {GHANA_REGIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City / Neighborhood*</label>
                  <input
                    type="text"
                    required
                    value={newStoreCity}
                    onChange={(e) => setNewStoreCity(e.target.value)}
                    placeholder="e.g. Osu, Accra"
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">GhanaPost GPS Digital Address*</label>
                  <input
                    type="text"
                    required
                    value={newStoreGPS}
                    onChange={(e) => setNewStoreGPS(e.target.value.toUpperCase())}
                    placeholder="e.g. GA-102-4412"
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterStoreModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegisteringStore}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-1 shadow"
                >
                  {isRegisteringStore ? <Loader2 className="w-4 h-4 animate-spin" /> : <Store className="w-4 h-4" />}
                  <span>Register Store & Launch Dashboard</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">List New Item on Hire-Purchase</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title*</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Samsung 65-Inch Crystal UHD Smart TV"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category*</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g. Samsung, Apple, Bruhm"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cash Price (GH₵)*</label>
                  <input
                    type="number"
                    required
                    value={newCashPrice}
                    onChange={(e) => setNewCashPrice(e.target.value)}
                    placeholder="4500"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">HP Markup %</label>
                  <input
                    type="number"
                    value={newMarkup}
                    onChange={(e) => setNewMarkup(e.target.value)}
                    placeholder="10"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min Deposit %</label>
                  <input
                    type="number"
                    value={newMinDeposit}
                    onChange={(e) => setNewMinDeposit(e.target.value)}
                    placeholder="20"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL (or Unsplash sample)</label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Description</label>
                <textarea
                  rows="2"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Official warranty, features, and specs..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingProduct}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-1 shadow"
                >
                  {isAddingProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                  <span>Save & List Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
