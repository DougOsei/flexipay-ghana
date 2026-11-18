import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatGHS, MOMO_PROVIDERS, GHANA_REGIONS } from '../utils/ghanaConstants';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  UserCheck, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  AlertCircle,
  Lock,
  Loader2
} from 'lucide-react';

export default function ApplicationModal({ product, initialPlan, onClose, onSuccess }) {
  const { user, showToast } = useAuth();

  // Multi-step state: 1 = Plan Customization, 2 = Ghana ID & KYC, 3 = Terms & Declaration, 4 = MoMo Down Payment, 5 = Complete
  const [step, setStep] = useState(1);

  // Plan parameters
  const [downPaymentPercent, setDownPaymentPercent] = useState(initialPlan?.downPaymentPercent || product.minDownPaymentPercent || 25);
  const [tenureMonths, setTenureMonths] = useState(initialPlan?.tenureMonths || product.allowedTenures?.[0] || 3);
  const [frequency, setFrequency] = useState(initialPlan?.frequency || 'monthly');

  // Customer KYC parameters
  const [fullName, setFullName] = useState(user?.name || 'Kwesi Mensah');
  const [phone, setPhone] = useState(user?.phone || '0244123456');
  const [ghanaCard, setGhanaCard] = useState(user?.ghanaCard || 'GHA-721839201-4');
  const [digitalAddress, setDigitalAddress] = useState(user?.digitalAddress || 'GA-183-9022');
  const [city, setCity] = useState(user?.city || 'Adabraka, Accra');
  const [region, setRegion] = useState(user?.region || 'Greater Accra');
  const [employment, setEmployment] = useState(user?.employment || 'Civil Servant (Ministry of Finance - CAGD)');
  const [guarantorName, setGuarantorName] = useState(user?.guarantorName || 'Nana Ama Osei');
  const [guarantorPhone, setGuarantorPhone] = useState(user?.guarantorPhone || '0209887766');

  // Legal declaration check
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // MoMo Payment parameters
  const [selectedMomoProvider, setSelectedMomoProvider] = useState('MTN_MOMO');
  const [momoNumber, setMomoNumber] = useState(user?.phone || '0244123456');
  const [momoPin, setMomoPin] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdContract, setCreatedContract] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Plan calculation
  const computedPlan = useMemo(() => {
    const price = Number(product.cashPrice);
    const markup = Number(product.markupPercent) || 10;
    const totalHP = Math.round(price * (1 + markup / 100));
    const markupAmount = totalHP - price;
    const depositAmount = Math.round(totalHP * (downPaymentPercent / 100));
    const balance = totalHP - depositAmount;
    const count = frequency === 'weekly' ? tenureMonths * 4 : tenureMonths;
    const installment = Math.round((balance / count) * 100) / 100;

    return {
      cashPrice: price,
      markupPercent: markup,
      markupAmount,
      totalHPAmount: totalHP,
      downPaymentPercent,
      downPaymentAmount: depositAmount,
      remainingBalance: balance,
      tenureMonths,
      frequency,
      numberOfInstallments: count,
      installmentAmount: installment
    };
  }, [product, downPaymentPercent, tenureMonths, frequency]);

  // Handle Step 2 -> 3 transition with validation
  const validateKYC = () => {
    setValidationError('');
    if (!fullName.trim() || !phone.trim() || !ghanaCard.trim() || !digitalAddress.trim() || !guarantorName.trim() || !guarantorPhone.trim()) {
      setValidationError('Please complete all Ghana Card and KYC fields before proceeding.');
      return false;
    }

    const cardRegex = /^GHA-\d{9}-\d$/;
    if (!cardRegex.test(ghanaCard.trim().toUpperCase())) {
      setValidationError('Ghana Card must be in format: GHA-XXXXXXXXX-X (e.g. GHA-721839201-4)');
      return false;
    }

    const gpsRegex = /^[A-Z]{2}-\d{3,4}-\d{4}$/;
    if (!gpsRegex.test(digitalAddress.trim().toUpperCase())) {
      setValidationError('GhanaPost GPS must be in format: GA-183-9022 or AK-039-4412');
      return false;
    }

    return true;
  };

  // Submit and process down payment
  const handleAuthorizeDownPayment = async () => {
    setIsProcessingPayment(true);
    setValidationError('');

    try {
      // Simulate Mobile Money USSD prompt network delay
      await new Promise(r => setTimeout(r, 2200));

      const payload = {
        customerId: user?.id || 'usr_customer_kwesi',
        customerName: fullName,
        customerPhone: phone,
        customerGhanaCard: ghanaCard.trim().toUpperCase(),
        digitalAddress: digitalAddress.trim().toUpperCase(),
        city,
        employment,
        guarantorName,
        guarantorPhone,
        productId: product.id,
        downPaymentPercent: computedPlan.downPaymentPercent,
        tenureMonths: computedPlan.tenureMonths,
        frequency: computedPlan.frequency,
        paymentMethod: selectedMomoProvider,
        downPaymentNetworkRef: `${selectedMomoProvider.replace('_', '-')}-${Math.floor(10000000 + Math.random() * 90000000)}`
      };

      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setCreatedContract(data.contract);
      setStep(5); // Complete!

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      showToast(`Down payment authorized! Application ${data.contract.contractNumber} submitted.`, 'success');
      if (onSuccess) onSuccess(data.contract);
    } catch (err) {
      setValidationError(err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/75 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 450, damping: 32 }}
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8"
      >
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 text-red-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-red-400" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Hire Purchase Application
              </h2>
              <p className="text-xs text-slate-300">
                {product.title} • {product.vendorName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close application modal"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-red-700 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-red-600 text-white' : 'bg-slate-300 text-slate-700'}`}>1</span>
            <span className="hidden sm:inline">Plan</span>
          </div>
          <div className="h-0.5 w-6 bg-slate-200 sm:w-12"></div>

          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-red-700 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-red-600 text-white' : 'bg-slate-300 text-slate-700'}`}>2</span>
            <span className="hidden sm:inline">Ghana Card</span>
          </div>
          <div className="h-0.5 w-6 bg-slate-200 sm:w-12"></div>

          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-red-700 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-red-600 text-white' : 'bg-slate-300 text-slate-700'}`}>3</span>
            <span className="hidden sm:inline">Contract</span>
          </div>
          <div className="h-0.5 w-6 bg-slate-200 sm:w-12"></div>

          <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-red-700 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? 'bg-red-600 text-white' : 'bg-slate-300 text-slate-700'}`}>4</span>
            <span className="hidden sm:inline">MoMo Deposit</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {validationError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: PLAN SELECTION */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200">
                <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded-xl" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{product.title}</h4>
                  <p className="text-xs text-slate-500">Cash: {formatGHS(product.cashPrice)} • Sold by {product.vendorName}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                  Choose Down Payment: <strong className="text-red-700">{downPaymentPercent}% ({formatGHS(computedPlan.downPaymentAmount)})</strong>
                </label>
                <input
                  type="range"
                  min={product.minDownPaymentPercent || 15}
                  max="60"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-2">
                  Select Tenure Duration:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.allowedTenures.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTenureMonths(m)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                        tenureMonths === m
                          ? 'bg-red-600 text-white border-red-600 shadow'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Pill */}
              <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs space-y-2">
                <div className="flex justify-between font-medium text-slate-600">
                  <span>Total Hire Purchase Price:</span>
                  <span className="font-bold text-slate-900">{formatGHS(computedPlan.totalHPAmount)}</span>
                </div>
                <div className="flex justify-between font-medium text-slate-600">
                  <span>Upfront Deposit (Due Today):</span>
                  <span className="font-extrabold text-red-800">{formatGHS(computedPlan.downPaymentAmount)}</span>
                </div>
                <div className="flex justify-between font-medium text-slate-600">
                  <span>Monthly Installment:</span>
                  <span className="font-black text-red-700 text-sm">
                    {formatGHS(computedPlan.installmentAmount)} / mo ({tenureMonths} payments)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
              >
                <span>Continue to Ghana Card Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: GHANA CARD & KYC */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-xs text-red-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span>
                  Ghana Hire Purchase Act compliance requires verifying your national identity via <strong>Ghana Card</strong> and digital residential address.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Legal Name (as on Ghana Card)*</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Active Mobile Number*</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 font-medium text-sm"
                    placeholder="024XXXXXXX"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ghana Card PIN Number*</label>
                  <input
                    type="text"
                    value={ghanaCard}
                    onChange={(e) => setGhanaCard(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 font-mono font-bold text-sm tracking-wide"
                    placeholder="GHA-7XXXXXXXX-X"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Format: GHA-XXXXXXXXX-X</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">GhanaPost GPS Digital Address*</label>
                  <input
                    type="text"
                    value={digitalAddress}
                    onChange={(e) => setDigitalAddress(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 font-mono font-bold text-sm"
                    placeholder="GA-183-9022"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">e.g. GA-183-9022, AK-039-4412</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">City / Neighborhood*</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-sm"
                    placeholder="e.g. Adabraka, Accra"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Employment / Business Type*</label>
                  <select
                    value={employment}
                    onChange={(e) => setEmployment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-sm"
                  >
                    <option value="Civil Servant (Ministry of Finance - CAGD)">Civil Servant / CAGD Government Worker</option>
                    <option value="Private Sector Employee">Private Sector Corporate Employee</option>
                    <option value="Self Employed Trader">Self-Employed Trader / Merchant</option>
                    <option value="Tech / Freelance Professional">Tech / Remote / Freelance Professional</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Guarantor Full Name*</label>
                  <input
                    type="text"
                    value={guarantorName}
                    onChange={(e) => setGuarantorName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Guarantor Mobile Number*</label>
                  <input
                    type="tel"
                    value={guarantorPhone}
                    onChange={(e) => setGuarantorPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-sm"
                    placeholder="020XXXXXXX"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateKYC()) setStep(3);
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-1"
                >
                  <span>Review Contract Declaration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONTRACT DECLARATION */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl max-h-56 overflow-y-auto space-y-2 text-slate-700 leading-relaxed font-sans">
                <h5 className="font-bold text-slate-900 uppercase tracking-wider text-center text-xs pb-1 border-b border-slate-200">
                  Republic of Ghana • Standard Hire-Purchase Statutory Disclosure
                </h5>
                <p>
                  <strong>Parties:</strong> Buyer ({fullName}, Ghana Card: {ghanaCard}) and Merchant ({product.vendorName}, {product.vendorCity}).
                </p>
                <p>
                  <strong>Subject Goods:</strong> {product.title}. Outright Cash Value: {formatGHS(product.cashPrice)}. Total Hire Purchase Price: {formatGHS(computedPlan.totalHPAmount)}.
                </p>
                <p>
                  <strong>Payment Obligation:</strong> Deposit of {formatGHS(computedPlan.downPaymentAmount)} payable prior to delivery, followed by {computedPlan.numberOfInstallments} equal monthly installments of {formatGHS(computedPlan.installmentAmount)}.
                </p>
                <p>
                  <strong>Ownership:</strong> Title to the goods remains with the Vendor until final installment is completed. Buyer enjoys full possessory rights upon down payment and delivery.
                </p>
                <p>
                  <strong>Repayment Method:</strong> Payments are processed automatically through FlexiPay Ghana escrow via Mobile Money (MTN MoMo, Telecel Cash, AT Money).
                </p>
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-red-200 bg-red-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
                />
                <span className="text-slate-800 text-xs">
                  I hereby confirm that all information provided is true and accurate. I understand and accept the statutory hire-purchase repayment terms for <strong>{product.title}</strong>.
                </span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!agreedToTerms}
                  onClick={() => setStep(4)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1 transition ${
                    agreedToTerms
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Proceed to MoMo Down Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: MOMO DOWN PAYMENT */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Upfront Down Payment Due</span>
                  <div className="text-2xl font-black text-red-300 mt-0.5">
                    {formatGHS(computedPlan.downPaymentAmount)}
                  </div>
                  <span className="text-[11px] text-red-400">FlexiPay Escrow Protected</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Vendor</span>
                  <span className="text-xs font-bold text-white">{product.vendorName}</span>
                </div>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-2">
                  Select Mobile Money Provider:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MOMO_PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedMomoProvider(p.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                        selectedMomoProvider === p.id
                          ? 'border-red-600 bg-red-50/70 shadow-sm font-bold text-slate-900'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-white'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${p.bgColor} ${p.textColor} shadow-sm`}>
                        {p.iconText}
                      </span>
                      <span className="text-[11px] font-bold text-center leading-tight">{p.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* MoMo Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Money Wallet Number:
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold font-mono"
                    placeholder="024XXXXXXX"
                  />
                </div>
              </div>

              {/* Simulated Authorization Prompt Box */}
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs space-y-1">
                <div className="font-bold text-red-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-red-700" />
                  Simulated Ghana USSD Authorization (*170# / *110#)
                </div>
                <p className="text-slate-600 text-[11px]">
                  Clicking "Authorize & Pay Deposit" will trigger an instantaneous prompt to your phone simulation to approve <strong>{formatGHS(computedPlan.downPaymentAmount)}</strong>.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={() => setStep(3)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleAuthorizeDownPayment}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-red-700/20"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending MoMo Push Notification...</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize & Pay {formatGHS(computedPlan.downPaymentAmount)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS STATE */}
          {step === 5 && createdContract && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Down Payment Confirmed
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  Application Successfully Submitted!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Contract Agreement: <strong className="text-slate-800 font-mono">{createdContract.contractNumber}</strong>
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-left space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-bold text-slate-800">{createdContract.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ghana Card:</span>
                  <span className="font-mono text-slate-800">{createdContract.customerGhanaCard}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vendor:</span>
                  <span className="font-bold text-slate-800">{createdContract.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Deposit Paid:</span>
                  <span className="font-bold text-red-700">{formatGHS(createdContract.downPaymentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Remaining Installments:</span>
                  <span className="font-bold text-red-700">
                    {formatGHS(createdContract.installmentAmount)} / mo ({createdContract.tenureMonths} months)
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full max-w-md py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition shadow"
                >
                  Done & View in Small-Small Hub
                </button>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
}
