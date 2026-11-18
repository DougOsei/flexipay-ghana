import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, formatGHS } from '../utils/ghanaConstants';
import { 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2,
  X,
  ShoppingBag,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Marketplace({
  onSelectProduct,
  onApplyHP,
  initialCategory = 'All',
  initialSearch = ''
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [depositOnly20, setDepositOnly20] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch !== undefined && initialSearch !== searchQuery) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

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
        let items = data.products || [];
        if (depositOnly20) {
          items = items.filter((p) => (p.minDownPaymentPercent || 25) <= 20);
        }
        setProducts(items);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, maxPriceFilter, depositOnly20, initialSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMaxPriceFilter('');
    setDepositOnly20(false);
    setSortBy('featured');
  };

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery || maxPriceFilter || depositOnly20;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Compact Modern Storefront Category Header */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Verified Multi-Vendor Storefront</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {selectedCategory === 'All' ? 'All Hire-Purchase Products' : selectedCategory}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare genuine electronics, home appliances, and mobility gear from verified Ghanaian merchants.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-800 px-3 py-1.5 rounded-xl border border-red-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
            <span>From 20% Deposit</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            <span>Ghana Card Verified</span>
          </span>
        </div>
      </section>

      {/* Main E-Commerce Layout: Left Sidebar Filters + Right Catalog Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* DESKTOP LEFT FILTER SIDEBAR */}
        <aside className="hidden lg:block w-64 shrink-0 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
              <Filter className="w-4 h-4 text-red-600" aria-hidden="true" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Category List */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Categories
            </h3>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      active
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Max Price Budget Buckets */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Cash Price Budget
            </h3>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'All Budgets', val: '' },
                { label: 'Under GH₵ 5,000', val: '5000' },
                { label: 'Under GH₵ 10,000', val: '10000' },
                { label: 'Under GH₵ 20,000', val: '20000' }
              ].map((b) => (
                <label
                  key={b.label}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer font-semibold text-slate-700"
                >
                  <input
                    type="radio"
                    name="budget"
                    checked={maxPriceFilter === b.val}
                    onChange={() => setMaxPriceFilter(b.val)}
                    className="accent-red-600 cursor-pointer"
                  />
                  <span>{b.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Deposit Requirement Toggle */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Down Payment Tier
            </h3>
            <label className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={depositOnly20}
                onChange={(e) => setDepositOnly20(e.target.checked)}
                className="accent-red-600 rounded cursor-pointer"
              />
              <span>20% Low Deposit Only</span>
            </label>
          </div>
        </aside>

        {/* RIGHT CATALOG WORKSPACE */}
        <div className="flex-1 w-full space-y-5">
          
          {/* Toolbar: Search + Item Count + Sort */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, or stores..."
                className="w-full pl-10 pr-20 py-2 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search query"
                  onClick={() => { setSearchQuery(''); }}
                  className="absolute right-16 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Go
              </button>
            </form>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-xs font-semibold text-slate-500">
                <strong className="text-slate-900">{products.length}</strong> items
              </span>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Category Pills (visible below lg) */}
          <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Active:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-800 font-bold px-2.5 py-1 rounded-lg border border-red-200">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} aria-label="Remove category filter" className="cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {maxPriceFilter && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                  Under {formatGHS(Number(maxPriceFilter))}
                  <button onClick={() => setMaxPriceFilter('')} aria-label="Remove budget filter" className="cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {depositOnly20 && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                  20% Deposit
                  <button onClick={() => setDepositOnly20(false)} aria-label="Remove deposit filter" className="cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetAllFilters}
                className="text-red-600 font-bold hover:underline ml-1 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear all
              </button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-3xl border border-slate-200/80 p-4 space-y-4">
                  <div className="h-48 w-full rounded-2xl animate-shimmer"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded-lg animate-shimmer"></div>
                    <div className="h-3 w-1/2 rounded-lg animate-shimmer"></div>
                  </div>
                  <div className="h-16 w-full rounded-2xl animate-shimmer"></div>
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
                onClick={resetAllFilters}
                className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-600/30 transition cursor-pointer"
              >
                Reset All Filters
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
        </div>
      </div>

    </div>
  );
}
