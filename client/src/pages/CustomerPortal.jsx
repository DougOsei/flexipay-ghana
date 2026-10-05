import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatGHS, formatDate } from '../utils/ghanaConstants';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Smartphone, 
  Sparkles,
  AlertTriangle,
  Receipt,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function CustomerPortal({ onPayInstallment, onViewReceipt }) {
  const { user, showToast } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'PENDING' | 'COMPLETED'
  const [expandedScheduleId, setExpandedScheduleId] = useState(null);

  const loadCustomerData = async () => {
    setLoading(true);
    try {
      const [contractsRes, paymentsRes] = await Promise.all([
        fetch(`/api/contracts?customerId=${user?.id || 'usr_customer_kwesi'}`),
        fetch(`/api/payments?customerId=${user?.id || 'usr_customer_kwesi'}`)
      ]);

      const contractsData = await contractsRes.json();
      const paymentsData = await paymentsRes.json();

      if (contractsData.success) setContracts(contractsData.contracts || []);
      if (paymentsData.success) setPayments(paymentsData.payments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerData();
  }, [user]);

  const filteredContracts = contracts.filter(c => {
    if (activeFilter === 'ACTIVE') return c.status === 'ACTIVE';
    if (activeFilter === 'PENDING') return c.status === 'PENDING_APPROVAL';
    if (activeFilter === 'COMPLETED') return c.status === 'COMPLETED';
    return true;
  });

  const toggleExpandSchedule = (id) => {
    setExpandedScheduleId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Customer Header & Credit Profile Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Ghana National Identity (Ghana Card)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              {user?.name || 'Kwesi Mensah'}'s Small-Small Hub
            </h1>
            <p className="text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Ghana Card: <strong className="font-mono text-red-400">{user?.ghanaCard}</strong></span>
              <span>•</span>
              <span>GPS: <strong className="font-mono text-slate-200">{user?.digitalAddress}</strong></span>
              <span>•</span>
              <span>MoMo: <strong className="font-mono text-red-300">{user?.phone}</strong></span>
            </p>
          </div>

          {/* Credit Score & HP Limit Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-5 text-center shrink-0">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300 block">FlexiCredit Score</span>
              <span className="text-2xl font-black text-red-400">780</span>
              <span className="text-[10px] text-red-300 font-semibold block">Excellent</span>
            </div>
            <div className="h-10 w-px bg-white/20"></div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Available HP Limit</span>
              <span className="text-xl font-black text-red-300">GH₵ 25,000</span>
              <span className="text-[10px] text-slate-300 font-semibold block">Instant Approval</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contracts Tabs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-extrabold text-slate-900">
            My Hire-Purchase Agreements & Plans
          </h2>
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl text-xs font-bold">
            {['ALL', 'ACTIVE', 'PENDING', 'COMPLETED'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg transition capitalize ${
                  activeFilter === filter
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter.toLowerCase()} ({
                  filter === 'ALL' ? contracts.length :
                  contracts.filter(c => filter === 'PENDING' ? c.status === 'PENDING_APPROVAL' : c.status === filter).length
                })
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-500">Retrieving your contracts & schedules...</p>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-base">No Contracts in this category</h4>
            <p className="text-xs text-slate-500">
              Browse products in the marketplace to start a new hire-purchase installment plan.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContracts.map((contract) => {
              const nextDue = contract.installments?.find(i => i.status === 'PENDING');
              const paidCount = contract.installments?.filter(i => i.status === 'PAID').length || 0;
              const totalCount = contract.installments?.length || 1;
              const percentPaid = Math.round((contract.totalPaid / contract.totalHPAmount) * 100);
              const isExpanded = expandedScheduleId === contract.id;

              return (
                <div
                  key={contract.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    
                    {/* Left: Product & Contract Details */}
                    <div className="flex items-start gap-4">
                      <img
                        src={contract.productImage}
                        alt={contract.productTitle}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-slate-100 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500">
                            {contract.contractNumber}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            contract.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                            contract.status === 'COMPLETED' ? 'bg-red-100 text-red-800' :
                            contract.status === 'PENDING_APPROVAL' ? 'bg-red-50 text-red-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {contract.status.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            • Delivered via {contract.vendorName}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                          {contract.productTitle}
                        </h3>

                        {/* Financial Progress Bar */}
                        <div className="pt-2 max-w-md">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500 font-medium">Repayment Progress:</span>
                            <span className="font-bold text-slate-800">
                              {formatGHS(contract.totalPaid)} of {formatGHS(contract.totalHPAmount)} ({percentPaid}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-red-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${percentPaid}%` }}
                            ></div>
                          </div>
                          <span className="text-[11px] text-slate-400 mt-1 block">
                            {paidCount} of {totalCount} installments completed • Outstanding: <strong className="text-slate-800">{formatGHS(contract.outstandingBalance)}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Payment Call To Action */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                      {nextDue && contract.status === 'ACTIVE' ? (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-3 text-left lg:text-right w-full sm:w-auto">
                          <span className="text-[10px] uppercase font-bold text-red-800 block">
                            Next Due: {formatDate(nextDue.dueDate)}
                          </span>
                          <div className="text-lg font-black text-slate-900 mt-0.5">
                            {formatGHS(nextDue.amount)}
                          </div>
                          <button
                            type="button"
                            onClick={() => onPayInstallment(contract, nextDue)}
                            className="mt-2 w-full py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-red-700/20 transition"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Pay Installment via MoMo</span>
                          </button>
                        </div>
                      ) : contract.status === 'COMPLETED' ? (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-center">
                          <span className="text-xs font-bold text-red-800 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-red-600" />
                            Contract Fully Paid Off!
                          </span>
                          <p className="text-[10px] text-red-600 mt-0.5">Full title ownership transferred</p>
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-200 rounded-2xl p-3 text-left lg:text-right">
                          <span className="text-xs font-bold text-red-800 block">Awaiting Vendor Review</span>
                          <p className="text-[10px] text-slate-500 mt-0.5">Merchant is validating Ghana Card</p>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleExpandSchedule(contract.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-800"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          <span>{isExpanded ? 'Hide Schedule' : 'View Schedule'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onViewReceipt(contract)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 underline"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Agreement</span>
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Inline Expandable Schedule Drawer */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-100 animate-in fade-in">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Installment Breakdown & MoMo Payment Schedule
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {contract.installments?.map((inst) => (
                          <div
                            key={inst.installmentNumber}
                            className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                              inst.status === 'PAID'
                                ? 'bg-red-50/70 border-red-200'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900">Installment #{inst.installmentNumber}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                  inst.status === 'PAID' ? 'bg-red-200 text-red-900' : 'bg-red-100 text-red-900'
                                }`}>
                                  {inst.status}
                                </span>
                              </div>
                              <div className="font-black text-slate-900 mt-1">{formatGHS(inst.amount)}</div>
                              <div className="text-[10px] text-slate-500">Due: {formatDate(inst.dueDate)}</div>
                              {inst.transactionRef && (
                                <div className="text-[10px] font-mono text-red-700 mt-0.5 truncate max-w-[150px]">
                                  Ref: {inst.transactionRef}
                                </div>
                              )}
                            </div>

                            {inst.status !== 'PAID' && contract.status === 'ACTIVE' && (
                              <button
                                type="button"
                                onClick={() => onPayInstallment(contract, inst)}
                                className="py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition shadow-sm"
                              >
                                Pay
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Transaction Repayment Ledger */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-red-600" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Recent Mobile Money Repayments
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{payments.length} total payments</span>
        </div>

        {payments.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No payment transactions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white text-slate-600 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Contract Ref</th>
                  <th className="py-2.5 px-3">Payment Type</th>
                  <th className="py-2.5 px-3">Network</th>
                  <th className="py-2.5 px-3">MoMo Reference</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/50">
                    <td className="py-2.5 px-3 text-slate-600">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{p.contractNumber}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700 capitalize">
                      {p.type?.replace('_', ' ')?.toLowerCase()}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{p.method?.replace('_', ' ')}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{p.networkRef}</td>
                    <td className="py-2.5 px-3 font-bold text-red-700 text-right">{formatGHS(p.amount)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
