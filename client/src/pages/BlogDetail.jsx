import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { motion, useScroll, useSpring } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs/${slug}`);
        setBlog(res.data);
        
        document.title = `${res.data.title} | Engineering Insights`;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = "description";
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = res.data.content.substring(0, 160) + "..."; 
      } catch (err) {
        console.error("Blog not found or API down");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    
    return () => { document.title = "Aayush Bhandari | Portfolio Engine"; };
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-brand-950 flex justify-center items-center"><div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!blog) return <div className="min-h-screen bg-brand-950 flex justify-center items-center text-white text-3xl font-bold">Article Not Found</div>;

  return (
    <div className="min-h-screen bg-[#0a0f12] text-white font-sans overflow-x-hidden selection:bg-brand-500 selection:text-white pb-32">
      
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-brand-500 origin-left z-[100]" style={{ scaleX }} />

      {/* Abstract Background Mapping */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-700/10 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[150px]"></div>
      </div>

      <nav className="w-full relative z-50 p-6 md:px-12 md:py-8 lg:mb-12 flex items-center justify-between">
        <Link to="/" onClick={(e) => {
          e.preventDefault();
          if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
          } else {
            navigate('/', { replace: true });
          }
        }} className="inline-flex items-center gap-3 text-brand-300 hover:text-white font-bold tracking-widest text-xs lg:text-sm uppercase transition-colors group">
          <span className="w-10 h-10 rounded-full bg-brand-900/50 border border-brand-800 flex items-center justify-center group-hover:bg-brand-500 group-hover:border-brand-500 transition-all shadow-lg">←</span> Engine Repository
        </Link>
        <span className="text-brand-500 font-mono text-sm tracking-widest opacity-60">ARTICLE_v1.0</span>
      </nav>

      <motion.article 
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} 
        className="px-6 max-w-[800px] mx-auto relative z-10"
      >
        <header className="mb-14">
          <div className="mb-8 flex flex-col md:flex-row md:items-center gap-6 border-b border-brand-800/40 pb-8">
            <span className="px-4 py-1.5 bg-brand-500/10 text-brand-400 font-mono text-xs uppercase tracking-widest border border-brand-500/20 rounded-md w-fit">Deep Dive Insight</span>
            <div className="flex items-center gap-3 text-brand-400/80 font-mono text-sm">
               <span>WRITTEN ON:</span>
               <span className="text-white font-bold">{new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.2] mb-12 tracking-tight">
            {blog.title}
          </h1>
        </header>

        {blog.image && (
          <div className="mb-16 -mx-4 md:-mx-12 lg:-mx-20 relative group">
             <div className="absolute inset-0 bg-brand-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             <img 
              src={blog.image} alt="Header Visualization" 
              className="w-full h-[400px] md:h-[550px] object-cover rounded-[32px] md:rounded-[48px] shadow-[0_20px_60px_-15px_rgba(74,120,123,0.2)] border border-brand-800/40 relative z-10" 
             />
          </div>
        )}
        
        <div className="prose prose-invert prose-brand prose-lg md:prose-xl max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:text-white prose-h2:mt-16 prose-h2:mb-8 prose-h3:text-brand-300 prose-p:text-brand-100/80 prose-p:font-light prose-p:leading-[2.2] prose-strong:text-brand-400 prose-ul:list-disc prose-li:text-brand-200 prose-a:text-brand-500 prose-blockquote:border-l-4 prose-blockquote:border-brand-500 prose-blockquote:bg-brand-900/20 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:not-italic prose-blockquote:rounded-r-xl prose-pre:bg-brand-950 prose-pre:border prose-pre:border-brand-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </div>
        
        {/* Author Footer block */}
        <div className="mt-32 p-8 md:p-12 bg-brand-900/30 border border-brand-800/50 rounded-[32px] flex flex-col md:flex-row items-center md:justify-between gap-8 backdrop-blur-sm">
           <div className="text-center md:text-left">
              <h4 className="text-brand-500 font-bold uppercase tracking-widest text-sm mb-2">Lead Architect</h4>
              <p className="text-2xl font-black text-white">Aayush Bhandari</p>
           </div>
           <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="px-8 py-4 bg-brand-950 border border-brand-800 text-brand-300 hover:text-white hover:border-brand-500 rounded-xl font-bold tracking-widest text-sm uppercase transition-all shadow-lg text-center">
             ↑ Ascend To Protocol
           </button>
        </div>
      </motion.article>
    </div>
  );
}
