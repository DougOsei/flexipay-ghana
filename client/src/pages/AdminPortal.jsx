import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatGHS, formatDate } from '../utils/ghanaConstants';
import { 
  ShieldCheck, 
  Store, 
  CreditCard, 
  TrendingUp, 
  RotateCcw, 
  FileText, 
  Users, 
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Database
} from 'lucide-react';

export default function AdminPortal({ onViewReceipt, activeSection = 'all' }) {
  const { showToast } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      if (data.success) {
        setMetrics(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleToggleVerifyVendor = async (vendorId, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Vendor status updated.`, 'info');
        loadMetrics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm('Reset all demo data back to authentic Ghana baseline state?')) return;
    setIsResetting(true);
    try {
      const res = await fetch('/api/admin/reset-demo', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        loadMetrics();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  if (loading && !metrics) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading Platform Oversight...</p>
      </div>
    );
  }

  const stats = metrics?.stats;

  return (
    <div className="space-y-8 pb-20">
      
      {/* Platform Header */}
      <section className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-red-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-red-100 border border-white/20 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Republic of Ghana • Central Platform Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">FlexiPay Oversight HQ</h1>
            <p className="text-xs text-red-200 mt-1">
              Multi-Vendor Hire Purchase Governance, Escrow Settlements &amp; KYC Monitoring
            </p>
          </div>

          <button
            type="button"
            disabled={isResetting}
            onClick={handleResetDemo}
            className="self-start sm:self-auto py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Baseline</span>
          </button>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-red-700/60">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-red-200 block">Total Platform GMV</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
              {formatGHS(stats?.totalGMV || 0)}
            </span>
            <span className="text-[10px] text-red-300">All vendors aggregate volume</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-red-200 block">Collected Repayments</span>
            <span className="text-xl sm:text-2xl font-black text-green-400 mt-1 block">
              {formatGHS(stats?.totalCollected || 0)}
            </span>
            <span className="text-[10px] text-green-300">Processed via Ghana MoMo</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-red-200 block">Platform Fee Revenue (2.5%)</span>
            <span className="text-xl sm:text-2xl font-black text-yellow-400 mt-1 block">
              {formatGHS(stats?.platformCommission || 0)}
            </span>
            <span className="text-[10px] text-yellow-300">Earned commission</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-red-200 block">Repayment Health Rate</span>
            <span className="text-xl sm:text-2xl font-black text-green-300 mt-1 block">
              {stats?.repaymentRate}%
            </span>
            <span className="text-[10px] text-red-200">Default rate: &lt;1.6%</span>
          </div>
        </div>
      </section>

      {/* Live Relational Database Status Bar */}
      {metrics?.database && (
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {metrics.database.engine}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                File: {metrics.database.file} ({metrics.database.sizeKB} KB)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(metrics.database.tables || {}).map(([tableName, count]) => (
              <div
                key={tableName}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center gap-1.5"
              >
                <span className="font-mono text-[11px] text-slate-500 capitalize">{tableName}:</span>
                <span className="font-black text-slate-900">{count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Vendor Store Directory Table */}
      {(activeSection === 'all' || activeSection === 'vendors') && (
      <section className="bg-white rounded-3xl border border-red-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Registered Ghanaian Vendors ({metrics?.vendors?.length})</h3>
            <p className="text-xs text-slate-500">Supervise vendor KYC, Mobile Money payout accounts, and ratings</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-red-50 text-red-800 font-bold border-b border-red-100">
              <tr>
                <th className="py-3 px-3">Vendor / Store</th>
                <th className="py-3 px-3">Location &amp; GPS</th>
                <th className="py-3 px-3">MoMo Wallet</th>
                <th className="py-3 px-3">Sales GMV</th>
                <th className="py-3 px-3">Repayments</th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-50">
              {metrics?.vendors?.map((v) => (
                <tr key={v.id} className="hover:bg-red-50/40">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                        <Store className="w-3.5 h-3.5 text-red-700" aria-hidden="true" />
                      </span>
                      <div>
                        <div>{v.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{v.ownerEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <div>{v.city}</div>
                    <div className="font-mono text-[10px] text-slate-400">{v.digitalAddress}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-800">
                    {v.momoNumber} <span className="text-[10px] text-slate-400">({v?.momoNetwork ? v.momoNetwork.replace(/_/g, ' ') : 'MTN MoMo'})</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">{formatGHS(v.totalSalesGHS)}</td>
                  <td className="py-3 px-3 font-bold text-green-700">{formatGHS(v.collectedInstallmentsGHS)}</td>
                  <td className="py-3 px-3 font-bold text-red-600">★ {v.rating}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleVerifyVendor(v.id, v.verified)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition ${
                        v.verified
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {v.verified ? 'Verified Active' : 'Unverified'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      )}

      {/* Global Contract Registry */}
      {(activeSection === 'all' || activeSection === 'contracts') && (
      <section className="bg-white rounded-3xl border border-red-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">All Platform Agreements ({metrics?.recentContracts?.length})</h3>
            <p className="text-xs text-slate-500">Legal agreements executed under Ghana Hire Purchase Act</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-red-50 text-red-800 font-bold border-b border-red-100">
              <tr>
                <th className="py-3 px-3">Contract Ref</th>
                <th className="py-3 px-3">Buyer (Ghana Card)</th>
                <th className="py-3 px-3">Vendor</th>
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Total HP</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-50">
              {metrics?.recentContracts?.map((c) => (
                <tr key={c.id} className="hover:bg-red-50/40">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{c.contractNumber}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800">{c.customerName}</div>
                    <div className="font-mono text-[10px] text-slate-500">{c.customerGhanaCard}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{c.vendorName}</td>
                  <td className="py-3 px-3 text-slate-800 max-w-xs truncate font-medium">{c.productTitle}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{formatGHS(c.totalHPAmount)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      c.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                      c.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      c.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {(c?.status || 'PENDING').replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onViewReceipt(c)}
                      className="text-xs text-red-700 hover:text-red-900 font-bold underline"
                    >
                      Audit Agreement
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      )}

    </div>
  );
}
