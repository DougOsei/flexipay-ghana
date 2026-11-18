import React, { useState, useEffect } from 'react';
import { formatGHS, MOMO_PROVIDERS } from '../utils/ghanaConstants';
import { 
  ArrowRight, 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle2, 
  Calculator, 
  Store, 
  ShoppingBag, 
  Smartphone, 
  Sparkles, 
  Star, 
  Truck, 
  CreditCard, 
  Lock, 
  Clock, 
  Layers, 
  ChevronRight, 
  ChevronDown, 
  Zap, 
  Award, 
  TrendingUp, 
  Percent, 
  PhoneCall,
  Tv,
  Refrigerator,
  Laptop,
  Bike,
  Sun,
  BadgeCheck,
  Building2,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage({ 
  onExploreMarketplace, 
  onSelectProduct, 
  onApplyHP, 
  onGoHowItWorks,
  onBecomeVendor 
}) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Live Hero Calculator state
  const [calcPrice, setCalcPrice] = useState(6000);
  const [calcDepositPct, setCalcDepositPct] = useState(25);
  const [calcTenure, setCalcTenure] = useState(6);
  const [faqOpenIndex, setFaqOpenIndex] = useState(0);

  // Calculations
  const depositAmount = (calcPrice * calcDepositPct) / 100;
  const markupRate = calcTenure <= 3 ? 0.08 : calcTenure <= 6 ? 0.12 : calcTenure <= 9 ? 0.16 : 0.20;
  const hpTotalPrice = calcPrice * (1 + markupRate);
  const remainingPrincipal = hpTotalPrice - depositAmount;
  const monthlyRepayment = Math.round(remainingPrincipal / calcTenure);

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

  const categories = [
    {
      id: 'Phones & Tablets',
      name: 'Smartphones & Tablets',
      tagline: 'iPhone, Samsung, Tecno, iPad',
      depositFrom: 'From GH₵ 190 / mo',
      count: '48 items',
      icon: Smartphone,
      gradient: 'from-red-500/10 to-red-600/5',
      accentColor: 'text-red-600',
      borderColor: 'border-red-200/80',
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'Electronics & TV',
      name: 'Electronics & Smart TVs',
      tagline: '4K UHD, OLED, Soundbars',
      depositFrom: 'From GH₵ 220 / mo',
      count: '36 items',
      icon: Tv,
      gradient: 'from-red-600/10 to-slate-900/5',
      accentColor: 'text-red-700',
      borderColor: 'border-red-200/80',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'Home Appliances',
      name: 'Home Appliances',
      tagline: 'Refrigerators, Inverter ACs, Washers',
      depositFrom: 'From GH₵ 180 / mo',
      count: '54 items',
      icon: Refrigerator,
      gradient: 'from-slate-900/10 to-red-600/5',
      accentColor: 'text-slate-900',
      borderColor: 'border-slate-200',
      image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'Laptops & Computing',
      name: 'Laptops & Workstations',
      tagline: 'MacBook, Dell, HP, ThinkPad',
      depositFrom: 'From GH₵ 310 / mo',
      count: '29 items',
      icon: Laptop,
      gradient: 'from-red-500/10 to-red-700/5',
      accentColor: 'text-red-600',
      borderColor: 'border-red-200/80',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'Transport & Logistics',
      name: 'Transport & Motorbikes',
      tagline: 'Cargo Tricycles (Aboboyaa), Bikes',
      depositFrom: 'From GH₵ 850 / mo',
      count: '18 items',
      icon: Bike,
      gradient: 'from-red-700/10 to-red-800/5',
      accentColor: 'text-red-800',
      borderColor: 'border-red-200/80',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'Power & Solar',
      name: 'Solar & Backup Inverters',
      tagline: 'Lithium Power Stations, Panels',
      depositFrom: 'From GH₵ 420 / mo',
      count: '22 items',
      icon: Sun,
      gradient: 'from-amber-500/10 to-red-600/5',
      accentColor: 'text-amber-700',
      borderColor: 'border-amber-200/80',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const valueProps = [
    {
      icon: ShieldCheck,
      title: 'Zero Bank Collateral',
      desc: 'No lengthy salary advance letters or bank guarantor queues. Instant verification with your valid Ghana Card & GhanaPost GPS address.'
    },
    {
      icon: Smartphone,
      title: 'Automated MoMo Repayments',
      desc: 'Seamless scheduled installment deductions via MTN Mobile Money, Telecel Cash, or AT Money with zero hidden service fees.'
    },
    {
      icon: Store,
      title: '100% Verified Local Merchants',
      desc: 'All merchants in Circle, Osu, Makola, Kumasi Adum, and Takoradi undergo strict physical showroom and stock audits.'
    },
    {
      icon: Award,
      title: 'Statutory Hire-Purchase Law',
      desc: 'Full regulatory compliance with the Hire-Purchase Act 1974 (Act 349). You are protected by clear statutory contracts and the 70% equity rule.'
    }
  ];

  const testimonials = [
    {
      name: 'Kwesi Mensah',
      location: 'Kumasi, Ashanti Region',
      role: 'High School Teacher',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      quote: 'I purchased a 205L Midea Inverter Refrigerator from Kab-Fam with just a 20% deposit. The monthly MoMo prompts are clear, and I didn\'t have to deplete my monthly savings.',
      item: 'Midea 205L Refrigerator'
    },
    {
      name: 'Abena Osei',
      location: 'Osu, Greater Accra',
      role: 'UX Designer & Freelancer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      quote: 'Getting my MacBook Pro on FlexiPay allowed me to scale my freelance design studio immediately. The digital Ghana Card verification took under 3 minutes.',
      item: 'MacBook Pro 14" M3'
    },
    {
      name: 'Kofi Boateng',
      location: 'Spintex, Accra',
      role: 'Haulage Business Owner',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      quote: 'We expanded our logistics fleet with two Royal 200cc cargo tricycles from Accra Motors. They started generating daily revenue right from week one.',
      item: 'Royal 200cc Aboboyaa'
    }
  ];

  const faqs = [
    {
      q: 'What do I need to qualify for hire purchase on FlexiPay Ghana?',
      a: 'To apply, you need: 1) A valid Ghana Card PIN (GHA-XXXXXXXXX-X), 2) A registered digital address (GhanaPost GPS, e.g., GA-183-9022), 3) An active Mobile Money wallet (MTN MoMo, Telecel Cash, or AT Money), and 4) Down payment funds for your 20%-50% initial deposit.'
    },
    {
      q: 'Can I pay off my remaining balance early?',
      a: 'Yes, absolutely! FlexiPay Ghana encourages early settlements. You can pay off your remaining balance anytime through your Customer Portal via MoMo without any early payment penalties or surprise charges.'
    },
    {
      q: 'How does the Hire-Purchase Act of Ghana (Act 349) protect me?',
      a: 'Under the Hire-Purchase Act 1974, once you have paid at least 70% of the total hire-purchase price, the merchant cannot repossess the goods without a court order, even if you run into temporary financial distress. You also receive a legally binding printed agreement and payment schedule.'
    },
    {
      q: 'How do repayments work with Mobile Money?',
      a: 'On your scheduled payment dates (monthly, bi-weekly, or weekly), you will receive an automatic prompt or payment request on your phone. Simply enter your MoMo PIN to authorize the installment. You can also manually trigger payments anytime from your dashboard.'
    },
    {
      q: 'How do I receive my item after paying the down payment?',
      a: 'Once your 20% down payment is confirmed via MoMo and the merchant approves the agreement, you can either pick up the item immediately at the merchant showroom (Circle, Osu, Adum, etc.) or choose doorstep dispatch with real-time delivery status updates.'
    },
    {
      q: 'I am a retail store owner. How do I sell on FlexiPay?',
      a: 'Click "Open a Merchant Store" or switch to the Vendor role. Register your registered business name, store digital address (GPS), and MoMo settlement wallet. Once vetted, you can upload your inventory and start receiving customers across Ghana.'
    }
  ];

  return (
    <div className="space-y-20 pb-24 text-slate-900">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-4 sm:pt-8 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-red-100/60 via-red-50/20 to-transparent pointer-events-none rounded-3xl -z-10 blur-2xl"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Hero Left Column: Core Value & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Header */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/90 shadow-2xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
              <span className="text-xs font-bold text-red-900 tracking-wide">
                Ghana's Regulated Hire Purchase &amp; BNPL Network
              </span>
            </motion.div>

            {/* High-Impact Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]"
            >
              Own What You Need Today. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-700 to-red-800">
                Pay Small-Small
              </span> With Peace of Mind.
            </motion.h1>

            {/* Narrative Subhead */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed"
            >
              Acquire authentic smartphones, home appliances, laptops, solar power, and commercial tricycles from verified merchants in Accra, Kumasi, and Takoradi. Split costs into flexible installments using <strong>MTN MoMo</strong>, <strong>Telecel Cash</strong>, or <strong>AT Money</strong>.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onExploreMarketplace('All')}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white font-black text-sm shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 transition flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGoHowItWorks}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200/90 shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>How Financing Works</span>
              </motion.button>
            </motion.div>

            {/* Live Trust Metrics Ticker */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg"
            >
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900">GH₵ 4.8M+</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Financed Safely</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900">12,500+</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Ghanaian Buyers</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900">250+</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Verified Stores</p>
              </div>
            </motion.div>

          </div>

          {/* Hero Right Column: Interactive Live HP Calculator Preview */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-red-100/90 shadow-xl shadow-red-950/5 relative overflow-hidden"
            >
              {/* Badge top */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Instant Repayment Estimator</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Test any product budget live</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase bg-red-100 text-red-800 px-2.5 py-1 rounded-full">
                  Live Calculator
                </span>
              </div>

              {/* Slider 1: Product Value */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Item Value:</span>
                  <span className="text-sm font-black text-red-600 font-mono">{formatGHS(calcPrice)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="25000"
                  step="500"
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>GH₵ 1,000</span>
                  <span>GH₵ 25,000</span>
                </div>
              </div>

              {/* Slider 2: Down Payment */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Upfront Deposit ({calcDepositPct}%):</span>
                  <span className="text-sm font-black text-slate-900 font-mono">{formatGHS(depositAmount)}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="50"
                  step="5"
                  value={calcDepositPct}
                  onChange={(e) => setCalcDepositPct(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>20% (Minimum)</span>
                  <span>50% (Lower Monthly)</span>
                </div>
              </div>

              {/* Tenure Selection */}
              <div className="mt-4">
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Repayment Duration:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 6, 9, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setCalcTenure(m)}
                      className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        calcTenure === m
                          ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/30'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Highlight Box */}
              <div className="mt-5 bg-gradient-to-br from-red-50 to-slate-50 rounded-2xl p-4 border border-red-100 text-center space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Estimated Monthly Installment
                </span>
                <div className="text-3xl font-black text-red-600 font-mono tracking-tight">
                  {formatGHS(monthlyRepayment)} <span className="text-xs font-semibold text-slate-500">/ mo</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Total HP Cost: <strong className="text-slate-800">{formatGHS(hpTotalPrice)}</strong> • Payable via MoMo
                </p>
              </div>

              {/* Find Products button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onExploreMarketplace('All')}
                className="mt-5 w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Browse Products In This Price Range</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. OFFICIAL TRUST & PAYMENT ECOSYSTEM BAR */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-red-600">
              Trusted Local Infrastructure
            </h3>
            <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
              Integrated with Ghana's Official Mobile Money &amp; Identity Networks
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit Encrypted Transactions</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6">
          {MOMO_PROVIDERS.map((provider) => (
            <div 
              key={provider.id} 
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-red-200 transition"
            >
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shadow-2xs shrink-0"
                style={{ backgroundColor: provider.color, color: provider.textColor }}
              >
                {provider.iconText}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate">{provider.shortName}</p>
                <p className="text-[10px] text-slate-500 font-mono">{provider.ussd}</p>
              </div>
            </div>
          ))}

          {/* Ghana Card Integration */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-red-200 transition">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center text-xs font-black shadow-2xs shrink-0">
              NIA
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">Ghana Card PIN</p>
              <p className="text-[10px] text-slate-500 font-mono">GHA-Verified</p>
            </div>
          </div>

          {/* GhanaPost GPS */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-red-200 transition">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-2xs shrink-0">
              GPS
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">GhanaPost GPS</p>
              <p className="text-[10px] text-slate-500 font-mono">Digital Address</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES SHOWCASE */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
              Curated Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Popular Hire Purchase Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select any category to view available products and installment plans
            </p>
          </div>
          <button
            onClick={() => onExploreMarketplace('All')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => onExploreMarketplace(cat.id)}
                className={`bg-white rounded-3xl p-6 border ${cat.borderColor} shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-red-50 ${cat.accentColor} flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-red-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    {cat.tagline}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-red-600 font-mono">
                    {cat.depositFrom}
                  </span>
                  <span className="font-bold text-slate-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Browse</span>
                    <ArrowRight className="w-3.5 h-3.5 text-red-600" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. TRENDING HIRE PURCHASE PICKS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
              Verified Merchant Stock
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Trending Hire Purchase Deals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top requested items with instant Ghana Card approvals and flexible MoMo payments
            </p>
          </div>
          <button
            onClick={() => onExploreMarketplace('All')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
          >
            <span>See Entire Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-5 border border-slate-200 animate-pulse space-y-3">
                <div className="w-full h-44 bg-slate-100 rounded-2xl"></div>
                <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => {
              const deposit = (product.cashPrice * (product.minDownPaymentPercent || 20)) / 100;
              const tenure = product.allowedTenures?.[0] || 6;
              const monthly = Math.round(((product.cashPrice * 1.12) - deposit) / tenure);

              return (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  <div className="relative h-44 overflow-hidden bg-slate-50">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold bg-slate-900/85 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {product.category}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                        {product.minDownPaymentPercent}% Deposit
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1">
                        <Store className="w-3 h-3 text-red-600" />
                        <span className="truncate">{product.vendorName}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {product.title}
                      </h4>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Pay From:</span>
                        <span className="font-black text-red-600 font-mono text-sm">
                          {formatGHS(monthly)} <span className="text-[10px] font-normal text-slate-400">/ mo</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Down Payment:</span>
                        <span className="font-bold text-slate-800 font-mono">{formatGHS(deposit)}</span>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onApplyHP(product);
                        }}
                        className="w-full py-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white font-bold text-xs transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Apply For HP Plan</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. WHY GHANAIANS CHOOSE FLEXIPAY (VALUE PILLARS) */}
      <section className="bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-red-800/40 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl space-y-2 mb-10">
          <span className="text-xs uppercase font-extrabold text-red-400 tracking-wider">
            Consumer Empowerment
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Designed Specifically for the Ghanaian Way of Living
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            We removed the bureaucracy of commercial banks and the predatory traps of informal moneylenders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((vp, idx) => {
            const Icon = vp.icon;
            return (
              <div 
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-red-600/30 border border-red-500/40 text-red-400 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-white mb-2">
                  {vp.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {vp.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. 3-STEP SEAMLESS JOURNEY */}
      <section className="space-y-10 text-center max-w-4xl mx-auto">
        <div className="space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
            How Simple It Is
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            From Selection to Ownership in 3 Easy Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Zero paperwork, zero delays. Start using your item while paying small-small over 3 to 12 months.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs relative">
            <span className="text-4xl font-black text-red-100 absolute top-5 right-5 font-mono">01</span>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold mb-4">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-2">
              Select Your Product &amp; Tenure
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse genuine items from verified merchants. Use our live calculator to pick your down payment (20%-50%) and repayment duration.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs relative">
            <span className="text-4xl font-black text-red-100 absolute top-5 right-5 font-mono">02</span>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-2">
              Quick Ghana Card Check &amp; Deposit
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verify your identity instantly with your Ghana Card PIN. Authorize your 20% down payment directly via the MTN MoMo or Telecel prompt.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs relative">
            <span className="text-4xl font-black text-red-100 absolute top-5 right-5 font-mono">03</span>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold mb-4">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-2">
              Take Delivery &amp; Pay Small-Small
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pick up at the merchant's physical shop or enjoy doorstep dispatch. Pay remaining installments on your chosen schedule.
            </p>
          </div>

        </div>

        <div className="pt-2">
          <button
            onClick={onGoHowItWorks}
            className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>Read full statutory guidelines &amp; FAQ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 7. REAL CUSTOMER REVIEWS (SOCIAL PROOF) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
            Real Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Trusted by Buyers Across Ghana
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Here is what everyday professionals, creatives, and business owners have to say about FlexiPay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-5"
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

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
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
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. MERCHANT PARTNERSHIP SECTION */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
              For Retailers &amp; Distributors
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Grow Your Retail Turnover by Up to 3.5x With Zero Default Risk
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-normal">
              Eliminate customer budget barriers. FlexiPay handles hire-purchase contracts, customer Ghana Card verification, and automated MoMo installment collection so you can focus on inventory and sales.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                <span>Instant MoMo Settlements</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                <span>Zero Default Risk on Goods</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                <span>Custom Vendor Dashboard</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBecomeVendor}
              className="w-full py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Register Merchant Store</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGoHowItWorks}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Merchant Guidelines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* 9. INTERACTIVE FAQ ACCORDION */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Everything You Need to Know
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Clear, transparent answers on eligibility, early repayment, and consumer protections.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpenIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-extrabold text-xs sm:text-sm text-slate-900 hover:text-red-600 transition cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-red-600' : ''}`} />
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
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. HIGH-IMPACT FINAL CTA */}
      <section className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-red-600/20 text-center space-y-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Today With 20% Deposit</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ready to Upgrade Your Life &amp; Business?
          </h2>
          <p className="text-xs sm:text-base text-red-100 max-w-lg mx-auto leading-relaxed">
            Join thousands of smart Ghanaians enjoying the products they deserve without draining their bank accounts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onExploreMarketplace('All')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-red-700 font-black text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-red-700" />
              <span>Browse Marketplace Now</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBecomeVendor}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-red-900/40 hover:bg-red-900/60 text-white font-bold text-sm border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Partner as a Merchant</span>
            </motion.button>
          </div>
        </div>
      </section>

    </div>
  );
}
