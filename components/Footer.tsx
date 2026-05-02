import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-10 border-t border-zinc-900 text-center text-zinc-600 text-sm space-y-2">
      <p>&copy; {new Date().getFullYear()} Feather. Built in Italy 🇮🇹</p>
      <p>
        Need help?{' '}
        <a
          href="mailto:lucam185.feather@gmail.com"
          className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2"
        >
          lucam185.feather@gmail.com
        </a>
      </p>
      <p>
        <a href="/terms" className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2">
          Terms of Service
        </a>
      </p>
    </footer>
  );
};

export default Footer;