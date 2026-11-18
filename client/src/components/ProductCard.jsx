import React, { useState } from 'react';
import { formatGHS } from '../utils/ghanaConstants';
import { Store, Star, ArrowRight, ShieldCheck, Zap, Calculator, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product, onSelectProduct, onApplyHP, index = 0 }) {
  const [wishlisted, setWishlisted] = useState(false);
  const depositPercent = product.minDownPaymentPercent || 25;
  const maxTenure = Math.max(...(product.allowedTenures || [3]));
  const totalHP = Math.round(product.cashPrice * (1 + (product.markupPercent || 10) / 100));
  const remaining = totalHP - Math.round(totalHP * (depositPercent / 100));
  const estimatedMonthly = Math.round((remaining / maxTenure) * 100) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
      className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Product Image Showcase */}
      <div 
        onClick={() => onSelectProduct(product)}
        className="relative h-48 sm:h-52 overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          <span className="bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
            {product.category}
          </span>
          {product.featured && (
            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-red-600/30">
              <Zap className="w-2.5 h-2.5 fill-current" aria-hidden="true" /> Hot Pick
            </span>
          )}
        </div>

        {/* Interactive Wishlist Toggle */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setWishlisted(!wishlisted);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-red-600 transition cursor-pointer"
        >
          <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-red-600 text-red-600' : ''}`} />
        </motion.button>

        {/* Merchant location ribbon */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-950/85 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl flex items-center justify-between text-xs z-10 border border-white/10">
          <div className="flex items-center gap-1.5 truncate text-slate-200">
            <Store className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="truncate font-medium text-[11px]">{product.vendorName}</span>
          </div>
          <span className="text-[10px] text-red-300 font-semibold shrink-0 bg-red-950/60 px-1.5 py-0.5 rounded-md">{product.vendorCity}</span>
        </div>
      </div>

      {/* Body details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-slate-700 ml-0.5">{product.rating || '4.9'}</span>
            <span className="text-slate-400 text-[11px]">({product.reviewsCount || 42})</span>
          </div>

          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 hover:text-red-600 cursor-pointer transition leading-snug"
          >
            {product.title}
          </h3>
        </div>

        {/* Pricing Matrix */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400 font-medium">Cash Price:</span>
            <span className="text-xs text-slate-400 line-through">{formatGHS(product.cashPrice * 1.05)}</span>
          </div>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-base font-black text-slate-900">{formatGHS(product.cashPrice)}</span>
            <span className="text-[11px] text-red-700 font-extrabold bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
              Dep: {depositPercent}%
            </span>
          </div>

          {/* Hire Purchase Badge */}
          <div className="mt-3 bg-gradient-to-r from-red-50/80 to-red-100/40 border border-red-200/90 rounded-2xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Pay Small-Small:
              </span>
              <span className="text-[10px] text-red-800 font-semibold bg-white/80 px-1.5 py-0.5 rounded-md border border-red-100">
                Up to {maxTenure} mos
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-black text-red-700 tracking-tight">
                {formatGHS(estimatedMonthly)}
                <span className="text-xs font-normal text-slate-500"> /mo</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">via MoMo</span>
            </div>
          </div>
        </div>

        {/* Action Buttons with spring feedback */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => onSelectProduct(product)}
            className="w-full py-2 px-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-xs font-bold transition flex items-center justify-center gap-1 text-center cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span>Calculator</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => onApplyHP(product)}
            className="w-full py-2 px-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm shadow-red-600/30 cursor-pointer"
          >
            <span>Buy on HP</span>
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
