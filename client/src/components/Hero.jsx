import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, 400]);
  const y2 = useTransform(scrollY, [0, 800], [0, -200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.9]);

  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center px-6 overflow-hidden perspective-1000">
      <motion.div 
        style={{ y: y1, opacity, scale }}
        className="z-10 text-center max-w-5xl mx-auto"
      >
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.2, ease: "easeOut" }}
           className="mb-8"
        >
          <span className="px-6 py-2 bg-brand-900/50 border border-brand-500/30 rounded-full text-brand-300 font-medium tracking-[0.3em] uppercase text-xs backdrop-blur-md shadow-[0_0_20px_rgba(74,120,123,0.3)]">
            Senior Full-Stack Engineer & IT Manager
          </span>
        </motion.div>
        
        <div className="overflow-hidden mb-6">
          <motion.h1 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring", bounce: 0.2 }}
            className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.9]"
          >
            Aayush <span className="text-gradient">Bhandari</span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="text-xl md:text-3xl text-brand-200/80 max-w-3xl mx-auto font-light leading-relaxed mb-12"
        >
          Architecting highly scalable, AI-driven infrastructure and massive e-commerce platforms. Over 18 production-grade projects deployed.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-6"
        >
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="http://localhost:5001/api/cv" 
            download
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-brand-600 to-brand-400 hover:from-brand-500 hover:to-brand-300 text-white rounded-full font-bold transition-all duration-300 shadow-[0_0_30px_rgba(74,120,123,0.5)]"
          >
            Download CV
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#projects" 
            className="w-full sm:w-auto px-10 py-5 glass text-white rounded-full font-bold transition-all duration-300"
          >
            Explore Projects
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(62,97,101,0.5)" }}
            whileTap={{ scale: 0.95 }}
            href="#about" 
            className="w-full sm:w-auto px-10 py-5 glass text-white rounded-full font-bold transition-all duration-300"
          >
            View Experience
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Decorative Floating Elements */}
      <motion.div 
        style={{ y: y2 }}
        animate={{ 
          rotate: [0, 10, -10, 0],
          y: [0, -20, 20, 0]
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-brand-400/10 rounded-full blur-[100px] z-0 pointer-events-none"
      ></motion.div>
    </section>
  );
};
