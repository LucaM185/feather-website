import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-zinc-900 text-center text-zinc-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Feather. Built with passion in Italy.</p>
    </footer>
  );
};

export default Footer;