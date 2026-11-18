import React from 'react';
import { formatGHS, formatDate } from '../utils/ghanaConstants';
import { X, Printer, ShieldCheck, CheckCircle2, Clock, MapPin, Phone, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContractReceiptModal({ contract, onClose }) {
  if (!contract) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/75 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 450, damping: 32 }}
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-6"
      >
        
        {/* Modal Top Actions */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-lg">📜</span>
            <span className="font-bold text-sm sm:text-base">Official Hire-Purchase Agreement & Schedule</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Agreement</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible">
          
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-slate-900">FlexiPay<span className="text-red-600">GH</span></span>
                <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                  🇬🇭 Verified Contract
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Hire-Purchase Act of Ghana (Act 1974) Statutory Agreement</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] uppercase font-bold text-slate-400 block">Contract Agreement No:</span>
              <span className="text-base font-black font-mono text-red-800">{contract.contractNumber}</span>
              <span className="text-xs text-slate-500 block mt-0.5">Date: {formatDate(contract.createdAt)}</span>
            </div>
          </div>

          {/* Status Alert Banner */}
          <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Contract Status:</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                contract.status === 'COMPLETED' ? 'bg-red-100 text-red-800' :
                contract.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                contract.status === 'PENDING_APPROVAL' ? 'bg-red-50 text-red-800' :
                'bg-slate-100 text-slate-700'
              }`}>
                {contract.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Delivery Status:</span>
              <span className="font-semibold text-slate-600 capitalize">
                {contract.deliveryStatus?.replace('_', ' ')?.toLowerCase() || 'Delivered'}
              </span>
            </div>
          </div>

          {/* Parties Involved Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Buyer Info */}
            <div className="p-4 bg-white/80 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-200 pb-2">
                <UserCheck className="w-4 h-4 text-red-600" />
                <span>Customer / Hirer Information</span>
              </div>
              <p><strong>Name:</strong> {contract.customerName}</p>
              <p><strong>Phone:</strong> {contract.customerPhone}</p>
              <p><strong>Ghana Card:</strong> <span className="font-mono">{contract.customerGhanaCard}</span></p>
              <p><strong>Digital Address:</strong> {contract.customerAddress}</p>
              <p><strong>Guarantor:</strong> {contract.guarantorName} ({contract.guarantorPhone})</p>
            </div>

            {/* Vendor Info */}
            <div className="p-4 bg-white/80 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-200 pb-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Vendor / Merchant Information</span>
              </div>
              <p><strong>Store Name:</strong> {contract.vendorName}</p>
              <p><strong>Product:</strong> {contract.productTitle}</p>
              <p><strong>Outright Cash Price:</strong> {formatGHS(contract.cashPrice)}</p>
              <p><strong>Hire Purchase Total:</strong> {formatGHS(contract.totalHPAmount)}</p>
              <p><strong>Deposit Paid:</strong> <span className="text-red-700 font-bold">{formatGHS(contract.downPaymentAmount)}</span></p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gradient-to-r from-red-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Total HP Value</span>
                <span className="text-base sm:text-lg font-bold text-white">{formatGHS(contract.totalHPAmount)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Deposit Paid</span>
                <span className="text-base sm:text-lg font-bold text-red-400">{formatGHS(contract.downPaymentAmount)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Total Repaid</span>
                <span className="text-base sm:text-lg font-bold text-red-300">{formatGHS(contract.totalPaid)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Outstanding Balance</span>
                <span className="text-base sm:text-lg font-bold text-slate-100">{formatGHS(contract.outstandingBalance)}</span>
              </div>
            </div>
          </div>

          {/* Full Schedule Table */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-2">Installment Repayment Ledger</h4>
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">MoMo Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contract.installments?.map((inst) => (
                    <tr key={inst.installmentNumber} className={inst.status === 'PAID' ? 'bg-red-50/40' : ''}>
                      <td className="py-2.5 px-3 font-bold text-slate-800">#{inst.installmentNumber}</td>
                      <td className="py-2.5 px-3 text-slate-600">{inst.dueDate}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{formatGHS(inst.amount)}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          inst.status === 'PAID'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-red-50 text-red-800'
                        }`}>
                          {inst.status === 'PAID' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-red-600" />
                              <span>Paid</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-red-600" />
                              <span>Pending</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                        {inst.transactionRef || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Stamp & Disclaimer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>Certified FlexiPay Ghana Digital Escrow Security</span>
            </div>
            <div>
              <span>Official Reference: {contract.id}</span>
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
