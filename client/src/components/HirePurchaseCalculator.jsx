import React, { useState, useMemo } from 'react';
import { formatGHS } from '../utils/ghanaConstants';
import { Calculator, Calendar, ArrowRight, ShieldCheck, Zap, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HirePurchaseCalculator({
  cashPrice = 5000,
  markupPercent = 10,
  minDownPaymentPercent = 20,
  allowedTenures = [3, 6, 12],
  onApplyPlan
}) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(minDownPaymentPercent || 25);
  const [tenureMonths, setTenureMonths] = useState(allowedTenures[0] || 3);
  const [frequency, setFrequency] = useState('monthly');
  const [showScheduleBreakdown, setShowScheduleBreakdown] = useState(false);

  // Real-time calculation engine
  const plan = useMemo(() => {
    const price = Number(cashPrice) || 0;
    const markup = Number(markupPercent) || 0;
    const depositPct = Number(downPaymentPercent);
    const months = Number(tenureMonths);

    // Total HP Price including markup surcharge
    const totalHPAmount = Math.round(price * (1 + markup / 100));
    const markupAmount = totalHPAmount - price;

    // Upfront Down Payment
    const downPaymentAmount = Math.round(totalHPAmount * (depositPct / 100));

    // Remaining balance
    const remainingBalance = totalHPAmount - downPaymentAmount;

    // Installments
    const count = frequency === 'weekly' ? months * 4 : months;
    const installmentAmount = Math.round((remainingBalance / count) * 100) / 100;

    // Generate schedule dates
    const schedule = [];
    const now = new Date();
    for (let i = 1; i <= count; i++) {
      const d = new Date(now);
      if (frequency === 'weekly') {
        d.setDate(d.getDate() + (i * 7));
      } else {
        d.setMonth(d.getMonth() + i);
      }
      schedule.push({
        num: i,
        date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        amount: installmentAmount
      });
    }

    return {
      cashPrice: price,
      markupPercent: markup,
      markupAmount,
      totalHPAmount,
      downPaymentPercent: depositPct,
      downPaymentAmount,
      remainingBalance,
      tenureMonths: months,
      frequency,
      numberOfInstallments: count,
      installmentAmount,
      schedule
    };
  }, [cashPrice, markupPercent, downPaymentPercent, tenureMonths, frequency]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5 sm:p-7 transition-all duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shadow-2xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Hire Purchase Calculator</h3>
            <p className="text-xs text-slate-500">Live calculation under Ghana HP regulations</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-800 border border-red-200 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
          <span>BNPL Plan</span>
        </span>
      </div>

      <div className="mt-5 space-y-5">
        {/* Down Payment Slider with smooth counter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Upfront Deposit / Down Payment:
            </label>
            <div className="text-right">
              <span className="text-sm sm:text-base font-black text-red-700 bg-red-50 px-2.5 py-0.5 rounded-lg border border-red-100">
                {downPaymentPercent}% ({formatGHS(plan.downPaymentAmount)})
              </span>
            </div>
          </div>
          <input
            type="range"
            min={minDownPaymentPercent || 15}
            max="60"
            step="5"
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600 transition"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-medium">
            <span>Min: {minDownPaymentPercent}%</span>
            <span>40% (Recommended)</span>
            <span>Max: 60%</span>
          </div>
        </div>

        {/* Repayment Tenure Buttons */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            Repayment Tenure (Duration):
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {allowedTenures.map((m) => {
              const isSelected = tenureMonths === m;
              return (
                <motion.button
                  key={m}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setTenureMonths(m)}
                  className={`relative py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {m} Months
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Frequency selector with animated background */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            Payment Frequency:
          </label>
          <div className="relative flex items-center rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setFrequency('monthly')}
              className={`relative z-10 flex-1 py-2 rounded-xl transition text-center ${
                frequency === 'monthly' ? 'text-slate-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {frequency === 'monthly' && (
                <motion.div
                  layoutId="activeFreqIndicator"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm -z-0"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">Monthly Installments</span>
            </button>
            <button
              type="button"
              onClick={() => setFrequency('weekly')}
              className={`relative z-10 flex-1 py-2 rounded-xl transition text-center ${
                frequency === 'weekly' ? 'text-slate-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {frequency === 'weekly' && (
                <motion.div
                  layoutId="activeFreqIndicator"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm -z-0"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">Weekly Installments</span>
            </button>
          </div>
        </div>

        {/* Breakdown Card */}
        <motion.div 
          layout
          className="bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 text-white rounded-2xl p-5 shadow-xl border border-red-900/60"
        >
          <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-red-200 font-semibold">
                Your {frequency === 'weekly' ? 'Weekly' : 'Monthly'} Payment
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight">
                {formatGHS(plan.installmentAmount)}
                <span className="text-xs text-red-300 font-normal"> / {frequency === 'weekly' ? 'week' : 'mo'}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-red-200 block font-medium">Deposit Today</span>
              <span className="text-lg font-black text-red-400">{formatGHS(plan.downPaymentAmount)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3.5 text-xs">
            <div>
              <span className="text-slate-400 block">Outright Cash Price:</span>
              <span className="font-semibold text-slate-200">{formatGHS(plan.cashPrice)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Total Hire Purchase:</span>
              <span className="font-semibold text-slate-200">{formatGHS(plan.totalHPAmount)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Financing Markup ({plan.markupPercent}%):</span>
              <span className="font-semibold text-red-300">+{formatGHS(plan.markupAmount)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Installment Count:</span>
              <span className="font-semibold text-slate-200">{plan.numberOfInstallments} payments</span>
            </div>
          </div>
        </motion.div>

        {/* Toggle Schedule Breakdown with AnimatePresence */}
        <div>
          <button
            type="button"
            onClick={() => setShowScheduleBreakdown(!showScheduleBreakdown)}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-bold transition"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{showScheduleBreakdown ? 'Hide Repayment Schedule' : 'View Full Repayment Schedule Preview'}</span>
            {showScheduleBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <AnimatePresence>
            {showScheduleBreakdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden mt-3"
              >
                <div className="max-h-52 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 text-xs shadow-inner">
                  <div className="bg-slate-50 px-3.5 py-2 font-bold text-slate-600 flex justify-between sticky top-0 border-b border-slate-200">
                    <span>Payment</span>
                    <span>Due Date</span>
                    <span>Amount</span>
                  </div>
                  {plan.schedule.map((item) => (
                    <div key={item.num} className="px-3.5 py-2 flex justify-between items-center text-slate-700 hover:bg-slate-50/70 transition">
                      <span className="font-semibold text-slate-900">Installment #{item.num}</span>
                      <span className="text-slate-500">{item.date}</span>
                      <span className="font-bold text-red-600">{formatGHS(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {onApplyPlan && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => onApplyPlan(plan)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition"
          >
            <span>Proceed with this Plan</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
