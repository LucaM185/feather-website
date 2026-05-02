import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
    <div className="text-zinc-400 leading-relaxed space-y-3">{children}</div>
  </section>
);

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 py-4 backdrop-blur-md bg-black/50 border-b border-white/5">
        <a href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          Feather
        </a>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pt-28 pb-24">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-zinc-500 text-sm mb-12">Last updated: May 2, 2026</p>

        <Section title="1. Acceptance">
          <p>
            By purchasing or downloading Feather, you agree to these Terms of Service. If you do not
            agree, do not use the software.
          </p>
        </Section>

        <Section title="2. License">
          <p>
            Feather is sold as a single-user, non-transferable license. You may install and use the
            software on your own macOS devices. You may not resell, sublicense, or distribute the
            software or your license key.
          </p>
        </Section>

        <Section title="3. Purchases &amp; Refunds">
          <p>
            Purchases are processed by Gumroad. If you are not satisfied, you may request a full
            refund within 14 days of purchase by emailing{' '}
            <a
              href="mailto:lucam185.feather@gmail.com"
              className="text-white underline underline-offset-2 hover:text-zinc-300 transition-colors"
            >
              lucam185.feather@gmail.com
            </a>
            . Refunds are processed manually and typically handled within a few business days. Requests
            made after 14 days will not be accepted.
          </p>
        </Section>

        <Section title="4. Updates">
          <p>
            A license purchase includes all updates released during the current major version. Future
            major versions may require a new purchase. We will communicate any such changes in advance.
          </p>
        </Section>

        <Section title="5. Privacy">
          <p>
            Feather does not collect personal data. When you sign in with Google to verify your
            purchase, your email address is used solely to confirm license ownership and is not shared
            with third parties.
          </p>
        </Section>

        <Section title="6. Disclaimer of Warranties">
          <p>
            Feather is provided "as is" without warranties of any kind. We do not guarantee that the
            software will be error-free or uninterrupted. Your use of Feather is at your own risk.
          </p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, Feather and its developer shall not be
            liable for any indirect, incidental, or consequential damages arising from your use of the
            software.
          </p>
        </Section>

        <Section title="8. Governing Law">
          <p>
            These terms are governed by the laws of Italy. Any disputes shall be subject to the
            exclusive jurisdiction of the courts of Italy.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Questions about these terms?{' '}
            <a
              href="mailto:lucam185.feather@gmail.com"
              className="text-white underline underline-offset-2 hover:text-zinc-300 transition-colors"
            >
              lucam185.feather@gmail.com
            </a>
          </p>
        </Section>
      </main>

      <footer className="py-10 border-t border-zinc-900 text-center text-zinc-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Feather. Built in Italy 🇮🇹</p>
      </footer>
    </div>
  );
};

export default Terms;
