import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

let globalProjectsCache = null;

export const Projects = () => {
  const [projects, setProjects] = useState(globalProjectsCache || []);
  const [loading, setLoading] = useState(!globalProjectsCache);

  useEffect(() => {
    if (globalProjectsCache) return;
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/projects`);
        globalProjectsCache = response.data;
        setProjects(response.data);
      } catch (error) {
        console.error("Backend offline");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.3 } }
  };

  return (
    <section id="projects" className="w-full max-w-7xl mx-auto py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden relative">
      <div className="text-center mb-10 sm:mb-20 relative z-10">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-white tracking-tight">Full-Stack <span className="text-gradient">Portfolio</span></h2>
        <p className="text-brand-300 max-w-3xl mx-auto text-base sm:text-xl font-light">
          A showcase of 18 scalable infrastructures, hybrid AI integrations, and natively engineered platforms.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center h-64"><div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 relative z-10">
          {projects.map((project) => {
            let tags = [];
            try { tags = JSON.parse(project.tags || '[]'); } catch { tags = typeof project.tags === 'string' ? project.tags.split(',') : []; }

            return (
              <Link to={`/project/${project.slug}`} key={project.id}>
                <motion.div 
                  variants={itemAnim}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className="group relative glass-card p-[2px] rounded-3xl overflow-hidden cursor-pointer h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-400 via-brand-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-spin-slow"></div>
                  <div className="relative bg-brand-950/90 backdrop-blur-xl h-full rounded-[22px] p-5 sm:p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-2xl font-extrabold text-white mb-3 sm:mb-4 group-hover:text-brand-300 transition-colors uppercase tracking-wide">{project.title}</h3>
                      <p className="text-brand-200 text-sm leading-relaxed mb-6 opacity-80">{project.description}</p>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, i) => (
                          <span key={i} className="text-xs font-semibold px-2 py-1 bg-brand-800/50 text-brand-300 rounded shadow-inner">{tag}</span>
                        ))}
                      </div>
                      <div className="text-brand-500 font-bold text-sm tracking-widest flex items-center justify-between border-t border-brand-800/50 pt-4">
                        VIEW DETAILS <span className="text-lg group-hover:translate-x-2 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </motion.div>
      )}
    </section>
  );
};
