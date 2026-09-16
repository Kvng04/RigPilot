import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  subscribeToUserAudits,
  subscribeToUserMachines,
  syncUserProfile,
} from '../../lib/firebase';
import type { AuditResult, MachineItem } from '../../types';
import { AppHeader } from './AppHeader';
import { AppNavTabs } from './AppNavTabs';
import { AuthGate } from './AuthGate';
import { DiagnosticHeroView } from './DiagnosticHeroView';
import { FleetRosterView } from './FleetRosterView';
import { RemoteCommandPlannerView } from './RemoteCommandPlannerView';
import { AuditHistoryView } from './AuditHistoryView';
import { WebinarPilotView } from './WebinarPilotView';
import { Activity } from 'lucide-react';

interface AppCommandStationProps {
  onNavigateHome: () => void;
}

export const AppCommandStation: React.FC<AppCommandStationProps> = ({
  onNavigateHome,
}) => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('diagnostic');

  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [machines, setMachines] = useState<MachineItem[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Sync profile & subscribe to Firestore collections when logged in
  useEffect(() => {
    if (!user) {
      setLoadingData(false);
      return;
    }

    // Sync user profile (handles null displayName safely)
    syncUserProfile(user).catch((err) => console.warn('Profile sync notice:', err));

    // Subscribe to audits
    const unsubAudits = subscribeToUserAudits(
      user.uid,
      (newAudits) => {
        setAudits(newAudits);
        setLoadingData(false);
      },
      (err) => {
        console.error('Audits subscription error:', err);
        setLoadingData(false);
      }
    );

    // Subscribe to machines
    const unsubMachines = subscribeToUserMachines(
      user.uid,
      (newMachines) => {
        setMachines(newMachines);
      },
      (err) => {
        console.error('Machines subscription error:', err);
      }
    );

    return () => {
      unsubAudits();
      unsubMachines();
    };
  }, [user]);

  // Loading auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-[#5B6167]">
          <Activity className="w-4 h-4 animate-spin text-[#22272B]" />
          Connecting Rigpilot Command Station...
        </div>
      </div>
    );
  }

  // Not signed in -> show Auth Gate
  if (!user) {
    return <AuthGate onReturnHome={onNavigateHome} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col text-[#22272B]">
      {/* 1. App Shell Header */}
      <AppHeader
        user={user}
        activeTab={activeTab}
        onNavigateHome={onNavigateHome}
      />

      {/* 2. Navigation Tabs */}
      <AppNavTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        auditCount={audits.length}
        machineCount={machines.length}
      />

      {/* 3. Main Workspace Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'diagnostic' && (
          <DiagnosticHeroView
            userId={user.uid}
            savedMachines={machines}
            onNavigateToAudits={() => setActiveTab('audits')}
            onNavigateToPlanner={() => setActiveTab('planner')}
          />
        )}

        {activeTab === 'fleet' && (
          <FleetRosterView
            userId={user.uid}
            machines={machines}
            onNavigateToDiagnostic={() => setActiveTab('diagnostic')}
          />
        )}

        {activeTab === 'planner' && (
          <RemoteCommandPlannerView
            onNavigateToWebinar={() => setActiveTab('webinar')}
          />
        )}

        {activeTab === 'audits' && (
          <AuditHistoryView
            userId={user.uid}
            audits={audits}
            onNavigateToDiagnostic={() => setActiveTab('diagnostic')}
          />
        )}

        {activeTab === 'webinar' && (
          <WebinarPilotView
            userId={user.uid}
            userEmail={user.email || ''}
          />
        )}
      </main>

      {/* 4. App Footer */}
      <footer className="border-t border-[#DCD6CB] py-4 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5B6167]">
          <span>RIGPILOT TELEMATICS COMMAND · PROPRIETARY INDUSTRIAL SYSTEM</span>
          <span className="font-mono text-[11px]">VERSION 2.4.0 · STATUS: ONLINE</span>
        </div>
      </footer>
    </div>
  );
};
