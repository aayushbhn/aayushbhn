import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

let globalBlogsCache = null;

export const Blogs = () => {
  const [blogs, setBlogs] = useState(globalBlogsCache || []);
  const [loading, setLoading] = useState(!globalBlogsCache);

  useEffect(() => {
    if (globalBlogsCache) return;
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/blogs');
        globalBlogsCache = response.data;
        setBlogs(response.data);
      } catch (error) {
        console.error("Backend offline");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', bounce: 0.3 } }
  };

  return (
    <section id="blogs" className="w-full max-w-7xl mx-auto py-32 px-6 overflow-hidden relative">
      <div className="absolute left-0 top-1/4 w-96 h-96 bg-brand-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="text-center mb-20 relative z-10">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight">Engineering <span className="text-gradient">Insights</span></h2>
        <p className="text-brand-300 max-w-2xl mx-auto text-xl font-light">
          Deep technical dives into solving bottlenecks across large-scale SEO architectures and AI limits.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center h-64"><div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          {blogs.map((blog) => (
            <Link to={`/blog/${blog.slug}`} key={blog.id}>
              <motion.div 
                variants={itemAnim}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer glass p-8 rounded-3xl border border-brand-800/80 hover:border-brand-500/50 transition-all flex flex-col justify-between overflow-hidden relative h-full"
              >
                <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/40 transition-colors z-0"></div>
                <div className="relative z-10 block">
                  <span className="text-xs font-mono text-brand-400 mb-4 block">
                    {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-snug group-hover:text-brand-200">{blog.title}</h3>
                  <p className="text-brand-300 line-clamp-3 leading-relaxed opacity-80">{blog.content}</p>
                </div>
                <div className="relative z-10 mt-6 pt-6 border-t border-brand-800/50 flex justify-between items-center text-sm font-bold text-brand-500 uppercase tracking-widest">
                  Read Full Article <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
    </section>
  );
};
