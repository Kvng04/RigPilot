import React, { useState } from 'react';
import type { ShiftMachineData, AuditResult, MachineItem } from '../../types';
import { saveUserAudit, trackAnalyticsEvent } from '../../lib/firebase';
import {
  Activity,
  Plus,
  Trash2,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  Download,
  RotateCcw,
  ArrowRight,
  TrendingDown,
  Clock,
  DollarSign,
} from 'lucide-react';

interface DiagnosticHeroViewProps {
  userId: string;
  savedMachines: MachineItem[];
  onNavigateToAudits: () => void;
  onNavigateToPlanner: () => void;
}

const DEFAULT_SAMPLE_MACHINES: ShiftMachineData[] = [
  {
    unitNumber: 'EX-04',
    makeModel: 'Cat 336 Excavator (36-ton)',
    totalEngineHours: 8.0,
    activeWorkingHours: 3.2,
    idleHours: 4.8,
    hourlyOperatorRate: 68,
    fuelCostPerHour: 34,
  },
  {
    unitNumber: 'DZ-02',
    makeModel: 'Komatsu D61PXi Dozer',
    totalEngineHours: 8.0,
    activeWorkingHours: 2.8,
    idleHours: 5.2,
    hourlyOperatorRate: 72,
    fuelCostPerHour: 28,
  },
  {
    unitNumber: 'LD-01',
    makeModel: 'Deere 644P Wheel Loader',
    totalEngineHours: 8.0,
    activeWorkingHours: 4.1,
    idleHours: 3.9,
    hourlyOperatorRate: 64,
    fuelCostPerHour: 26,
  },
];

export const DiagnosticHeroView: React.FC<DiagnosticHeroViewProps> = ({
  userId,
  savedMachines,
  onNavigateToAudits,
  onNavigateToPlanner,
}) => {
  const [title, setTitle] = useState('Friday Cut & Fill Shift');
  const [siteName, setSiteName] = useState('North Quarry Expansion');
  const [shiftHours, setShiftHours] = useState<number>(8.0);
  const [shiftNotes, setShiftNotes] = useState('');
  const [machines, setMachines] = useState<ShiftMachineData[]>(DEFAULT_SAMPLE_MACHINES);
  const [logImageBase64, setLogImageBase64] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  // States: idle, loading, success, error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Handle client-side image compression (<1MB JPEG)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to JPEG at 0.82 quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        setLogImageBase64(compressedBase64);
        setError(null);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleAddMachine = () => {
    setMachines((prev) => [
      ...prev,
      {
        unitNumber: `EQ-0${prev.length + 1}`,
        makeModel: 'Cat / Komatsu / Deere Unit',
        totalEngineHours: shiftHours,
        activeWorkingHours: Number((shiftHours * 0.45).toFixed(1)),
        idleHours: Number((shiftHours * 0.55).toFixed(1)),
        hourlyOperatorRate: 68,
        fuelCostPerHour: 28,
      },
    ]);
  };

  const handleRemoveMachine = (index: number) => {
    setMachines((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateMachine = (index: number, field: keyof ShiftMachineData, val: any) => {
    setMachines((prev) => {
      const updated = [...prev];
      const m = { ...updated[index], [field]: val };

      // Keep active + idle consistent with total
      if (field === 'totalEngineHours' || field === 'activeWorkingHours') {
        const total = field === 'totalEngineHours' ? Number(val) : m.totalEngineHours;
        const active = field === 'activeWorkingHours' ? Number(val) : m.activeWorkingHours;
        m.idleHours = Math.max(0, Number((total - active).toFixed(1)));
      } else if (field === 'idleHours') {
        const idle = Number(val);
        m.activeWorkingHours = Math.max(0, Number((m.totalEngineHours - idle).toFixed(1)));
      }

      updated[index] = m;
      return updated;
    });
  };

  const handleImportSavedMachines = () => {
    if (savedMachines.length === 0) return;
    const mapped: ShiftMachineData[] = savedMachines.map((m) => ({
      unitNumber: m.unitNumber,
      makeModel: m.makeModel,
      totalEngineHours: shiftHours,
      activeWorkingHours: Number((shiftHours * 0.42).toFixed(1)),
      idleHours: Number((shiftHours * 0.58).toFixed(1)),
      hourlyOperatorRate: m.hourlyOperatorRate || 68,
      fuelCostPerHour: m.hourlyFuelBurn || 28,
    }));
    setMachines(mapped);
  };

  const handleRunDiagnostic = async () => {
    if (machines.length === 0) {
      setError('Please add at least one machine to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSavedSuccess(false);

    try {
      const payload = {
        title,
        siteName,
        shiftHours,
        machines,
        shiftNotes,
        logImageBase64: logImageBase64 || undefined,
      };

      const response = await fetch('/api/diagnostic/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const auditData: AuditResult = await response.json();
      setResult(auditData);

      // Auto-save to user's Firestore archive
      await saveUserAudit(userId, auditData);
      setSavedSuccess(true);
      await trackAnalyticsEvent(userId, 'hero_feature_used', {
        machinesCount: machines.length,
        wastedCost: auditData.totalWastedCost,
      });
    } catch (err) {
      console.error('Audit processing error:', err);
      setError(err instanceof Error ? err.message : 'Diagnostic execution failed. Please verify values and retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!result) return;
    const rows = [
      ['Unit Number', 'Make/Model', 'Engine Hours', 'Active Hours', 'Idle Hours', 'Idle %', 'Idle Payroll Loss', 'Idle Fuel Loss', 'Total Wasted', 'Key Bottleneck'],
      ...result.machineBreakdown.map((m) => [
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
    link.setAttribute('download', `rigpilot_audit_${siteName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header & Sub-banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#5B6167]">
            Hero Diagnostic Engine
          </div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight text-[#22272B]">
            Shift Telematics & Idle-Cost Audit
          </h1>
          <p className="text-sm text-[#5B6167] mt-1 max-w-[65ch]">
            Enter machine run hours and operator wage rates below, or upload a daily shift log sheet. Rigpilot runs an engineering audit to calculate your exact labor loss and remote supervision ROI.
          </p>
        </div>

        {savedMachines.length > 0 && (
          <button
            type="button"
            onClick={handleImportSavedMachines}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#DCD6CB] text-xs font-semibold uppercase tracking-wider text-[#22272B] hover:bg-white transition-colors"
          >
            Import Saved Fleet ({savedMachines.length})
          </button>
        )}
      </div>

      {/* Input Parameters Section */}
      <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
              Shift Audit Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Friday Paving & Trenching"
              className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-sm text-[#22272B] focus:outline-none focus:border-[#22272B]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
              Job Site / Quarry Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="e.g. North Quarry Expansion"
              className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-sm text-[#22272B] focus:outline-none focus:border-[#22272B]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
              Shift Duration (Hours)
            </label>
            <input
              type="number"
              min="1"
              max="24"
              step="0.5"
              value={shiftHours}
              onChange={(e) => setShiftHours(Number(e.target.value) || 8)}
              className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-sm text-[#22272B] font-mono focus:outline-none focus:border-[#22272B]"
            />
          </div>
        </div>

        {/* Machine Telematics Rows */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
              Equipment Shift Logs ({machines.length} Machines)
            </span>
            <button
              type="button"
              onClick={handleAddMachine}
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#22272B] hover:text-[#D89700]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Machine
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#DCD6CB] text-[#5B6167] uppercase font-semibold">
                  <th className="py-2 px-2">Unit ID</th>
                  <th className="py-2 px-2">Make / Model</th>
                  <th className="py-2 px-2">Engine Hrs</th>
                  <th className="py-2 px-2">Active Cut Hrs</th>
                  <th className="py-2 px-2">Idle Standby</th>
                  <th className="py-2 px-2">Op Wage ($/hr)</th>
                  <th className="py-2 px-2">Fuel ($/hr)</th>
                  <th className="py-2 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD6CB]">
                {machines.map((m, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF8F4]">
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={m.unitNumber}
                        onChange={(e) => handleUpdateMachine(idx, 'unitNumber', e.target.value)}
                        className="w-20 px-2 py-1 bg-white border border-[#DCD6CB] rounded text-xs font-mono font-semibold"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={m.makeModel}
                        onChange={(e) => handleUpdateMachine(idx, 'makeModel', e.target.value)}
                        className="w-44 px-2 py-1 bg-white border border-[#DCD6CB] rounded text-xs"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="0"
                        max="24"
                        step="0.1"
                        value={m.totalEngineHours}
                        onChange={(e) => handleUpdateMachine(idx, 'totalEngineHours', Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-white border border-[#DCD6CB] rounded text-xs font-mono"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="0"
                        max="24"
                        step="0.1"
                        value={m.activeWorkingHours}
                        onChange={(e) => handleUpdateMachine(idx, 'activeWorkingHours', Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-white border border-[#DCD6CB] rounded text-xs font-mono"
                      />
                    </td>
                    <td className="py-2 px-2 font-mono font-semibold text-[#5B6167]">
                      {m.idleHours.toFixed(1)} hrs
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="1"
                        value={m.hourlyOperatorRate}
                        onChange={(e) => handleUpdateMachine(idx, 'hourlyOperatorRate', Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-white border border-[#DCD6CB] rounded text-xs font-mono"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="0"
                        value={m.fuelCostPerHour}
                        onChange={(e) => handleUpdateMachine(idx, 'fuelCostPerHour', Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-white border border-[#DCD6CB] rounded text-xs font-mono"
                      />
                    </td>
                    <td className="py-2 px-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveMachine(idx)}
                        disabled={machines.length <= 1}
                        className="text-[#5B6167] hover:text-[#991B1B] disabled:opacity-30"
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

        {/* Optional Shift Notes & Photo Log upload */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#DCD6CB]">
          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
              Optional Shift Observations / Telematics Notes
            </label>
            <textarea
              rows={2}
              value={shiftNotes}
              onChange={(e) => setShiftNotes(e.target.value)}
              placeholder="e.g. Haul trucks delayed 45 mins at batch plant. Excavator waited on grade lasers."
              className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-xs text-[#22272B] focus:outline-none focus:border-[#22272B]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
              Attach Telematics Export or Meter Photo (Auto-compressed)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-xs font-semibold text-[#22272B] hover:bg-white transition-colors">
                <UploadCloud className="w-4 h-4 text-[#5B6167]" />
                <span>{imageFileName ? 'Change Photo' : 'Upload Log Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {imageFileName && (
                <span className="text-xs text-[#5B6167] truncate max-w-[200px]">
                  {imageFileName}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#5B6167]">
              Images are compressed client-side &lt;1MB before processing.
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-[#FAF8F4] border border-[#991B1B] rounded-[6px] text-xs text-[#991B1B] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#DCD6CB]">
          <span className="text-xs text-[#5B6167]">
            Calculates operator wage burn vs actual cut time using frontier engineering models.
          </span>

          <button
            type="button"
            onClick={handleRunDiagnostic}
            disabled={loading}
            className="btn-primary w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            {loading ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                Auditing Telematics with Frontier Model...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run Shift Telematics Audit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Display Section */}
      {result && (
        <div className="bg-white border-2 border-[#22272B] rounded-[6px] p-6 sm:p-8 space-y-8 animate-fadeIn">
          {/* Top Score Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#DCD6CB]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5B6167]">
                  Audit Complete
                </span>
                {savedSuccess && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#22272B] bg-[#FAF8F4] px-2 py-0.5 rounded border border-[#DCD6CB]">
                    <CheckCircle2 className="w-3 h-3 text-[#22272B]" />
                    Saved to Firestore Archive
                  </span>
                )}
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#22272B] mt-0.5">
                {result.title} — {result.siteName}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#22272B] border border-[#DCD6CB] px-3 py-2 rounded-[6px] hover:bg-[#FAF8F4]"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <button
                type="button"
                onClick={onNavigateToPlanner}
                className="btn-primary inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-2"
              >
                3-Seat Remote Plan
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4 Big Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] p-4 text-left">
              <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
                Labor Efficiency
              </div>
              <div className="text-3xl font-bold font-mono text-[#22272B] mt-1">
                {result.efficiencyPercentage}%
              </div>
              <div className="text-[11px] text-[#5B6167] mt-0.5">
                Active productive cycling
              </div>
            </div>

            <div className="bg-[#FAF8F4] border border-[#F2A900] rounded-[6px] p-4 text-left">
              <div className="text-xs uppercase tracking-wider font-semibold text-[#22272B]">
                Idle Payroll Waste
              </div>
              <div className="text-3xl font-bold font-mono text-[#22272B] mt-1">
                ${result.idlePayrollWaste.toLocaleString()}
              </div>
              <div className="text-[11px] font-semibold text-[#22272B] mt-0.5">
                Unworked operator wages (shift)
              </div>
            </div>

            <div className="bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] p-4 text-left">
              <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
                Monthly Loss Run-Rate
              </div>
              <div className="text-3xl font-bold font-mono text-[#22272B] mt-1">
                ${result.monthlyLossProjection.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#5B6167] mt-0.5">
                Based on 22 working shifts
              </div>
            </div>

            <div className="bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] p-4 text-left">
              <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
                3-Seat Remote Savings
              </div>
              <div className="text-3xl font-bold font-mono text-[#22272B] mt-1">
                ${result.remoteConsolidationPotential.toLocaleString()}
                <span className="text-xs font-normal text-[#5B6167]">/mo</span>
              </div>
              <div className="text-[11px] text-[#5B6167] mt-0.5">
                1 operator covering 3 machines
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] p-5 text-left space-y-2">
            <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
              Engineering Telematics Summary
            </div>
            <p className="text-[15px] leading-relaxed text-[#22272B]">
              {result.executiveSummary}
            </p>
          </div>

          {/* Machine Breakdown Table */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
              Machine-by-Machine Telematics Breakdown
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#DCD6CB] text-[#5B6167] uppercase font-semibold">
                    <th className="py-2.5 px-2">Unit</th>
                    <th className="py-2.5 px-2">Make / Model</th>
                    <th className="py-2.5 px-2">Engine</th>
                    <th className="py-2.5 px-2">Active Cut</th>
                    <th className="py-2.5 px-2">Idle Standby</th>
                    <th className="py-2.5 px-2">Idle %</th>
                    <th className="py-2.5 px-2">Idle Wage Waste</th>
                    <th className="py-2.5 px-2">Idle Fuel</th>
                    <th className="py-2.5 px-2">Site Bottleneck</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCD6CB] font-mono">
                  {result.machineBreakdown.map((m, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF8F4]">
                      <td className="py-2.5 px-2 font-bold text-[#22272B]">{m.unitNumber}</td>
                      <td className="py-2.5 px-2 font-sans text-[#22272B]">{m.makeModel}</td>
                      <td className="py-2.5 px-2 text-[#5B6167]">{m.totalEngineHours}h</td>
                      <td className="py-2.5 px-2 text-[#22272B] font-semibold">{m.activeHours}h</td>
                      <td className="py-2.5 px-2 text-[#991B1B]">{m.idleHours}h</td>
                      <td className="py-2.5 px-2 font-semibold text-[#22272B]">{m.idlePercentage}%</td>
                      <td className="py-2.5 px-2 font-bold text-[#22272B]">${m.idlePayrollLoss}</td>
                      <td className="py-2.5 px-2 text-[#5B6167]">${m.idleFuelLoss}</td>
                      <td className="py-2.5 px-2 font-sans text-xs text-[#5B6167]">{m.keyBottleneck}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
              Site Supervisor Action Steps
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {result.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] p-4 text-left space-y-1.5"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-[#22272B]">
                    Recommendation 0{i + 1}
                  </div>
                  <p className="text-xs leading-relaxed text-[#5B6167]">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTAs */}
          <div className="pt-4 border-t border-[#DCD6CB] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setSavedSuccess(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#5B6167] hover:text-[#22272B]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Run Another Shift Audit
            </button>

            <button
              type="button"
              onClick={onNavigateToAudits}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#22272B] hover:text-[#D89700]"
            >
              <FileText className="w-3.5 h-3.5" />
              View Full Audit History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
