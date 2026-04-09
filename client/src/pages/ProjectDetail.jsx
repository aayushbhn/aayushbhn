import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/projects/${slug}`);
        setProject(res.data);
        
        document.title = `${res.data.title} | Technical Architecture Documentation`;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
           metaDesc = document.createElement('meta');
           metaDesc.name = "description";
           document.head.appendChild(metaDesc);
        }
        metaDesc.content = res.data.description;
      } catch (err) {
        console.error("Project not found or API down");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
    
    return () => { document.title = "Aayush Bhandari | Portfolio Engine"; };
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-brand-950 flex justify-center items-center"><div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!project) return <div className="min-h-screen bg-brand-950 flex justify-center items-center text-white text-3xl font-bold">404 | System Not Found</div>;

  let tags = [];
  try { tags = JSON.parse(project.tags || '[]'); } catch { tags = typeof project.tags === 'string' ? project.tags.split(',') : []; }

  return (
    <div className="min-h-screen bg-brand-950 text-white font-sans overflow-x-hidden selection:bg-brand-500 pb-32">
      <nav className="w-full absolute top-0 z-50 p-6 md:p-12 border-b border-brand-800/30 bg-brand-950/80 backdrop-blur-md">
        <Link to="/" onClick={(e) => {
          e.preventDefault();
          if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
          } else {
            navigate('/', { replace: true });
          }
        }} className="inline-flex items-center gap-4 text-brand-300 hover:text-white font-bold tracking-widest text-sm uppercase transition-colors">
          <span className="w-8 h-8 rounded-full border border-brand-500 flex items-center justify-center bg-brand-900 shadow-lg">←</span> System Architecture Overview
        </Link>
      </nav>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 md:pt-48 px-6 max-w-7xl mx-auto">
        
        <header className="mb-16">
          <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] text-white">
            {project.title.replace(/^\\d+\\.\\s*/, '')}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-2xl text-brand-300 font-light max-w-3xl">
            {project.description}
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Main Body Content: Doc Formatting */}
          <motion.article 
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="lg:col-span-8 bg-brand-900/20 backdrop-blur-sm p-4 md:p-10 rounded-[32px] border border-brand-800/50 shadow-2xl relative"
          >
             {project.image && (
               <img src={project.image} alt="Architecture map" className="w-full h-auto rounded-2xl mb-12 shadow-xl border border-brand-700/50" />
             )}
            
             <div className="prose prose-invert prose-brand max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-white prose-h2:border-b prose-h2:border-brand-800/50 prose-h2:pb-4 prose-h3:text-brand-300 prose-ul:list-disc prose-li:text-brand-100 prose-p:text-brand-200 prose-p:font-light prose-p:leading-[1.9] prose-pre:bg-brand-950 prose-pre:border prose-pre:border-brand-800 prose-blockquote:border-l-4 prose-blockquote:border-brand-500 prose-blockquote:bg-brand-900/20 text-lg">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.full_details || "Awaiting architecture definitions."}
                </ReactMarkdown>
             </div>
          </motion.article>

          {/* Sticky Sidebar: Metadata & Tech */}
          <motion.aside 
            initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="lg:col-span-4 sticky top-32 space-y-8"
          >
             {/* Tech Stack Matrix */}
             <div className="bg-brand-900/40 p-8 rounded-[24px] border border-brand-700/60 shadow-lg">
                <h3 className="text-sm font-black text-brand-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-400"></span> Implementation Stack
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {tags.map((tag, i) => (
                    <span key={i} className="px-4 py-2 bg-brand-950 border border-brand-800 rounded-lg text-brand-200 font-bold text-sm shadow-inner shadow-brand-950/20">{tag}</span>
                  ))}
                  {tags.length === 0 && <span className="text-brand-400 text-sm">Stack specifics unavailable natively.</span>}
                </div>
             </div>

             {/* Links / External Routing */}
             <div className="bg-brand-900/40 p-8 rounded-[24px] border border-brand-700/60 shadow-lg">
                <h3 className="text-sm font-black text-brand-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span> Production State
                </h3>
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noreferrer" className="block w-full text-center py-4 bg-brand-500 text-white font-extrabold text-sm tracking-widest rounded-xl hover:bg-brand-400 shadow-[0_0_20px_rgba(74,120,123,0.3)] transition-all uppercase">
                    Launch Application
                  </a>
                ) : (
                  <div className="block w-full text-center py-4 bg-brand-950 text-brand-400 font-extrabold text-sm tracking-widest rounded-xl border border-brand-800/50 uppercase cursor-not-allowed">
                    Internal System / Offline
                  </div>
                )}
             </div>
          </motion.aside>

        </div>
      </motion.div>
    </div>
  );
}
