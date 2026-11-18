import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, formatGHS } from '../utils/ghanaConstants';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Zap, 
  Truck, 
  RotateCcw, 
  CheckCircle2,
  X,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Marketplace({ onSelectProduct, onApplyHP, initialCategory = 'All' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');

  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/products?`;
      if (selectedCategory && selectedCategory !== 'All') {
        url += `category=${encodeURIComponent(selectedCategory)}&`;
      }
      if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}&`;
      }
      if (maxPriceFilter) {
        url += `maxPrice=${maxPriceFilter}&`;
      }
      if (sortBy === 'price_asc') url += `sort=price_asc&`;
      if (sortBy === 'price_desc') url += `sort=price_desc&`;
      if (sortBy === 'rating') url += `sort=rating&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Banner Section with subtle floating particle glow */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950 via-red-900 to-slate-950 text-white p-6 sm:p-10 shadow-2xl border border-red-700/50"
      >
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-red-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 rounded-full bg-red-600/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-red-200 mb-4 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-red-300" aria-hidden="true" />
            <span>Ghana's Trusted Multi-Vendor Hire Purchase Hub</span>
          </motion.div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Buy Quality Goods Today. <br className="hidden sm:inline" />
            <span className="text-red-300 underline decoration-red-500/50 decoration-wavy underline-offset-4">Pay Small-Small</span> with Ease.
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-2xl">
            Find the latest smartphones, appliances, laptops, and motorbikes from verified Ghanaian merchants. Flexible installment plans paid seamlessly via <strong>MTN MoMo</strong>, <strong>Telecel Cash</strong>, or card.
          </p>

          {/* Quick value props */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-red-400" />
              <span>Low 20% Deposit</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-red-300" />
              <span>Instant Ghana Card Approval</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-red-400" />
              <span>Repay via MTN MoMo / Telecel</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Search and Category Filters Bar */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Form with Clear Button */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Hisense TV, iPhone 15, Refrigerator, Apsonic..."
              className="w-full pl-10 pr-24 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/70 focus:border-red-500 shadow-xs transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); fetchProducts(); }}
                className="absolute right-20 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm shadow-red-600/30"
            >
              Search
            </motion.button>
          </form>

          {/* Sorter */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-xs cursor-pointer"
            >
              <option value="featured">Featured Picks</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills Slider with animated active layout */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(cat)}
                className={`relative whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                  isSelected ? 'text-white' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-red-600 rounded-xl shadow-md shadow-red-600/25 -z-0"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Product Grid / Shimmer Loading / Empty State */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-4 space-y-4 shadow-xs">
                <div className="h-48 rounded-2xl animate-shimmer"></div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded-md animate-shimmer"></div>
                  <div className="h-3 w-1/2 rounded-md animate-shimmer"></div>
                </div>
                <div className="h-16 rounded-xl animate-shimmer"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-9 rounded-xl animate-shimmer"></div>
                  <div className="h-9 rounded-xl animate-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Search className="w-8 h-8 text-red-500" aria-hidden="true" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">No Products Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No hire-purchase items match your selected filters. Try searching for something else or reset to browse all categories.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-600/30 transition cursor-pointer"
            >
              Reset All Filters
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                index={idx}
                onSelectProduct={onSelectProduct}
                onApplyHP={onApplyHP}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Escrow Guarantee Footer Block */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
        <motion.div whileHover={{ y: -3 }} className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-red-50/50 transition">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Ghana Card Verified</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Legally compliant under the Hire-Purchase Act of Ghana (1974). Straightforward terms with zero surprise penalties.
            </p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-red-50/50 transition">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 shadow-2xs">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Mobile Money Native</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Pay deposits and weekly/monthly installments directly from your MTN MoMo (*170#), Telecel Cash (*110#), or AT Money.
            </p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-red-50/50 transition">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Store Pickup or Delivery</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Pick up at merchant showrooms in Circle, Spintex Road, or Adum Kumasi, or request fast doorstep courier delivery.
            </p>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
