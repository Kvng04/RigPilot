import React, { useState, useEffect } from 'react';
import {
  auth,
  signInWithGoogleAdmin,
  getOwnerSettings,
  claimOwnerSettings,
  updateAppSettings,
  subscribeToLeads,
  onAuthStateChanged,
  type AppSettings,
  type LeadSubmission,
} from '../../lib/firebase';
import type { User } from 'firebase/auth';
import { AdminHeader } from './AdminHeader';
import { SignupsSection } from './SignupsSection';
import { LaunchKitSection } from './LaunchKitSection';
import { WelcomeEmailsSection } from './WelcomeEmailsSection';
import { ChecklistSection } from './ChecklistSection';
import { VerdictSection } from './VerdictSection';
import { LogoMark } from '../LogoMark';
import { ShieldAlert, LogIn, Lock } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Live leads
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leadsError, setLeadsError] = useState<Error | null>(null);

  // Live URL & Visitors state
  const [liveUrl, setLiveUrl] = useState<string>(window.location.origin);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // 1. Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        setSettingsLoading(true);
        try {
          let currentSettings = await getOwnerSettings();
          if (!currentSettings) {
            // First account claims ownership
            currentSettings = await claimOwnerSettings(currentUser);
          }

          setSettings(currentSettings);
          const ownerMatch = currentSettings.ownerUid === currentUser.uid;
          setIsOwner(ownerMatch);

          if (currentSettings) {
            if (currentSettings.liveUrl) setLiveUrl(currentSettings.liveUrl);
            if (typeof currentSettings.visitorCount === 'number') {
              setVisitorCount(currentSettings.visitorCount);
            }
            if (currentSettings.checklist) {
              setChecklist(currentSettings.checklist);
            }
          }
        } catch (err) {
          console.error('Error fetching/claiming settings:', err);
          setIsOwner(false);
        } finally {
          setSettingsLoading(false);
        }
      } else {
        setSettings(null);
        setIsOwner(null);
        setSettingsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Realtime listener for leads when verified as owner
  useEffect(() => {
    if (!user || isOwner !== true) {
      setLeadsLoading(false);
      return;
    }

    setLeadsLoading(true);
    const unsubscribe = subscribeToLeads(
      (updatedLeads) => {
        setLeads(updatedLeads);
        setLeadsLoading(false);
        setLeadsError(null);
      },
      (err) => {
        console.error('Leads subscription error:', err);
        setLeadsError(err);
        setLeadsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isOwner]);

  const handleSignIn = async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      await signInWithGoogleAdmin();
    } catch (err) {
      console.error('Sign in failed:', err);
      setAuthError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setSigningIn(false);
    }
  };

  const handleLiveUrlChange = async (url: string) => {
    setLiveUrl(url);
    if (isOwner) {
      try {
        await updateAppSettings({ liveUrl: url });
      } catch (err) {
        console.error('Failed to update live URL:', err);
      }
    }
  };

  const handleVisitorCountChange = async (count: number) => {
    setVisitorCount(count);
    if (isOwner) {
      try {
        await updateAppSettings({ visitorCount: count });
      } catch (err) {
        console.error('Failed to update visitor count:', err);
      }
    }
  };

  const handleToggleChecklist = async (key: string, value: boolean) => {
    const updated = { ...checklist, [key]: value };
    setChecklist(updated);
    if (isOwner) {
      try {
        await updateAppSettings({ checklist: updated });
      } catch (err) {
        console.error('Failed to update checklist:', err);
      }
    }
  };

  // Screen 1: Loading
  if (authLoading || (user && settingsLoading)) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <LogoMark size={36} className="mx-auto animate-pulse" />
          <p className="text-sm font-semibold uppercase tracking-wider text-[#5B6167]">
            Authenticating Launch HQ...
          </p>
        </div>
      </div>
    );
  }

  // Screen 2: Unauthenticated - Google Sign In
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-4">
        <div className="bg-white border border-[#DCD6CB] rounded-[6px] w-full max-w-md p-8 text-center space-y-6">
          <div className="flex justify-center">
            <LogoMark size={44} />
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#5B6167]">
              Private Command Center
            </div>
            <h1 className="font-heading text-3xl font-bold uppercase tracking-tight text-[#22272B]">
              Rigpilot Launch HQ
            </h1>
            <p className="text-sm text-[#5B6167] leading-relaxed max-w-[36ch] mx-auto">
              Sign in with your Google account. The first authenticated account claims permanent ownership.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-[#FAF8F4] border border-[#991B1B] rounded-[6px] text-xs text-[#991B1B] text-left">
              {authError}
            </div>
          )}

          <button
            type="button"
            onClick={handleSignIn}
            disabled={signingIn}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider"
          >
            <LogIn className="w-4 h-4 stroke-[2]" />
            {signingIn ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div className="text-[12px] text-[#5B6167] flex items-center justify-center gap-1.5 pt-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Strict Firestore role security enforced</span>
          </div>
        </div>
      </div>
    );
  }

  // Screen 3: Authenticated but Not Owner
  if (isOwner === false) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-4">
        <div className="bg-white border border-[#DCD6CB] rounded-[6px] w-full max-w-md p-8 text-center space-y-5">
          <div className="w-12 h-12 rounded-[6px] bg-[#FAF8F4] border border-[#DCD6CB] mx-auto flex items-center justify-center text-[#991B1B]">
            <ShieldAlert className="w-6 h-6 stroke-[2]" />
          </div>

          <div className="space-y-1.5">
            <h1 className="font-heading text-2xl font-bold uppercase tracking-tight text-[#22272B]">
              Access Restricted
            </h1>
            <p className="text-sm text-[#5B6167] leading-relaxed">
              This Launch HQ has already been claimed by another owner account.
            </p>
            <p className="text-xs font-mono text-[#5B6167] bg-[#FAF8F4] p-2 rounded border border-[#DCD6CB]">
              Signed in as: {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={() => auth.signOut()}
            className="btn-secondary w-full py-2.5 text-xs font-semibold uppercase tracking-wider"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // Screen 4: Verified Owner Launch HQ Dashboard (ONE COLUMN, 780px)
  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#22272B]">
      <AdminHeader userEmail={user.email || 'Owner'} />

      <main className="max-w-[780px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Section 1: Signups Feed */}
        <SignupsSection
          leads={leads}
          loading={leadsLoading}
          error={leadsError}
        />

        {/* Section 2: Launch Kit */}
        <LaunchKitSection
          liveUrl={liveUrl}
          onLiveUrlChange={handleLiveUrlChange}
        />

        {/* Section 3: Welcome Emails */}
        <WelcomeEmailsSection />

        {/* Section 4: Checklist */}
        <ChecklistSection
          checklist={checklist}
          onToggle={handleToggleChecklist}
        />

        {/* Section 5: Verdict */}
        <VerdictSection
          totalSignups={leads.length}
          visitorCount={visitorCount}
          onVisitorCountChange={handleVisitorCountChange}
        />
      </main>
    </div>
  );
};
