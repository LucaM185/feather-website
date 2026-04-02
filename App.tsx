import React, { useEffect, useRef, useState } from 'react';
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

const parseJWTPayload = (token: string): Record<string, string> => {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
};

const App: React.FC = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; };
  }, []);

  const [userEmail, setUserEmail] = useState<string | null>(
    () => localStorage.getItem('feather_user_email')
  );
  // Set to true when macOS/Windows is clicked before the user has signed in
  const pendingPurchaseRef = useRef(false);

  const redirectToStripe = (email: string) => {
    window.location.href = `${STRIPE_URL}?prefilled_email=${encodeURIComponent(email)}`;
  };

  const handleGoogleCredential = (response: { credential: string }) => {
    const { email } = parseJWTPayload(response.credential);
    setUserEmail(email);
    localStorage.setItem('feather_user_email', email);
    if (pendingPurchaseRef.current) {
      pendingPurchaseRef.current = false;
      redirectToStripe(email);
    }
  };

  useEffect(() => {
    const SCRIPT_ID = 'google-gsi';

    const initGoogle = () => {
      const g = (window as any).google;
      if (!g?.accounts?.id) return;
      g.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    };

    if ((window as any).google?.accounts?.id) { initGoogle(); return; }

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    }
  }, []);

  // Called by Hero when the user clicks macOS or Windows
  const handlePurchase = () => {
    if (userEmail) {
      redirectToStripe(userEmail);
    } else {
      pendingPurchaseRef.current = true;
      (window as any).google?.accounts.id.prompt((notification: any) => {
        if (notification.isSkippedMoment?.() || notification.isDismissedMoment?.()) {
          pendingPurchaseRef.current = false;
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/50 border-b border-white/5">
        <div className="text-xl font-bold tracking-tighter">Feather</div>
        {userEmail && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400 max-w-[200px] truncate">{userEmail}</span>
            <button
              onClick={() => {
                localStorage.removeItem('feather_user_email');
                setUserEmail(null);
                (window as any).google?.accounts.id.disableAutoSelect();
              }}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </nav>

      <main className="flex flex-col items-center w-full">
        <Hero onPurchase={handlePurchase} />
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
