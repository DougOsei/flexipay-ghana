import React, { useState, useEffect } from 'react';
import { formatGHS, MOMO_PROVIDERS } from '../utils/ghanaConstants';
import ProductCard from '../components/ProductCard';
import { getAppUrl } from '../utils/apiBootstrap';
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Calculator, 
  Store, 
  ShoppingBag, 
  Smartphone, 
  Sparkles, 
  Star, 
  Truck, 
  Lock, 
  ChevronDown, 
  Award, 
  Tv,
  Refrigerator,
  Laptop,
  Bike,
  Sun,
  HelpCircle,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage({ 
  onExploreMarketplace, 
  onSelectProduct, 
  onApplyHP, 
  onGoHowItWorks
}) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Live Financing Simulator state
  const [calcPrice, setCalcPrice] = useState(6000);
  const [calcDepositPct, setCalcDepositPct] = useState(25);
  const [calcTenure, setCalcTenure] = useState(6);
  const [faqOpenIndex, setFaqOpenIndex] = useState(0);

  const depositAmount = (calcPrice * calcDepositPct) / 100;
  const markupRate = calcTenure <= 3 ? 0.08 : calcTenure <= 6 ? 0.12 : calcTenure <= 9 ? 0.16 : 0.20;
  const hpTotalPrice = calcPrice * (1 + markupRate);
  const monthlyRepayment = Math.round((hpTotalPrice - depositAmount) / calcTenure);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch('/api/products?featured=true');
        const data = await res.json();
        if (data.success && data.products) {
          setFeaturedProducts(data.products.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadFeatured();
  }, []);

  const heroSpotlight = featuredProducts.slice(0, 2);

  const categories = [
    {
      id: 'Phones & Tablets',
      name: 'Smartphones & Tablets',
      tagline: 'iPhone 15, Samsung, Tecno',
      depositFrom: 'From GH₵ 190/mo',
      icon: Smartphone,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'Electronics & TV',
      name: 'Smart TVs & Audio',
      tagline: 'Hisense 4K, OLED, Soundbars',
      depositFrom: 'From GH₵ 220/mo',
      icon: Tv,
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'Home Appliances',
      name: 'Home Appliances',
      tagline: 'Fridges, Inverter ACs, Washers',
      depositFrom: 'From GH₵ 180/mo',
      icon: Refrigerator,
      image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'Laptops & Computing',
      name: 'Laptops & Work',
      tagline: 'MacBook, Dell, HP ProBook',
      depositFrom: 'From GH₵ 310/mo',
      icon: Laptop,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'Transport & Logistics',
      name: 'Cargo & Motorbikes',
      tagline: 'Royal Aboboyaa, Delivery',
      depositFrom: 'From GH₵ 850/mo',
      icon: Bike,
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'Power & Solar',
      name: 'Solar & Inverters',
      tagline: 'EcoFlow, Lithium Power',
      depositFrom: 'From GH₵ 420/mo',
      icon: Sun,
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const valueProps = [
    {
      icon: ShieldCheck,
      title: 'Zero Bank Collateral',
      desc: 'No salary advance letters or bank queues. Verify instantly with your Ghana Card & GhanaPost GPS.'
    },
    {
      icon: Smartphone,
      title: 'Pay Small-Small via MoMo',
      desc: 'Flexible weekly or monthly installments paid seamlessly through MTN MoMo, Telecel Cash, or AT Money.'
    },
    {
      icon: Store,
      title: 'Verified Local Showrooms',
      desc: 'Every merchant across Accra, Kumasi, and Takoradi undergoes physical showroom and stock audits.'
    },
    {
      icon: Award,
      title: 'Act 349 Legal Protection',
      desc: 'Regulated under the Ghana Hire-Purchase Act 1974 with transparent contracts and zero hidden fees.'
    }
  ];

  const testimonials = [
    {
      name: 'Kwesi Mensah',
      location: 'Kumasi, Ashanti Region',
      role: 'High School Teacher',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      quote: 'I purchased a 205L Midea Inverter Refrigerator from Kab-Fam with just a 20% deposit. The monthly MoMo prompts are clear and stress-free.'
    },
    {
      name: 'Abena Osei',
      location: 'Osu, Greater Accra',
      role: 'Product Designer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      quote: 'Getting my MacBook Pro on FlexiPay allowed me to scale my design studio immediately. Ghana Card verification took under 3 minutes.'
    },
    {
      name: 'Kofi Boateng',
      location: 'Spintex, Accra',
      role: 'Haulage Business Owner',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      quote: 'We expanded our delivery fleet with two Royal cargo tricycles from Accra Motors. They paid for themselves right from month one.'
    }
  ];

  const faqs = [
    {
      q: 'What do I need to buy on hire purchase?',
      a: 'You only need a valid Ghana Card PIN (GHA-XXXXXXXXX-X), a registered GhanaPost GPS address (e.g., GA-183-9022), an active Mobile Money wallet (MTN MoMo, Telecel Cash, or AT Money), and your 20%–50% upfront deposit.'
    },
    {
      q: 'Can I settle my remaining balance early?',
      a: 'Yes! You can pay off individual installments or your entire remaining balance anytime inside My HP Plans with zero early settlement fees.'
    },
    {
      q: 'How are products delivered after approval?',
      a: 'Once your MoMo deposit clears and the merchant approves your contract, choose either same-day showroom pickup (Accra, Kumasi, Takoradi) or tracked doorstep delivery.'
    },
    {
      q: 'How do I sell my store inventory on FlexiPay?',
      a: 'Visit the FlexiPay Seller Central portal via the link at the top or footer of our site to register your retail showroom, upload stock, and collect instant upfront settlements.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-24 text-slate-900">
      
      {/* 1. EDITORIAL E-COMMERCE HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-red-50/50 to-white border border-red-100/90 p-6 sm:p-10 lg:p-14 shadow-sm">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Editorial Storefront Copy */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/90 text-xs font-extrabold text-red-900"
            >
              <Zap className="w-3.5 h-3.5 text-red-600 fill-red-600" aria-hidden="true" />
              <span>2026 Collection • From 20% Deposit</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-3xl sm:text-5xl lg:text-[3.4rem] font-black text-slate-900 tracking-tight leading-[1.08]"
            >
              Upgrade Your Everyday. <br />
              <span className="text-red-600">Pay Small-Small.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl"
            >
              Shop smartphones, 4K TVs, inverter fridges, MacBooks, and solar stations from Ghana's top verified stores. Split payments over 3–12 months via <strong>MTN MoMo</strong>, <strong>Telecel Cash</strong>, or <strong>AT Money</strong>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onExploreMarketplace('All')}
                className="px-7 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span>Shop All Products</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                href="#estimator"
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-red-600" aria-hidden="true" />
                <span>Estimate Installments</span>
              </motion.a>
            </motion.div>

            {/* Quick Trust Stats */}
            <div className="pt-4 border-t border-slate-200/70 grid grid-cols-3 gap-4 max-w-md">
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900">250+</p>
                <p className="text-[11px] font-semibold text-slate-500">Verified Stores</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900">3 Min</p>
                <p className="text-[11px] font-semibold text-slate-500">Ghana Card Check</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900">12,500+</p>
                <p className="text-[11px] font-semibold text-slate-500">Happy Buyers</p>
              </div>
            </div>
          </div>

          {/* Right Editorial Product Spotlight Showcase */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(heroSpotlight.length > 0 ? heroSpotlight : [
                {
                  id: 'prod_1',
                  title: 'Hisense 55" 4K UHD Smart Frameless TV',
                  cashPrice: 5800,
                  minDownPaymentPercent: 20,
                  vendorName: 'Hisense Ghana Flagship',
                  image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80'
                },
                {
                  id: 'prod_2',
                  title: 'Apple iPhone 15 Pro Max 256GB',
                  cashPrice: 16500,
                  minDownPaymentPercent: 25,
                  vendorName: 'Franko Trading Hub',
                  image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80'
                }
              ]).map((item, idx) => {
                const depPct = item.minDownPaymentPercent || 20;
                const monthly = Math.round(((item.cashPrice * 1.12) * (1 - depPct / 100)) / 6);
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -6 }}
                    onClick={() => onSelectProduct(item)}
                    className={`bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden cursor-pointer group flex flex-col justify-between ${
                      idx === 1 ? 'sm:translate-y-4' : ''
                    }`}
                  >
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                        {depPct}% Deposit
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 truncate">{item.vendorName}</p>
                      <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Pay Small-Small</span>
                          <span className="text-base font-black text-red-600">{formatGHS(monthly)}<span className="text-[10px] font-normal text-slate-500">/mo</span></span>
                        </div>
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                          View
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 2. SHOP BY CATEGORY STRIP */}
      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
              Shop by Department
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Explore Popular Categories
            </h2>
          </div>
          <button
            onClick={() => onExploreMarketplace('All')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Shop All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                whileHover={{ y: -4 }}
                onClick={() => onExploreMarketplace(cat.id)}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-lg hover:border-red-200 transition-all cursor-pointer group flex flex-col"
              >
                <div className="h-28 bg-slate-100 relative overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2.5 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-xs text-red-600 flex items-center justify-center shadow-xs">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
                <div className="p-3.5 space-y-1">
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] font-bold text-red-600">{cat.depositFrom}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS E-COMMERCE GRID */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
              Verified Merchant Picks
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Trending Hire Purchase Deals
            </h2>
          </div>
          <button
            onClick={() => onExploreMarketplace('All')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
                <div className="w-full h-44 rounded-2xl animate-shimmer"></div>
                <div className="h-4 w-3/4 rounded-md animate-shimmer"></div>
                <div className="h-3 w-1/2 rounded-md animate-shimmer"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product, idx) => (
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

      {/* 4. EDITORIAL DUAL PROMOTIONAL BANNERS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onExploreMarketplace('Home Appliances')}
          className="rounded-3xl bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 text-white p-8 flex flex-col justify-between min-h-64 relative overflow-hidden cursor-pointer border border-red-800/40 shadow-lg group"
        >
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2 relative z-10 max-w-md">
            <span className="text-[11px] font-black uppercase tracking-wider text-red-300 bg-white/10 px-2.5 py-1 rounded-full">
              Home &amp; Kitchen Upgrade
            </span>
            <h3 className="text-2xl sm:text-3xl font-black pt-1">
              Inverter Fridges &amp; Smart 4K TVs
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Equip your home with official warranty stock from Hisense and Kab-Fam starting from 20% MoMo deposit.
            </p>
          </div>
          <div className="pt-6 relative z-10">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold text-white bg-red-600 px-4 py-2.5 rounded-xl group-hover:bg-red-500 transition">
              <span>Shop Appliances</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onExploreMarketplace('Transport & Logistics')}
          className="rounded-3xl bg-white text-slate-900 p-8 flex flex-col justify-between min-h-64 relative overflow-hidden cursor-pointer border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
        >
          <div className="space-y-2 relative z-10 max-w-md">
            <span className="text-[11px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
              Commercial &amp; Solar Power
            </span>
            <h3 className="text-2xl sm:text-3xl font-black pt-1">
              Cargo Tricycles &amp; Backup Power
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Scale your delivery fleet or eliminate dumsor with EcoFlow solar stations over 6 to 12 month plans.
            </p>
          </div>
          <div className="pt-6 relative z-10">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold text-white bg-slate-900 px-4 py-2.5 rounded-xl group-hover:bg-red-600 transition-colors">
              <span>Shop Mobility &amp; Solar</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </motion.div>
      </section>

      {/* 5. INTERACTIVE PAY SMALL-SMALL ESTIMATOR */}
      <section id="estimator" className="bg-white rounded-3xl border border-red-100 p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-red-600">
              <Calculator className="w-4 h-4" />
              <span>Plan Simulator</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Calculate Your Monthly Small-Small Plan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Slide to match your budget before applying. Transparent rates with zero hidden bank surcharges, fully compliant with Ghana Hire-Purchase regulations.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              {MOMO_PROVIDERS.map((p) => (
                <span
                  key={p.id}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"
                >
                  {p.shortName}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-7 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-600">Product Cash Value</span>
                  <span className="text-red-600 font-black font-mono">{formatGHS(calcPrice)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="25000"
                  step="500"
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Number(e.target.value))}
                  aria-label="Product cash value"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-600">Upfront Deposit ({calcDepositPct}%)</span>
                  <span className="text-slate-900 font-black font-mono">{formatGHS(depositAmount)}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="50"
                  step="5"
                  value={calcDepositPct}
                  onChange={(e) => setCalcDepositPct(Number(e.target.value))}
                  aria-label="Down payment percentage"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[3, 6, 9, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setCalcTenure(m)}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      calcTenure === m
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-5 bg-white rounded-2xl p-5 border border-red-100 text-center space-y-3 shadow-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Monthly Installment
                </span>
                <span className="text-2xl sm:text-3xl font-black text-red-600 font-mono">
                  {formatGHS(monthlyRepayment)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Total HP: {formatGHS(hpTotalPrice)}
                </span>
              </div>
              <button
                onClick={() => onExploreMarketplace('All')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-xs font-bold transition cursor-pointer"
              >
                Shop Matching Items
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY GHANAIANS TRUST FLEXIPAY */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {valueProps.map((vp, idx) => {
          const Icon = vp.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{vp.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{vp.desc}</p>
            </div>
          );
        })}
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
            Verified Customer Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Loved by Buyers Across Ghana
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{t.name}</h4>
                  <p className="text-[10px] text-slate-500">{t.role} • {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ & MERCHANT CALLOUT */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-3">
          <div className="space-y-1 pb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">FAQ</span>
            <h2 className="text-2xl font-black text-slate-900">Common Buyer Questions</h2>
          </div>

          {faqs.map((faq, idx) => {
            const isOpen = faqOpenIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left font-extrabold text-xs sm:text-sm text-slate-900 hover:text-red-600 transition cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Dedicated Merchant Partner Callout linking to Separate Seller Central */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 text-white rounded-3xl p-7 sm:p-8 border border-red-800/40 space-y-5 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg">
            <Store className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-300">
              For Retail Shop Owners
            </span>
            <h3 className="text-2xl font-black leading-tight">
              Sell on FlexiPay Ghana With Zero Credit Risk
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Manage your store catalog, review customer Ghana Card applications, and receive Mobile Money payouts in our dedicated Seller Central portal.
            </p>
          </div>
          <div className="space-y-2 text-xs font-semibold text-slate-200 pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
              <span>Dedicated Seller Central Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
              <span>Automated MoMo Installment Collection</span>
            </div>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={getAppUrl('vendor/')}
              className="w-full py-3 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black text-center transition flex items-center justify-center gap-2 shadow-md"
            >
              <Store className="w-4 h-4" />
              <span>Open Seller Central Portal</span>
            </a>
            <button
              onClick={onGoHowItWorks}
              className="w-full py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Read Merchant Terms</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
