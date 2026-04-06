import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Apple, Monitor } from 'lucide-react';

const words = ["Camera's", "Creator's", "Full Frame", "Real"];

const Hero: React.FC<{ onPurchase: () => void; loading?: boolean }> = ({ onPurchase, loading = false }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const scrollToFeatures = () => {
    const featureSection = document.getElementById('features-start');
    if (featureSection) {
      featureSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-black">
      {/* Background Image (30% opacity) */}
      <div className="absolute inset-0 bg-[url('/images/firstimage.png')] bg-cover bg-center opacity-10 z-0" />
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-2 mb-12 flex flex-col items-center z-10 w-full max-w-[900px]"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 whitespace-nowrap">
          <span className="inline-flex items-center gap-x-2 md:gap-x-3">
            <span>Phone&apos;s</span>
            <span>Brain.</span>
          </span>
        </h1>
        {/* Desktop version with rotating words */}
        <div className="hidden md:flex w-full flex-row justify-center items-center gap-x-2 md:gap-x-3 text-6xl lg:text-7xl font-bold tracking-tight whitespace-nowrap">
          <div className="relative h-[1.3em] w-[6ch]">
            <div className="absolute right-0 h-[1.3em] w-[11ch] overflow-hidden text-right flex items-center justify-end">
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[index]}
                  initial={{ y: 80, opacity: 0, rotateX: -45 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  exit={{ y: -80, opacity: 0, rotateX: 45 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 text-blue-400 block pb-1"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 pb-1">Heart.</span>
        </div>

        {/* Mobile version - fixed text */}
        <div className="md:hidden text-4xl font-bold tracking-tight text-center whitespace-nowrap">
          <span className="text-blue-400">Creator's</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 ml-2"> Heart.</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex gap-4 mb-24 z-10"
      >
        <button disabled={loading} onClick={onPurchase} className="flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all duration-300 group disabled:opacity-40 disabled:cursor-not-allowed">
          <Apple className="w-5 h-5 group-hover:fill-current" />
          <span className="font-medium">macOS</span>
        </button>
        <button disabled className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl transition-all duration-300 group opacity-40 cursor-not-allowed">
          <Monitor className="w-5 h-5 text-zinc-400" />
          <span className="font-medium">Windows (Coming Soon)</span>
        </button>
      </motion.div>

      <motion.button
        onClick={scrollToFeatures}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors cursor-pointer z-10"
      >
        <span className="text-sm font-medium tracking-wide">Features</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.button>
    </section>
  );
};

export default Hero;
