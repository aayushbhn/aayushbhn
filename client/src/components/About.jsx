import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const About = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const experiences = [
    {
      title: "IT Head / Lead Developer / Manager",
      company: "NEPA RUDRAKSHA",
      period: "Sept 2022 - Present",
      description: "Directed massive digital transformation. Handled everything from Veda AI backend, accounting systems, robust inventory systems, to WhatsApp Business implementations and CRM deployments.",
      highlight: true
    },
    {
      title: "Full-Stack AI Integrator",
      company: "Bharosa Real Estate",
      period: "Project Phase",
      description: "Implemented a complete real estate CRM & Marketplace platform using monorepo TS logic and integrated hybrid ML recommendation algorithms.",
      highlight: false
    }
  ];

  const education = [
    { inst: "Sagarmatha Engineering College", deg: "BE in Computer Engineering (Dropout)", yr: "2019 – 2024" },
    { inst: "KMC College, Bagbazar", deg: "+2 Science", yr: "Graduated" },
    { inst: "Nepal APF School", deg: "Schooling", yr: "Completed" }
  ];

  return (
    <section id="about" className="relative w-full max-w-7xl mx-auto py-32 px-6 overflow-hidden">
      <motion.div style={{ y }} className="absolute right-0 top-1/4 w-96 h-96 bg-brand-700/10 blur-[120px] rounded-full pointer-events-none"></motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
        
        {/* Experience Column */}
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white">Career <span className="text-gradient">Trajectory</span></h2>
          <div className="space-y-10">
            {experiences.map((exp, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.03, x: 10 }}
                className={`glass-card p-8 rounded-3xl border-l-4 ${exp.highlight ? 'border-l-brand-400' : 'border-l-brand-800'}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                  <h3 className="text-2xl font-bold text-white">{exp.title}</h3>
                  <span className="px-4 py-1 bg-brand-900/80 rounded-full text-brand-300 font-mono text-sm shadow-inner">{exp.period}</span>
                </div>
                <h4 className="text-brand-400 mb-4 font-bold tracking-widest uppercase text-sm">{exp.company}</h4>
                <p className="text-brand-100/70 text-lg leading-relaxed">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education Column */}
        <motion.div
           initial={{ opacity: 0, x: 50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white">Education <span className="text-gradient">Background</span></h2>
          <div className="space-y-8">
            {education.map((edu, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-r from-brand-900/40 to-transparent p-8 rounded-2xl border border-brand-800/30"
              >
                <h3 className="text-xl font-bold text-white mb-2">{edu.inst}</h3>
                <div className="flex justify-between text-brand-300">
                  <span className="font-medium text-brand-200">{edu.deg}</span>
                  <span className="font-mono text-sm px-3 py-1 bg-brand-950 rounded border border-brand-800">{edu.yr}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
