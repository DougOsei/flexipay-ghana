import React from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  Smartphone, 
  Truck, 
  CheckCircle2, 
  HelpCircle,
  Store,
  FileText
} from 'lucide-react';

export default function HowItWorks({ onGoMarketplace }) {
  const steps = [
    {
      num: "01",
      title: "Find Product & Calculate Plan",
      desc: "Browse phones, home appliances, motorbikes, or electronics from verified merchants in Accra, Kumasi, and Takoradi. Use the interactive calculator to choose your deposit (20%-50%) and repayment tenure (3 to 12 months).",
      icon: <Calculator className="w-6 h-6 text-red-600" />
    },
    {
      num: "02",
      title: "Instant Ghana Card Verification",
      desc: "Provide your Ghana Card PIN (GHA-XXXXXXXXX-X), residential digital address (GhanaPost GPS), and a guarantor contact. Zero complicated paperwork or bank queues required.",
      icon: <ShieldCheck className="w-6 h-6 text-red-600" />
    },
    {
      num: "03",
      title: "Authorize Deposit via Mobile Money",
      desc: "Pay your upfront down payment securely using MTN Mobile Money (*170#), Telecel Cash (*110#), or AT Money. Your deposit is held securely in FlexiPay Escrow.",
      icon: <Smartphone className="w-6 h-6 text-red-600" />
    },
    {
      num: "04",
      title: "Pickup in Showroom or Delivery",
      desc: "Vendor confirms your application and dispatches your item. You can also pick up directly in-store at Circle, Spintex Road, or Adum.",
      icon: <Truck className="w-6 h-6 text-red-700" />
    },
    {
      num: "05",
      title: "Pay Small-Small on Schedule",
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
        <span className="text-xs bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          🇬🇭 Simple & Transparent Financing
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How Hire Purchase Works on FlexiPay Ghana
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Empowering Ghanaian consumers to acquire essential gadgets, home appliances, and mobility equipment without breaking the bank.
        </p>
      </section>

      {/* 5 Step Timeline */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {steps.map((s) => (
          <div
            key={s.num}
            className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between relative group hover:border-red-500 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center">
                  {s.icon}
                </div>
                <span className="text-2xl font-black text-slate-300 font-mono group-hover:text-red-600 transition">
                  {s.num}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-2">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* For Vendors Banner */}
      <section className="bg-gradient-to-r from-red-500 to-red-600 text-slate-950 rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-950/10 text-xs font-bold">
            <Store className="w-3.5 h-3.5" />
            <span>Are you a Merchant or Retailer in Ghana?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            Boost Your Sales by 300% with Installment Offers
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-900/90 leading-relaxed">
            FlexiPay handles customer Ghana Card risk screening, automated MoMo collection prompts, and statutory legal agreements. You supply the goods and collect steady cash flow.
          </p>
        </div>
        <button
          type="button"
          onClick={onGoMarketplace}
          className="py-3 px-6 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm transition shrink-0 shadow-md"
        >
          Explore Marketplace Now
        </button>
      </section>

      {/* FAQs Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-500">Everything you need to know about hire purchase regulations and repayments in Ghana</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
