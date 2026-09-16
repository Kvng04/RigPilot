import React, { useState } from 'react';
import type { AuditResult } from '../../types';
import { deleteUserAudit } from '../../lib/firebase';
import {
  History,
  FileText,
  Trash2,
  Download,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  X,
  TrendingDown,
} from 'lucide-react';

interface AuditHistoryViewProps {
  userId: string;
  audits: AuditResult[];
  onNavigateToDiagnostic: () => void;
}

export const AuditHistoryView: React.FC<AuditHistoryViewProps> = ({
  userId,
  audits,
  onNavigateToDiagnostic,
}) => {
  const [selectedAudit, setSelectedAudit] = useState<AuditResult | null>(null);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteUserAudit(userId, id);
      if (selectedAudit?.id === id) setSelectedAudit(null);
    } catch (err) {
      console.error('Delete audit error:', err);
    }
  };

  const handleExportCSV = (audit: AuditResult) => {
    const rows = [
      ['Unit Number', 'Make/Model', 'Engine Hours', 'Active Hours', 'Idle Hours', 'Idle %', 'Idle Payroll Loss', 'Idle Fuel Loss', 'Total Wasted', 'Key Bottleneck'],
      ...audit.machineBreakdown.map((m) => [
        m.unitNumber,
        `"${m.makeModel}"`,
        m.totalEngineHours,
        m.activeHours,
        m.idleHours,
        `${m.idlePercentage}%`,
        `$${m.idlePayrollLoss}`,
        `$${m.idleFuelLoss}`,
        `$${m.totalWastedDollar}`,
        `"${m.keyBottleneck}"`,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_${audit.siteName.replace(/\s+/g, '_')}_${audit.timestamp.slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#5B6167]">
            Historical Shift Telematics
          </div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight text-[#22272B]">
            Shift Audit Archive
          </h1>
          <p className="text-sm text-[#5B6167] mt-1 max-w-[65ch]">
            Review all processed shift telematics diagnostics, track week-over-week idle payroll leakage, and export supervisory records.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToDiagnostic}
          className="btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider self-start sm:self-auto"
        >
          <FileText className="w-4 h-4 stroke-[2]" />
          Run New Audit
        </button>
      </div>

      {/* Empty State */}
      {audits.length === 0 ? (
        <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F4] border border-[#DCD6CB] flex items-center justify-center mx-auto text-[#5B6167]">
            <History className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-[#22272B]">
              No Shift Audits Saved Yet
            </h3>
            <p className="text-xs text-[#5B6167] max-w-[42ch] mx-auto">
              Run your first shift telematics audit to calculate idle labor burn and store historical reports.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToDiagnostic}
            className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider"
          >
            Launch Shift Diagnostic
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Audits List */
        <div className="bg-white border border-[#DCD6CB] rounded-[6px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#FAF8F4] border-b border-[#DCD6CB] text-[#5B6167] uppercase font-semibold">
                  <th className="py-3 px-4">Date / Title</th>
                  <th className="py-3 px-4">Job Site</th>
                  <th className="py-3 px-4">Machines</th>
                  <th className="py-3 px-4">Efficiency</th>
                  <th className="py-3 px-4">Idle Payroll Loss</th>
                  <th className="py-3 px-4">Total Wasted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD6CB]">
                {audits.map((a) => (
                  <tr key={a.id || a.timestamp} className="hover:bg-[#FAF8F4]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#22272B]">{a.title}</div>
                      <div className="text-[11px] font-mono text-[#5B6167] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(a.timestamp).toLocaleDateString()} · {a.shiftHours}h shift
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#22272B]">
                      <div className="flex items-center gap-1 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-[#5B6167]" />
                        {a.siteName}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#22272B]">
                      {a.machineBreakdown.length} units
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#22272B]">
                      {a.efficiencyPercentage}%
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#22272B]">
                      ${a.idlePayrollWaste.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#22272B]">
                      ${a.totalWastedCost.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAudit(a)}
                        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#22272B] hover:text-[#D89700] px-2 py-1 bg-[#FAF8F4] border border-[#DCD6CB] rounded"
                      >
                        Inspect
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportCSV(a)}
                        className="text-[#5B6167] hover:text-[#22272B] p-1"
                        title="Download CSV"
                      >
                        <Download className="w-4 h-4 inline" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a.id)}
                        className="text-[#5B6167] hover:text-[#991B1B] p-1"
                        title="Delete audit"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Modal Drawer */}
      {selectedAudit && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#DCD6CB] rounded-[6px] max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#DCD6CB]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5B6167]">
                  Shift Audit Details
                </span>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-[#22272B]">
                  {selectedAudit.title}
                </h3>
                <div className="text-xs text-[#5B6167] mt-0.5">
                  Site: <strong className="text-[#22272B]">{selectedAudit.siteName}</strong> · Date: {new Date(selectedAudit.timestamp).toLocaleDateString()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAudit(null)}
                className="text-[#5B6167] hover:text-[#22272B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 bg-[#FAF8F4] border border-[#DCD6CB] rounded">
                <div className="text-[11px] text-[#5B6167] uppercase font-semibold">Efficiency</div>
                <div className="font-mono text-xl font-bold text-[#22272B]">{selectedAudit.efficiencyPercentage}%</div>
              </div>
              <div className="p-3 bg-[#FAF8F4] border border-[#F2A900] rounded">
                <div className="text-[11px] text-[#22272B] uppercase font-semibold">Idle Wage Waste</div>
                <div className="font-mono text-xl font-bold text-[#22272B]">${selectedAudit.idlePayrollWaste.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-[#FAF8F4] border border-[#DCD6CB] rounded">
                <div className="text-[11px] text-[#5B6167] uppercase font-semibold">Monthly Run Rate</div>
                <div className="font-mono text-xl font-bold text-[#22272B]">${selectedAudit.monthlyLossProjection.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-[#FAF8F4] border border-[#DCD6CB] rounded">
                <div className="text-[11px] text-[#5B6167] uppercase font-semibold">3-Seat Remote ROI</div>
                <div className="font-mono text-xl font-bold text-[#22272B]">${selectedAudit.remoteConsolidationPotential.toLocaleString()}</div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-[#FAF8F4] border border-[#DCD6CB] rounded space-y-1 text-xs">
              <span className="font-bold text-[#22272B] uppercase tracking-wider">Executive Synthesis</span>
              <p className="text-[#5B6167] leading-relaxed">{selectedAudit.executiveSummary}</p>
            </div>

            {/* Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B6167]">Equipment Breakdown</span>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#DCD6CB] text-[#5B6167]">
                      <th className="py-1.5 px-2">Unit</th>
                      <th className="py-1.5 px-2">Engine</th>
                      <th className="py-1.5 px-2">Active</th>
                      <th className="py-1.5 px-2">Idle</th>
                      <th className="py-1.5 px-2">Waste ($)</th>
                      <th className="py-1.5 px-2">Bottleneck</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCD6CB] font-mono text-xs">
                    {selectedAudit.machineBreakdown.map((m, idx) => (
                      <tr key={idx}>
                        <td className="py-1.5 px-2 font-bold text-[#22272B]">{m.unitNumber}</td>
                        <td className="py-1.5 px-2 text-[#5B6167]">{m.totalEngineHours}h</td>
                        <td className="py-1.5 px-2 text-[#22272B]">{m.activeHours}h</td>
                        <td className="py-1.5 px-2 text-[#991B1B]">{m.idleHours}h</td>
                        <td className="py-1.5 px-2 font-bold text-[#22272B]">${m.totalWastedDollar}</td>
                        <td className="py-1.5 px-2 font-sans text-[11px] text-[#5B6167]">{m.keyBottleneck}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#DCD6CB]">
              <button
                type="button"
                onClick={() => handleExportCSV(selectedAudit)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider border border-[#DCD6CB] rounded hover:bg-[#FAF8F4]"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => setSelectedAudit(null)}
                className="btn-primary px-4 py-2 text-xs font-bold uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
