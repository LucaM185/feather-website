import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, Aperture, Sliders, Sparkles, LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  backgroundMedia?: React.ReactNode;
  children: React.ReactNode; // The "Front" visual
  className?: string;
  iconColorClass?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  gradient, 
  backgroundMedia,
  children, 
  className,
  iconColorClass = "text-white"
}) => {
  return (
  <div className={`group transform-gpu [will-change:transform] [backface-visibility:hidden] transition-transform duration-300 hover:scale-[1.03] ${className}`}>
    <div className="relative h-full rounded-3xl overflow-hidden [clip-path:inset(0_round_1.5rem)] isolate bg-zinc-900 border border-white/5 [backface-visibility:hidden]">
      {backgroundMedia}
      {/* Hover Background Gradient (Fades In) */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative h-full flex flex-col p-8 z-10">
        {/* Persistent Header (Icon + Title) - Stays exact same place */}
        <div className="flex items-center gap-3 mb-6 shrink-0">
          <div className={`p-2 rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors`}>
            <Icon className={`w-6 h-6 ${iconColorClass} group-hover:text-white transition-colors`} />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                </div>

        {/* Body Content Container */}
        <div className="relative flex-1 min-h-[120px]">
          {/* Front Visual (Fades Out) */}
          <div className="absolute inset-0 flex flex-col justify-end transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-2">
            {children}
          </div>

          {/* Back Description (Fades In) */}
          <div className="absolute inset-0 flex flex-col justify-center transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
            <p className="text-white/90 font-medium leading-relaxed text-lg">
              {description}
            </p>
          </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const FeatureGrid: React.FC = () => {
  return (
    <section className="w-full py-24 px-4 md:px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[280px]"
        >
          {/* SAM - Largest */}
          <FeatureCard 
            className="col-span-1 md:col-span-6 lg:col-span-8 lg:row-span-2"
            icon={Sparkles}
            title="SAM Masks"
            description="Segment anything instantly with many masks."
            gradient="from-blue-600 to-indigo-500"
            iconColorClass="text-blue-300"
            backgroundMedia={
              <>
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src="/images/feather-SAM.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/35" />
              </>
            }
          >
            <div className="mt-auto flex items-center gap-2">
              <span className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded text-[18px] font-bold uppercase tracking-wider border border-blue-500/30">
                    SAM2 model
                </span>
            </div>

          </FeatureCard>

          {/* Color Mixer - Small Vertical */}
          <FeatureCard
            className="col-span-1 md:col-span-6 lg:col-span-4 lg:row-span-2"
            icon={Sliders}
            title="Color Mixer"
            description="Dial in individual color channels with floating-point precision."
            gradient="from-cyan-500 to-blue-500"
            iconColorClass="text-cyan-300"
            backgroundMedia={
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/colormixer.png')" }}
                />
                <div className="absolute inset-0 bg-black/40" />
              </>
            }
          >
            <div className="mt-auto flex items-center gap-2">
              <span className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 rounded text-[18px] font-bold uppercase tracking-wider border border-cyan-500/30">
                    8-Channel HSL
                </span>
            </div>
          </FeatureCard>

          {/* Tones / Sharp */}
          <FeatureCard
            className="col-span-1 md:col-span-2 lg:col-span-4"
            icon={Aperture}
            title="Smart Sharpness"
            description="Adaptive edge detection enhances texture without adding noise artifacts. Making stacking effortless and precise."
            gradient="from-zinc-600 to-zinc-400"
            iconColorClass="text-zinc-300"
          >
             <div className="mt-auto">
                <div className="flex items-center justify-between text-xs text-zinc-500 font-mono mb-2">
                    <span>SOFT</span>
                    <span className="text-white">SHARP</span>
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-white rounded-full"></div>
                </div>
             </div>
          </FeatureCard>

          {/* Trackpad Centered */}
          <FeatureCard
             className="col-span-1 md:col-span-2 lg:col-span-4"
             icon={Layers}
             title="Trackpad Centered"
             description="Designed for MacBook usage. Intuitive gestures make image navigation effortless. The entire UI is ergonomically optimized for trackpad speed and precision."
             gradient="from-emerald-600 to-teal-500"
             iconColorClass="text-emerald-400"
          >
             <div className="flex flex-col gap-2 mt-auto">
                 <div className="h-8 w-full bg-zinc-800/50 rounded border border-white/5 flex items-center px-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                    <div className="h-1 w-12 bg-zinc-600 rounded"></div>
                 </div>
                 <div className="h-8 w-full bg-zinc-800/50 rounded border border-white/5 flex items-center px-3 opacity-50">
                    <div className="w-2 h-2 rounded-full bg-zinc-600 mr-2"></div>
                    <div className="h-1 w-16 bg-zinc-600 rounded"></div>
                 </div>
             </div>
          </FeatureCard>

           {/* Gen AI Infill */}
           <FeatureCard
            className="col-span-1 md:col-span-2 lg:col-span-4"
            icon={Zap}
            title="Reality Synthesis"
            description="Expand your canvas or remove distractions. Our generative model understands context, lighting, and texture to fill gaps seamlessly."
            gradient="from-amber-500 to-orange-600"
            iconColorClass="text-amber-400"
            backgroundMedia={
              <>
                <div className="absolute inset-0 bg-[url('/images/firstimage.png')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-black/45" />
              </>
            }
           >
            <div className="mt-auto flex items-center gap-2">
              <span className="px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded text-[18px] font-bold uppercase tracking-wider border border-amber-500/30">
                    GenAI Infill
                </span>
            </div>
          </FeatureCard>

        </motion.div>
      </div>
    </section>
  );
};

export default FeatureGrid;
