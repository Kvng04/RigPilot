import React, { useState } from 'react';
import type { MachineItem } from '../../types';
import { saveUserMachine, deleteUserMachine } from '../../lib/firebase';
import { Truck, Plus, Trash2, CheckCircle2, X, AlertCircle } from 'lucide-react';

interface FleetRosterViewProps {
  userId: string;
  machines: MachineItem[];
  onNavigateToDiagnostic: () => void;
}

const SAMPLE_FLEET: Omit<MachineItem, 'id' | 'userId' | 'createdAt'>[] = [
  {
    unitNumber: 'EX-04',
    makeModel: 'Cat 336 Excavator',
    category: 'excavator',
    assignedSite: 'North Quarry Pit 2',
    hourlyOperatorRate: 68,
    hourlyFuelBurn: 34,
    remoteRetrofitReady: true,
  },
  {
    unitNumber: 'DZ-02',
    makeModel: 'Komatsu D61PXi Dozer',
    category: 'dozer',
    assignedSite: 'West Grade Logistics',
    hourlyOperatorRate: 72,
    hourlyFuelBurn: 28,
    remoteRetrofitReady: true,
  },
  {
    unitNumber: 'LD-01',
    makeModel: 'Deere 644P Wheel Loader',
    category: 'loader',
    assignedSite: 'Batch Plant Aggregate',
    hourlyOperatorRate: 64,
    hourlyFuelBurn: 26,
    remoteRetrofitReady: false,
  },
  {
    unitNumber: 'GR-03',
    makeModel: 'Cat 140M Motor Grader',
    category: 'grader',
    assignedSite: 'Highway 18 Trenching',
    hourlyOperatorRate: 75,
    hourlyFuelBurn: 30,
    remoteRetrofitReady: true,
  },
];

export const FleetRosterView: React.FC<FleetRosterViewProps> = ({
  userId,
  machines,
  onNavigateToDiagnostic,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [unitNumber, setUnitNumber] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [category, setCategory] = useState<MachineItem['category']>('excavator');
  const [assignedSite, setAssignedSite] = useState('');
  const [hourlyOperatorRate, setHourlyOperatorRate] = useState<number>(68);
  const [hourlyFuelBurn, setHourlyFuelBurn] = useState<number>(28);
  const [remoteRetrofitReady, setRemoteRetrofitReady] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitNumber.trim() || !makeModel.trim()) {
      setError('Please provide unit number and model name.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await saveUserMachine(userId, {
        unitNumber: unitNumber.trim(),
        makeModel: makeModel.trim(),
        category,
        assignedSite: assignedSite.trim() || 'Main Yard',
        hourlyOperatorRate: Number(hourlyOperatorRate) || 68,
        hourlyFuelBurn: Number(hourlyFuelBurn) || 28,
        remoteRetrofitReady,
      });

      // Reset form
      setUnitNumber('');
      setMakeModel('');
      setAssignedSite('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Save machine error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save machine to Firestore.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeedSampleFleet = async () => {
    setSubmitting(true);
    setError(null);
    try {
      for (const sample of SAMPLE_FLEET) {
        await saveUserMachine(userId, sample as MachineItem);
      }
    } catch (err) {
      console.error('Seed fleet error:', err);
      setError('Failed to seed sample fleet.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMachine = async (id?: string) => {
    if (!id) return;
    try {
      await deleteUserMachine(userId, id);
    } catch (err) {
      console.error('Delete machine error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#5B6167]">
            Fleet Inventory
          </div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight text-[#22272B]">
            Fleet Machinery Roster
          </h1>
          <p className="text-sm text-[#5B6167] mt-1 max-w-[65ch]">
            Register active machinery, operator wage profiles, and CAN-bus remote retrofit readiness across your sites.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          Add Machine
        </button>
      </div>

      {/* Empty State */}
      {machines.length === 0 ? (
        <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F4] border border-[#DCD6CB] flex items-center justify-center mx-auto text-[#5B6167]">
            <Truck className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-[#22272B]">
              No Fleet Machines Registered
            </h3>
            <p className="text-xs text-[#5B6167] max-w-[42ch] mx-auto">
              Add your excavators, loaders, dozers, and graders to streamline shift audits and remote command planning.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSeedSampleFleet}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FAF8F4] border border-[#DCD6CB] hover:border-[#22272B] rounded-[6px] text-xs font-bold uppercase tracking-wider text-[#22272B] transition-colors"
            >
              {submitting ? 'Loading...' : 'Load 4-Machine Sample Fleet'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Custom Machine
            </button>
          </div>
        </div>
      ) : (
        /* Machinery Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {machines.map((m) => (
            <div
              key={m.id || m.unitNumber}
              className="bg-white border border-[#DCD6CB] rounded-[6px] p-5 space-y-4 relative flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="inline-flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#22272B] px-2 py-0.5 bg-[#FAF8F4] border border-[#DCD6CB] rounded">
                      {m.unitNumber}
                    </span>
                    <span className="text-[11px] uppercase font-semibold text-[#5B6167] px-1.5 py-0.5 border border-[#DCD6CB] rounded">
                      {m.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteMachine(m.id)}
                    className="text-[#5B6167] hover:text-[#991B1B] p-1 transition-colors"
                    title="Delete machine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="font-heading text-lg font-bold text-[#22272B]">
                  {m.makeModel}
                </div>

                <div className="text-xs text-[#5B6167]">
                  Assigned: <span className="font-medium text-[#22272B]">{m.assignedSite}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#DCD6CB] space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#5B6167]">Operator Rate:</span>
                    <div className="font-mono font-bold text-[#22272B]">${m.hourlyOperatorRate}/hr</div>
                  </div>
                  <div>
                    <span className="text-[#5B6167]">Fuel Burn:</span>
                    <div className="font-mono font-bold text-[#22272B]">${m.hourlyFuelBurn}/hr</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-[#5B6167]">Remote Pilot Ready:</span>
                  {m.remoteRetrofitReady ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-[#22272B]">
                      <CheckCircle2 className="w-3 h-3 text-[#22272B]" />
                      CAN-Bus Ready
                    </span>
                  ) : (
                    <span className="text-[#5B6167]">Needs Gateway</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Machine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-[#DCD6CB] rounded-[6px] max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-[#22272B]">
                Add Fleet Machine
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#5B6167] hover:text-[#22272B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-[#FAF8F4] border border-[#991B1B] rounded-[6px] text-xs text-[#991B1B] flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddMachine} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
                    Unit ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    placeholder="e.g. EX-09"
                    className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-xs"
                  >
                    <option value="excavator">Excavator</option>
                    <option value="dozer">Dozer</option>
                    <option value="loader">Wheel Loader</option>
                    <option value="grader">Motor Grader</option>
                    <option value="haul_truck">Haul Truck</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
                  Make & Model *
                </label>
                <input
                  type="text"
                  required
                  value={makeModel}
                  onChange={(e) => setMakeModel(e.target.value)}
                  placeholder="e.g. Cat 336 Next Gen Excavator"
                  className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
                  Assigned Job Site
                </label>
                <input
                  type="text"
                  value={assignedSite}
                  onChange={(e) => setAssignedSite(e.target.value)}
                  placeholder="e.g. South Quarry Expansion"
                  className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
                    Op Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={hourlyOperatorRate}
                    onChange={(e) => setHourlyOperatorRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
                    Fuel Burn ($/hr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={hourlyFuelBurn}
                    onChange={(e) => setHourlyFuelBurn(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="retrofit"
                  checked={remoteRetrofitReady}
                  onChange={(e) => setRemoteRetrofitReady(e.target.checked)}
                  className="rounded border-[#DCD6CB] text-[#22272B] focus:ring-0"
                />
                <label htmlFor="retrofit" className="text-xs text-[#22272B] font-medium">
                  Machine has CAN-bus / electro-hydraulic controls
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCD6CB]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs font-semibold uppercase text-[#5B6167] hover:text-[#22272B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-4 py-2 text-xs font-bold uppercase tracking-wider"
                >
                  {submitting ? 'Saving...' : 'Save Machine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
