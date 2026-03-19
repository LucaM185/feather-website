import React from 'react';
import { motion } from 'framer-motion';

const Story: React.FC = () => {
  return (
    <section className="w-full py-32 px-6 bg-black flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="max-w-2xl relative"
      >
        {/* Decorative Tape effect */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-100/10 rotate-2 backdrop-blur-sm"></div>

        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 handwritten text-white/90">The Story</h2>

        <div className="handwritten text-xl md:text-3xl leading-relaxed text-zinc-300 space-y-8">
          <p>
            I'm a 21yo CS student from Italy and I always wondered how cool it would be to build a real camera with the processing of a phone.
          </p>
          <p>
            While on a trip on the Italian Alps the idea randomly struck me: <span className="text-white">I can actually build something to make computational photography accessible.</span>
          </p>
          <p>
            I built a prototype editor in 2 weeks, then I designed a new system from scratch on 20 sheets of A3 paper spread over 2 desks. 
          </p>
          <p className="text-center text-white text-2xl md:text-4xl mt-12 rotate-1">
            After months, Feather is here
          </p>
        </div>

        <div className="mt-16 border-t border-zinc-800 pt-8 flex justify-between items-end">
          <div className="handwritten text-xl text-zinc-500">
            Luca Miglioli
            <br />
            <span className="text-sm font-sans tracking-widest uppercase">Founder</span>
          </div>
          {/* Signature Doodle */}
          <svg width="100" height="40" viewBox="0 0 100 45" className="opacity-50 stroke-white fill-none" style={{ strokeWidth: 2 }}>
            <path d="M10,30 Q30,5 50,30 T90,20" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default Story;