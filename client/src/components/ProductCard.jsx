import React from 'react';
import { formatGHS } from '../utils/ghanaConstants';
import { Store, Star, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct, onApplyHP }) {
  // Estimate lowest monthly installment (e.g. 12 or 6 months at min deposit)
  const depositPercent = product.minDownPaymentPercent || 25;
  const maxTenure = Math.max(...(product.allowedTenures || [3]));
  const totalHP = Math.round(product.cashPrice * (1 + (product.markupPercent || 10) / 100));
  const remaining = totalHP - Math.round(totalHP * (depositPercent / 100));
  const estimatedMonthly = Math.round((remaining / maxTenure) * 100) / 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Product Image */}
      <div 
        onClick={() => onSelectProduct(product)}
        className="relative h-48 sm:h-52 overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          {product.featured && (
            <span className="bg-red-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow">
              <Zap className="w-2.5 h-2.5 fill-current" /> Hot Pick
            </span>
          )}
        </div>

        <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-950/85 backdrop-blur-md text-white px-2.5 py-1 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 truncate text-slate-300">
            <Store className="w-3 h-3 text-red-300 shrink-0" />
            <span className="truncate font-medium">{product.vendorName}</span>
          </div>
          <span className="text-[10px] text-red-400 font-semibold shrink-0">{product.vendorCity}</span>
        </div>
      </div>

      {/* Body details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs text-red-500 mb-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-red-300 text-red-300" />
              ))}
            </div>
            <span className="font-bold text-slate-700 ml-1">{product.rating || '4.9'}</span>
            <span className="text-slate-400 text-[11px]">({product.reviewsCount || 42})</span>
          </div>

          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 hover:text-red-700 cursor-pointer transition leading-snug"
          >
            {product.title}
          </h3>
        </div>

        {/* Pricing Matrix */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400 font-medium">Cash Price:</span>
            <span className="text-xs text-slate-500 line-through">{formatGHS(product.cashPrice * 1.05)}</span>
          </div>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-sm font-black text-slate-900">{formatGHS(product.cashPrice)}</span>
            <span className="text-[11px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
              Dep: {depositPercent}%
            </span>
          </div>

          {/* Hire Purchase Badge */}
          <div className="mt-2.5 bg-gradient-to-r from-red-50 to-red-50 border border-red-200/80 rounded-xl p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Pay Small-Small From:
            </span>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="text-base font-extrabold text-red-700">
                {formatGHS(estimatedMonthly)}
                <span className="text-[11px] font-normal text-slate-500"> /mo</span>
              </span>
              <span className="text-[10px] text-slate-600 font-medium">Up to {maxTenure} mos</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="w-full py-2 px-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition text-center"
          >
            Calculator
          </button>
          <button
            type="button"
            onClick={() => onApplyHP(product)}
            className="w-full py-2 px-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm shadow-red-700/20"
          >
            <span>Buy on HP</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
