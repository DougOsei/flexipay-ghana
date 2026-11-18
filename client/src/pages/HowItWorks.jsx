import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  Smartphone, 
  Truck, 
  CheckCircle2, 
  HelpCircle,
  Store,
  FileText,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HowItWorks({ onGoMarketplace }) {
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    {
      num: "01",
      title: "Find Product & Plan",
      desc: "Browse phones, home appliances, motorbikes, or electronics from verified merchants in Accra, Kumasi, and Takoradi. Use the interactive calculator to choose your deposit (20%-50%) and repayment tenure (3 to 12 months).",
      icon: <Calculator className="w-6 h-6 text-red-600" />
    },
    {
      num: "02",
      title: "Ghana Card ID Check",
      desc: "Provide your Ghana Card PIN (GHA-XXXXXXXXX-X), residential digital address (GhanaPost GPS), and a guarantor contact. Zero complicated paperwork or bank queues required.",
      icon: <ShieldCheck className="w-6 h-6 text-red-600" />
    },
    {
      num: "03",
      title: "Authorize MoMo Deposit",
      desc: "Pay your upfront down payment securely using MTN Mobile Money (*170#), Telecel Cash (*110#), or AT Money. Your deposit is held securely in FlexiPay Escrow.",
      icon: <Smartphone className="w-6 h-6 text-red-600" />
    },
    {
      num: "04",
      title: "Pickup or Delivery",
      desc: "Vendor confirms your application and dispatches your item. You can also pick up directly in-store at Circle, Spintex Road, or Adum.",
      icon: <Truck className="w-6 h-6 text-red-600" />
    },
    {
      num: "05",
      title: "Pay Small-Small",
      desc: "Receive friendly SMS / WhatsApp reminders before each due date. Pay your monthly installment with 1 tap from your MoMo wallet. Settle early for a 5% bonus discount!",
      icon: <CheckCircle2 className="w-6 h-6 text-red-600" />
    }
  ];

  const faqs = [
    {
      q: "What is Hire Purchase and how is it different from an outright cash buy?",
      a: "With hire purchase, you pay a small upfront deposit (usually 20% to 30%) and take the product home immediately. You then pay the remaining balance in affordable weekly or monthly installments over 3 to 12 months."
    },
    {
      q: "Which Mobile Money networks can I use for payments?",
      a: "FlexiPay Ghana directly integrates with MTN MoMo, Telecel Cash (formerly Vodafone Cash), and AT Money (AirtelTigo). You can also use Visa, Mastercard, or GhQR."
    },
    {
      q: "What documents do I need to qualify for hire purchase?",
      a: "Under the Hire-Purchase Act of Ghana, you need: 1) A valid Ghana Card PIN, 2) A GhanaPost GPS Digital Address, and 3) A verifiable guarantor phone number."
    },
    {
      q: "How do vendors get their money?",
      a: "When a customer pays the deposit, it goes into FlexiPay Escrow. As customer installment repayments arrive via Mobile Money, the vendor can instantly request payouts directly to their MTN MoMo Merchant or Telecel Cash wallet."
    },
    {
      q: "Can I pay off my remaining balance early?",
      a: "Yes! If you settle your remaining installments early, FlexiPay Ghana offers an automatic 5% early settlement discount on your outstanding balance."
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 text-xs bg-red-100 text-red-900 border border-red-200 font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-2xs"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-red-700" aria-hidden="true" />
          <span>Simple &amp; Transparent Financing</span>
        </motion.span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          How Hire Purchase Works on <span className="text-red-600">FlexiPay Ghana</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Empowering Ghanaian consumers to acquire essential gadgets, home appliances, and mobility equipment without breaking the bank.
        </p>
      </section>

      {/* 5 Step Timeline with Hover Motion Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {steps.map((s, idx) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between relative group hover:border-red-300 hover:shadow-xl transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shadow-2xs">
                  {s.icon}
                </div>
                <span className="text-2xl font-black text-slate-300 font-mono group-hover:text-red-600 transition-colors">
                  {s.num}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-2 group-hover:text-red-700 transition-colors">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* For Vendors Banner */}
      <motion.section 
        whileHover={{ scale: 1.005 }}
        className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-red-500/40"
      >
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-red-100 backdrop-blur-sm border border-white/20">
            <Store className="w-3.5 h-3.5" />
            <span>Are you a Merchant or Retailer in Ghana?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Boost Your Sales by 300% with Installment Offers
          </h2>
          <p className="text-xs sm:text-sm font-normal text-red-100/90 leading-relaxed">
            FlexiPay handles customer Ghana Card risk screening, automated MoMo collection prompts, and statutory legal agreements. You supply the goods and collect steady cash flow.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onGoMarketplace}
          className="py-3 px-6 rounded-2xl bg-white hover:bg-slate-50 text-red-700 font-black text-sm transition shrink-0 shadow-lg"
        >
          Explore Marketplace Now
        </motion.button>
      </motion.section>

      {/* FAQs Section with Animated Accordions */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-500">Everything you need to know about hire purchase regulations and repayments in Ghana</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <motion.div 
                key={i} 
                onClick={() => setOpenFaq(isOpen ? null : i)}
                className="p-5 bg-slate-50/70 hover:bg-red-50/30 rounded-2xl border border-slate-200/80 cursor-pointer transition-all space-y-2 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-red-600' : ''}`} />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
