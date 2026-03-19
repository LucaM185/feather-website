import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GALLERY_IMAGES = [
  { id: 'stack-reference', src: '/images/stack-reference.png', label: 'Stack Reference', type: 'image' as const },
  { id: 'sam-infill', src: '/images/feather-SAM-INFILL.m4v', label: 'SAM Inpainting', type: 'video' as const },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '60%' : '-60%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-60%' : '60%',
    opacity: 0,
  }),
};

const ImageGallery: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    setIsAutoRotating(false);
  };

  const next = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % GALLERY_IMAGES.length);
    setIsAutoRotating(false);
  };

  // Auto-rotate every 3 seconds
  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % GALLERY_IMAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Re-enable rotation when carousel comes back into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAutoRotating(true);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const current = GALLERY_IMAGES[index];

  return (
    <section ref={containerRef} className="w-full flex flex-col items-center py-20 px-6 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-4xl"
      >
        {/* Image area */}
        <div className="relative w-full flex items-center justify-center gap-4">
          {/* Left arrow */}
          <button
            onClick={prev}
            className="flex-shrink-0 z-10 p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all"
            aria-label="Previous"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Sliding image/video */}
          <div className="relative flex-1 overflow-hidden rounded-xl border border-white/10 shadow-2xl" style={{ minHeight: 260 }}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {current.type === 'video' ? (
                <motion.video
                  key={current.id}
                  src={current.src}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-full h-full object-contain max-h-[420px] bg-black"
                  controls
                  autoPlay
                  loop
                />
              ) : (
                <motion.img
                  key={current.id}
                  src={current.src}
                  alt={current.label}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-full h-full object-contain max-h-[420px] bg-black"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            className="flex-shrink-0 z-10 p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all"
            aria-label="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Label + dots */}
        <div className="mt-5 flex flex-col items-center gap-3">
          <p className="text-zinc-400 font-mono text-sm">{current.label}</p>
          <div className="flex gap-2">
            {GALLERY_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-white scale-125' : 'bg-white/25 hover:bg-white/50'}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ImageGallery;
