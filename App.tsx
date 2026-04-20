import React, { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Hero from './components/Hero';
import SubPixelSection from './components/SubPixelSection';
import ImageGallery from './components/ImageGallery';
import FeatureGrid from './components/FeatureGrid';
import Story from './components/Story';
import Footer from './components/Footer';

// ── CONFIG ─────────────────────────────────────────────────────────────────────
// Get your Client ID from https://console.cloud.google.com → APIs & Services → Credentials
// Add your site's origin to "Authorized JavaScript origins" (e.g. http://localhost:5173)
const GOOGLE_CLIENT_ID = '1011411866342-dbiq1cdoiciptmpv63b19aqghj5i0qfm.apps.googleusercontent.com';
const STRIPE_URL = 'https://buy.stripe.com/4gM00kfe8719cIMbo38AE00';
const SUPABASE_URL = 'https://yfegmloncjaoyzhmnoyk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UplZm3WQVagiE0Ait4RNeA_68xIpoLR'; // TODO: replace with your anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const parseJWTPayload = (token: string): Record<string, string> => {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
};

const generateNonce = async (): Promise<[string, string]> => {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(nonce));
  const hashedNonce = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  return [nonce, hashedNonce]; // [raw nonce → Supabase, hex hash → Google]
};

const App: React.FC = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; };
  }, []);

  const [userEmail, setUserEmail] = useState<string | null>(
    () => localStorage.getItem('feather_user_email')
  );
  const [hasLicense, setHasLicense] = useState(false);
  const [licenseLoading, setLicenseLoading] = useState(() => !!localStorage.getItem('feather_auth_token'));
  const pendingBuyRef = useRef(false);
  const nonceRef = useRef<[string, string] | null>(null);

  const redirectToStripe = (email: string) => {
    window.location.href = `${STRIPE_URL}?prefilled_email=${encodeURIComponent(email)}`;
  };

  const checkLicense = async (accessToken: string): Promise<boolean> => {
    setLicenseLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/issue-license`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: '{}',
      });
      const paid = res.status === 200;
      console.log('issue-license status:', res.status, 'paid:', paid);
      setHasLicense(paid);
      return paid;
    } catch (err) {
      console.error('issue-license error:', err);
      return false;
    } finally {
      setLicenseLoading(false);
    }
  };

  // On page load, check license if token exists, or pick up a session from an OAuth redirect
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const email = session.user.email ?? '';
        setUserEmail(email);
        localStorage.setItem('feather_user_email', email);
        localStorage.setItem('feather_auth_token', session.access_token);
        const paid = await checkLicense(session.access_token);
        if (localStorage.getItem('feather_pending_buy') === '1') {
          localStorage.removeItem('feather_pending_buy');
          if (!paid && email) redirectToStripe(email);
        }
        return;
      }
      const token = localStorage.getItem('feather_auth_token');
      if (token) checkLicense(token);
    })();
  }, []);

  const redirectToGoogleLogin = async () => {
    if (pendingBuyRef.current) localStorage.setItem('feather_pending_buy', '1');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://feather-editor.it' },
    });
  };

  const handleGoogleCredential = async (response: { credential: string }) => {
    const { email } = parseJWTPayload(response.credential);
    setUserEmail(email);
    localStorage.setItem('feather_user_email', email);

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
      nonce: nonceRef.current?.[0],
    });

    if (error || !data.session) {
      console.error('Supabase sign-in error:', error);
      return;
    }

    const accessToken = data.session.access_token;
    localStorage.setItem('feather_auth_token', accessToken);

    const paid = await checkLicense(accessToken);

    if (pendingBuyRef.current) {
      pendingBuyRef.current = false;
      if (!paid) redirectToStripe(email);
    }
  };

  const handleBuyAccess = async () => {
    const token = localStorage.getItem('feather_auth_token');
    if (token) {
      const paid = await checkLicense(token);
      if (!paid && userEmail) redirectToStripe(userEmail);
      return;
    }
    pendingBuyRef.current = true;
    const g = (window as any).google;
    if (!g?.accounts?.id) {
      await redirectToGoogleLogin();
      return;
    }
    g.accounts.id.prompt((notification: any) => {
      if (notification.isSkippedMoment?.() || notification.isDismissedMoment?.()) {
        redirectToGoogleLogin();
      }
    });
  };

  useEffect(() => {
    const SCRIPT_ID = 'google-gsi';

    const initGoogle = async () => {
      const g = (window as any).google;
      if (!g?.accounts?.id) return;
      const nonce = await generateNonce();
      nonceRef.current = nonce;
      g.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
        nonce: nonce[1],
        error_callback: () => console.log('GSI initialization error'),
      });
    };

    if ((window as any).google?.accounts?.id) { initGoogle(); return; }

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    }
  }, []);

  const handleDownload = () => {
    window.location.href = 'https://cdn.feather-editor.it/Feather-Stable.dmg'; // dmg should work this time
  };
 
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/50 border-b border-white/5">
        <div className="text-xl font-bold tracking-tighter">Feather</div>
        <div className="flex items-center gap-3">
          {userEmail && ( 
            <>
              <span className="text-sm text-zinc-400 max-w-[200px] truncate">{userEmail}</span>
              <button
                onClick={async () => {
                  localStorage.removeItem('feather_user_email');
                  localStorage.removeItem('feather_auth_token');
                  localStorage.removeItem('feather_pending_buy');
                  setUserEmail(null);
                  setHasLicense(false);
                  (window as any).google?.accounts.id.disableAutoSelect();
                  await supabase.auth.signOut();
                }}
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </>
          )}
          <button
            onClick={hasLicense ? undefined : handleBuyAccess}
            disabled={hasLicense}
            className="text-sm font-medium px-4 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-70 disabled:cursor-default"
          >
            {hasLicense ? 'You have a License' : 'Buy Access'}
          </button>
        </div>
      </nav>

      <main className="flex flex-col items-center w-full">
        <Hero onPurchase={handleDownload} loading={licenseLoading} />
        <SubPixelSection />
        <ImageGallery />
        <FeatureGrid />
        <Story />
      </main>

      <Footer />
    </div>
  );
};

export default App;
