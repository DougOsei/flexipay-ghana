import React, { useState, useEffect } from 'react';
import HirePurchaseCalculator from '../components/HirePurchaseCalculator';
import { formatGHS } from '../utils/ghanaConstants';
import { 
  ArrowLeft, 
  Store, 
  Star, 
  ShieldCheck, 
  Truck, 
  CheckCircle, 
  MapPin, 
  Phone,
  FileCheck2,
  Lock
} from 'lucide-react';

export default function ProductDetails({ productId, onBack, onApplyHP }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.product);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading product details & financing terms...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center space-y-3">
        <p className="text-sm font-bold text-slate-700">Product not found.</p>
        <button onClick={onBack} className="text-xs text-red-600 font-bold underline">
          Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 transition shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Products</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Media & Specifications & Vendor Profile (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Showcase Image */}
          <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-80 sm:h-96 object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className="bg-red-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                🇬🇭 Hire Purchase Ready
              </span>
            </div>
          </div>

          {/* Description & Specifications */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">About this Product</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features Bullet List */}
            {product.features && product.features.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
                  Key Specifications & Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span className="font-medium leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Vendor Store Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 flex items-center justify-center font-bold text-xl">
                🏪
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{product.vendorName}</h4>
                  <span className="bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-red-600" /> Verified Merchant
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {product.vendorCity}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-red-600 font-bold">
                    <Star className="w-3 h-3 fill-red-300 text-red-300" /> {product.rating} Store Rating
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right w-full sm:w-auto">
              <span className="text-[11px] text-slate-400 block font-medium">Stock Status</span>
              <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                {product.stock} units available in showroom
              </span>
            </div>
          </div>

          {/* Legal Protection Notice */}
          <div className="p-4 bg-red-50/70 border border-red-200/90 rounded-2xl text-xs text-red-900 flex items-start gap-3">
            <FileCheck2 className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Protected by Ghana Hire-Purchase Regulations</span>
              <span className="text-slate-600 leading-relaxed block mt-0.5">
                Every hire-purchase agreement executed on FlexiPay Ghana is backed by statutory consumer protection standards. Down payment is held securely in escrow until goods are delivered.
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Pricing & Interactive Hire Purchase Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          {/* Header Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
              {product.brand}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {product.title}
            </h1>

            <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block">Outright Cash Price</span>
                <span className="text-2xl font-black text-slate-900">{formatGHS(product.cashPrice)}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Financing Markup</span>
                <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                  {product.markupPercent}% Transparent
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator */}
          <HirePurchaseCalculator
            cashPrice={product.cashPrice}
            markupPercent={product.markupPercent}
            minDownPaymentPercent={product.minDownPaymentPercent}
            allowedTenures={product.allowedTenures}
            onApplyPlan={(plan) => onApplyHP(product, plan)}
          />

        </div>

      </div>
    </div>
  );
}
