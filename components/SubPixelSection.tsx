import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PREVIEWS = [
  { id: 'worst', src: '/images/worst_sharpness.JPG', label: 'Low Sharpness' },
  { id: 'mid', src: '/images/mid_sharpness.JPG', label: 'Medium Sharpness' },
  { id: 'best', src: '/images/best_sharpness.JPG', label: 'Best image' },
  { id: 'hybrid', src: '/images/hybrid_result.jpg', label: 'Feather Hybrid Result' },
];

const SubPixelSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(PREVIEWS[3]); // Default to result

  return (
    <section id="features-start" className="min-h-screen w-full flex flex-col items-center justify-center py-24 px-6 bg-black relative">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Sub-Pixel Alignment
          </span>
          <br />
          <span className="text-zinc-400">with Smart Blending.</span>
        </motion.h2>
      </div>

      <div className="mt-16 relative w-full max-w-[90%] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Input Stack */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full flex items-center justify-center cursor-pointer group"
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-full aspect-[4/3] transition-transform duration-500 ease-out group-hover:scale-[1.02]">
              <img
                src="/images/worst_sharpness.JPG"
                alt="Input Frame 1"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-xl border border-white/10 shadow-2xl opacity-40 transform -translate-x-8 -translate-y-8 transition-transform duration-500 group-hover:-translate-x-10 group-hover:-translate-y-10"
              />
              <img
                src="/images/mid_sharpness.JPG"
                alt="Input Frame 2"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-xl border border-white/10 shadow-2xl opacity-60 transform -translate-x-4 -translate-y-4 transition-transform duration-500 group-hover:-translate-x-6 group-hover:-translate-y-6"
              />
              <img
                src="/images/best_sharpness.JPG"
                alt="Reference Frame"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-xl border border-white/20 shadow-2xl z-10"
              />

              {/* Overlay Badge */}
              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-black/60 backdrop-blur-md text-white px-6 py-3 rounded-full border border-white/20 font-medium tracking-wide shadow-xl transform scale-95 group-hover:scale-100 transition-transform">
                  Explore Inputs
                </span>
              </div>

              <div className="absolute -bottom-12 left-0 right-0 text-center">
                <p className="text-zinc-400 font-mono text-sm group-hover:text-blue-400 transition-colors">8x Raw Inputs (Click to Inspect)</p>
              </div>
            </div>
          </motion.div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full flex items-center justify-center"
          >
            <div className="relative w-full aspect-[4/3]">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
              <img
                src="/images/hybrid_result.jpg"
                alt="Processed Result"
                className="relative w-full h-full object-cover rounded-xl border border-white/20 shadow-2xl z-20"
              />
              <div className="absolute -bottom-12 left-0 right-0 text-center">
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-mono text-sm font-bold">
                  Fused Output
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fullscreen Inspection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-lg"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-zinc-900/90 w-full max-w-7xl h-[85vh] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button Mobile / Tablet */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white/70 hover:text-white md:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              {/* Sidebar (List) */}
              <div className="w-full md:w-56 flex-shrink-0 bg-black/40 border-r border-white/10 p-4 flex flex-col gap-2 overflow-y-auto">
                {PREVIEWS.map((item) => (
                  <button
                    key={item.id}
                    onMouseEnter={() => setActiveImage(item)}
                    onClick={() => setActiveImage(item)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all text-center group ${activeImage.id === item.id
                      ? 'bg-white/10 border border-white/20 shadow-lg'
                      : 'bg-transparent border border-transparent hover:bg-white/5'
                      }`}
                  >
                    <div className={`w-full aspect-[4/3] rounded-lg overflow-hidden border ${activeImage.id === item.id ? 'border-white/50' : 'border-white/10 group-hover:border-white/30'}`}>
                      <img src={item.src} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full">
                      <p className={`text-sm font-medium ${activeImage.id === item.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                        {item.label}
                      </p>
                    </div>
                  </button>
                ))}

                <div className="mt-auto pt-6 text-xs text-zinc-600 px-2">
                  Hover over items to preview.<br />
                  Our sub-pixel alignment fuses the best parts of each frame.
                </div>
              </div>

              {/* Main Preview Area */}
              <div className="flex-1 w-full h-full bg-black/50 flex flex-col relative">
                {/* Header / Toolbar */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none">
                  <div className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg">
                    <p className="text-white font-mono text-sm">{activeImage.label}</p>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="pointer-events-auto p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors hidden md:block"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>

                {/* Image Container */}
                <div className="flex-1 w-full h-full p-4 md:p-8 flex items-center justify-center overflow-hidden">
                  <img
                    src={activeImage.src}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    alt={activeImage.label}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SubPixelSection;