import React, { useState, useMemo } from 'react';
import { formatGHS } from '../utils/ghanaConstants';
import { Calculator, Calendar, ArrowRight, ShieldCheck, Zap, Info } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-5 sm:p-6 transition">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Hire Purchase Calculator</h3>
            <p className="text-xs text-slate-500">Customize deposit & installment terms</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-200">
          🇬🇭 BNPL Ghana Plan
        </span>
      </div>

      <div className="mt-5 space-y-5">
        {/* Down Payment Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Upfront Deposit / Down Payment:
            </label>
            <div className="text-right">
              <span className="text-sm font-extrabold text-red-700">
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
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>Min: {minDownPaymentPercent}%</span>
            <span>40% (Recommended)</span>
            <span>Max: 60%</span>
          </div>
        </div>

        {/* Repayment Tenure */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            Repayment Tenure (Duration):
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {allowedTenures.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTenureMonths(m)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                  tenureMonths === m
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {m} Months
              </button>
            ))}
          </div>
        </div>

        {/* Frequency selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            Payment Frequency:
          </label>
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setFrequency('monthly')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                frequency === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Installments
            </button>
            <button
              type="button"
              onClick={() => setFrequency('weekly')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                frequency === 'weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Installments
            </button>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 sm:p-5 shadow-inner">
          <div className="flex items-baseline justify-between border-b border-slate-700/60 pb-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Your {frequency === 'weekly' ? 'Weekly' : 'Monthly'} Payment
              </span>
              <div className="text-2xl sm:text-3xl font-black text-red-300 mt-0.5">
                {formatGHS(plan.installmentAmount)}
                <span className="text-xs text-slate-300 font-normal"> / {frequency === 'weekly' ? 'week' : 'mo'}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Deposit Today</span>
              <span className="text-lg font-bold text-red-400">{formatGHS(plan.downPaymentAmount)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
            <div>
              <span className="text-slate-400 block">Outright Cash Price:</span>
              <span className="font-semibold text-slate-200">{formatGHS(plan.cashPrice)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Total Hire Purchase Price:</span>
              <span className="font-semibold text-slate-200">{formatGHS(plan.totalHPAmount)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Financing Markup ({plan.markupPercent}%):</span>
              <span className="font-semibold text-red-200">+{formatGHS(plan.markupAmount)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Installment Count:</span>
              <span className="font-semibold text-slate-200">{plan.numberOfInstallments} payments</span>
            </div>
          </div>
        </div>

        {/* Toggle Schedule Breakdown */}
        <div>
          <button
            type="button"
            onClick={() => setShowScheduleBreakdown(!showScheduleBreakdown)}
            className="flex items-center gap-1.5 text-xs text-red-700 hover:text-red-800 font-bold"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{showScheduleBreakdown ? 'Hide Repayment Schedule' : 'View Full Repayment Schedule Preview'}</span>
          </button>

          {showScheduleBreakdown && (
            <div className="mt-3 max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
              <div className="bg-white px-3 py-2 font-bold text-slate-600 flex justify-between">
                <span>Payment</span>
                <span>Due Date</span>
                <span>Amount</span>
              </div>
              {plan.schedule.map((item) => (
                <div key={item.num} className="px-3 py-2 flex justify-between items-center text-slate-700">
                  <span className="font-medium text-slate-900">Installment #{item.num}</span>
                  <span className="text-slate-500">{item.date}</span>
                  <span className="font-bold text-red-700">{formatGHS(item.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        {onApplyPlan && (
          <button
            type="button"
            onClick={() => onApplyPlan(plan)}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-sm shadow-md shadow-red-700/20 flex items-center justify-center gap-2 transition hover:scale-[1.01]"
          >
            <span>Proceed with this Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
