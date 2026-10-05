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
  CheckCircle2
} from 'lucide-react';

export default function Marketplace({ onSelectProduct, onApplyHP }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');

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
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-900 via-red-800 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-red-700/40">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-red-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 rounded-full bg-red-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-red-200 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-300 animate-pulse"></span>
            🇬🇭 Ghana's Leading Multi-Vendor Hire Purchase Hub
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Buy Quality Goods Today. <br className="hidden sm:inline" />
            <span className="text-red-300 underline decoration-red-500/50">Pay Small-Small</span> with Ease.
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-2xl">
            Find the latest smartphones, appliances, electronics, laptops, and motorbikes from trusted Ghanaian merchants. Flexible installment plans paid seamlessly via <strong>MTN MoMo</strong>, <strong>Telecel Cash</strong>, or card.
          </p>

          {/* Quick value props */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-red-400" />
              <span>Low 20% Deposit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-red-300" />
              <span>Instant Ghana Card Approval</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-red-400" />
              <span>Repay via MTN MoMo / Telecel</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Category Filters Bar */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Hisense TV, iPhone 15, Refrigerator, Apsonic..."
              className="w-full pl-10 pr-24 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
            >
              Search
            </button>
          </form>

          {/* Sorter */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
            >
              <option value="featured">Featured Picks</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-red-700 text-white shadow-md shadow-red-700/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section>
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-500">Loading verified Ghana marketplace products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">No Products Found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search terms or switch categories to view other hire-purchase items.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="py-2 px-4 rounded-xl bg-red-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onApplyHP={onApplyHP}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Escrow Guarantee Footer Block */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Ghana Card Verified</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Safe legal contracts under the Hire-Purchase Act of Ghana. Transparent interest rates with no surprise penalties.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-800 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Mobile Money Native</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Pay deposits and weekly/monthly installments directly from your MTN MoMo, Telecel Cash, or AT Money balance.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Store Pickup or Delivery</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Collect in-person from verified merchant showrooms in Circle, Spintex, Adum, or opt for doorstep dispatch.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
