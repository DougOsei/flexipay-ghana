import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatGHS, MOMO_PROVIDERS } from '../utils/ghanaConstants';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  Loader2, 
  Receipt,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function MoMoPaymentModal({ contract, installment, onClose, onSuccess }) {
  const { user, showToast } = useAuth();

  const [paymentOption, setPaymentOption] = useState('installment'); // 'installment' | 'full'
  const [selectedProvider, setSelectedProvider] = useState('MTN_MOMO');
  const [phone, setPhone] = useState(contract.customerPhone || user?.phone || '0244123456');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const amountToPay = paymentOption === 'full' 
    ? Math.round(contract.outstandingBalance * 0.95) // 5% early payment discount
    : installment.amount;

  const handlePay = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      // Simulate network roundtrip and USSD approval prompt
      await new Promise(r => setTimeout(r, 1800));

      const res = await fetch('/api/payments/momo-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contract.id,
          installmentNumber: installment.installmentNumber,
          amount: amountToPay,
          phone,
          paymentMethod: selectedProvider
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Payment failed');
      }

      setReceipt(data.paymentRecord);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      showToast(`Installment #${installment.installmentNumber} paid successfully!`, 'success');
      if (onSuccess) onSuccess(data.contract);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-300/30 text-red-300 flex items-center justify-center font-bold">
              📱
            </div>
            <div>
              <h3 className="font-bold text-base">Make Installment Payment</h3>
              <p className="text-xs text-slate-300 font-mono">{contract.contractNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {receipt ? (
            /* RECEIPT / SUCCESS STATE */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Payment Approved
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  GH₵ {receipt.amount?.toLocaleString()} Paid!
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Ref: {receipt.networkRef}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Item:</span>
                  <span className="font-bold text-slate-900">{contract.productTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vendor:</span>
                  <span className="font-semibold text-slate-800">{contract.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Installment:</span>
                  <span className="font-bold text-red-700">#{installment.installmentNumber} of {contract.installments?.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Channel:</span>
                  <span className="font-medium text-slate-800">{receipt.method?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="text-slate-700">{new Date(receipt.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition"
              >
                Close & Return to Dashboard
              </button>
            </div>
          ) : (
            /* PAYMENT FORM */
            <div className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Installment Info Card */}
              <div className="p-4 bg-gradient-to-r from-red-50 to-red-50 border border-red-200/80 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-500 block">
                    Installment #{installment.installmentNumber} • Due {installment.dueDate}
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    {formatGHS(amountToPay)}
                  </span>
                </div>
                <span className="text-xs bg-red-50 text-red-900 border border-red-200 font-bold px-2 py-1 rounded-full">
                  Pending Repayment
                </span>
              </div>

              {/* Early Settlement Option */}
              <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentOption('installment')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    paymentOption === 'installment' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Pay Installment ({formatGHS(installment.amount)})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentOption('full')}
                  className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1 ${
                    paymentOption === 'full' ? 'bg-red-600 text-white shadow' : 'text-slate-600'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-red-200" />
                  <span>Payoff All (5% Off: {formatGHS(Math.round(contract.outstandingBalance * 0.95))})</span>
                </button>
              </div>

              {/* MoMo Provider Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1.5">
                  Select Mobile Money Provider:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {MOMO_PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProvider(p.id)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                        selectedProvider === p.id
                          ? 'border-red-600 bg-red-50 text-slate-900 shadow-sm font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${p.bgColor} ${p.textColor}`}>
                        {p.iconText}
                      </span>
                      <span className="text-[10px] truncate max-w-full font-bold">{p.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* MoMo Phone Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Money Account Number:
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold"
                    placeholder="024XXXXXXX"
                  />
                </div>
              </div>

              {/* Simulated Prompt Warning */}
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[11px] text-red-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-red-700" />
                  Simulated USSD Prompt (*170# / *110#)
                </div>
                <p className="text-slate-600">
                  You will receive an automatic prompt on <strong>{phone}</strong> to approve GH₵ {amountToPay.toLocaleString()} to FlexiPay Escrow.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePay}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-red-700/20 transition"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Mobile Money Prompt...</span>
                  </>
                ) : (
                  <>
                    <span>Authorize MoMo Payment ({formatGHS(amountToPay)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
