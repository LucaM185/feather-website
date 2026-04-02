import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ComparisonSlider: React.FC<{ src1: string; src2: string; label1: string; label2: string }> = ({ src1, src2, label1, label2 }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => { if (isDragging.current) updatePosition(e.clientX); };
    const onMouseUp = () => { isDragging.current = false; };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging.current) { e.preventDefault(); updatePosition(e.touches[0].clientX); }
    };
    const onTouchEnd = () => { isDragging.current = false; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [updatePosition]);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    if ('touches' in e) updatePosition(e.touches[0].clientX);
    else updatePosition(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black select-none cursor-col-resize"
      style={{ height: 420 }}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
    >
      {/* Right image (stacked) */}
      <img src={src2} alt={label2} draggable={false}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      />
      {/* Left image (single) */}
      <img src={src1} alt={label1} draggable={false}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />
      {/* Divider line */}
      <div className="absolute top-0 bottom-0 w-px bg-white/70 pointer-events-none" style={{ left: `${position}%` }} />
      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 15l-3-3 3-3" />
          <path d="M14 9l3 3-3 3" />
        </svg>
      </div>
      {/* Labels */}
      <span className="absolute bottom-3 left-3 text-xs text-white bg-black/60 px-2 py-1 rounded pointer-events-none">{label1}</span>
      <span className="absolute bottom-3 right-3 text-xs text-white bg-black/60 px-2 py-1 rounded pointer-events-none">{label2}</span>
    </div>
  );
};

type GalleryItem =
  | { id: string; src: string; label: string; type: 'image' }
  | { id: string; src: string; label: string; type: 'video'; poster: string }
  | { id: string; src: string; src2: string; label: string; label1: string; label2: string; type: 'comparison' };

const GALLERY_IMAGES: GalleryItem[] = [
  {
    id: 'reference-comparison',
    src: '/images/reference-unstacked.jpg',
    src2: '/images/reference-stacked.jpg',
    label: 'Drag to compare',
    label1: 'Simple picture, edited',
    label2: '50 images stacked, edited',
    type: 'comparison',
  },
  { id: 'stack-reference', src: '/images/stack-reference.png', label: 'Stack Reference', type: 'image' },
  { id: 'sam-infill', src: '/images/feather-SAM-INFILL.mp4', label: 'SAM Inpainting', type: 'video', poster: '/images/feather-SAM-INFILL-poster.png' },
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
              {current.type === 'comparison' ? (
                <motion.div
                  key={current.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onMouseDown={() => setIsAutoRotating(false)}
                >
                  <ComparisonSlider src1={current.src} src2={current.src2} label1={current.label1} label2={current.label2} />
                </motion.div>
              ) : current.type === 'video' ? (
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
                  preload="metadata"
                  poster={current.poster}
                  muted
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
          <p className="text-zinc-400 font-mono text-base md:text-sm">{current.label}</p>
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
