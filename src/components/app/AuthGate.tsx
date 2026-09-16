import React, { useState } from 'react';
import { LogoMark } from '../LogoMark';
import { LogIn, ArrowLeft, ShieldCheck } from 'lucide-react';
import { signInWithGoogle, trackAnalyticsEvent } from '../../lib/firebase';

interface AuthGateProps {
  onReturnHome: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onReturnHome }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      await trackAnalyticsEvent(user.uid, 'signup', { source: 'app_auth_gate' });
    } catch (err) {
      console.error('Sign-in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col justify-between p-4 sm:p-6 text-[#22272B]">
      {/* Top return */}
      <div className="max-w-md mx-auto w-full pt-4">
        <button
          type="button"
          onClick={onReturnHome}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5B6167] hover:text-[#22272B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Overview
        </button>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md mx-auto w-full bg-white border border-[#DCD6CB] rounded-[6px] p-8 sm:p-10 text-center space-y-6">
        <div className="flex justify-center">
          <LogoMark size={48} />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#5B6167]">
            Remote Command Station
          </div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight text-[#22272B]">
            Sign in to Rigpilot
          </h1>
          <p className="text-sm text-[#5B6167] leading-relaxed max-w-[34ch] mx-auto">
            Access your live shift telematics diagnostic engine, fleet roster, and 3-seat remote command planner.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#FAF8F4] border border-[#991B1B] rounded-[6px] text-xs text-[#991B1B] text-left">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleSignIn}
          disabled={loading}
          className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider"
        >
          <LogIn className="w-4 h-4 stroke-[2]" />
          {loading ? 'Authenticating with Google...' : 'Continue with Google'}
        </button>

        <div className="pt-2 border-t border-[#DCD6CB] flex items-center justify-center gap-2 text-[12px] text-[#5B6167]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Encrypted Firestore Workspace · Zero spam</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[#5B6167] pb-4 font-mono">
        RIGPILOT TELEMATICS · 0.0.0.0:3000
      </div>
    </div>
  );
};
