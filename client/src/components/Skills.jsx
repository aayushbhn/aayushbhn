import React from 'react';
import { motion } from 'framer-motion';

const skillCategories = [
  {
    title: "Primary Languages & Markup",
    skills: ["TypeScript", "Python", "PHP", "JavaScript", "HTML", "Blade", "Liquid", "EJS", "CSS/SCSS", "Tailwind CSS"],
    light: "border-blue-500/30", color: "text-blue-400"
  },
  {
    title: "Backend Frameworks & Arch",
    skills: ["Node.js / Express.js", "Python / Flask / Django", "Laravel 10 / Livewire", "Socket.io", "RESTful / GraphQL", "JWT / Sanctum / OAuth", "PostgreSQL", "MySQL", "SQLite", "Redis"],
    light: "border-green-500/30", color: "text-green-400"
  },
  {
    title: "Frontend Architectures",
    skills: ["React / React Router", "Next.js / App Router", "Server Components", "Shopify App Framework", "React Query / Redux", "Context API", "Liquid Templates"],
    light: "border-purple-500/30", color: "text-purple-400"
  },
  {
    title: "AI & ML Processing",
    skills: ["OpenAI Chat Completions", "Hybrid Recommendation Systems", "Collaborative Filtering", "Learning-to-Rank algorithms", "Vector Embeddings", "Content-Based Retrieval", "Cosine Similarity"],
    light: "border-yellow-500/30", color: "text-yellow-400"
  },
  {
    title: "DevOps & Infrastructure",
    skills: ["Docker", "AWS ECS", "Vite / Webpack", "Vercel / Render / Railway", "ESLint / Pint", "Husky Pre-commits", "Pest Testing", "npm / pnpm / Bun / Composer"],
    light: "border-orange-500/30", color: "text-orange-400"
  },
  {
    title: "Domain System Expertise",
    skills: ["E-commerce / Shopify SaaS", "Full-stack Real Estate CRMs", "FinTech / Payment Gateways", "Spirituality / Astrological Data", "Heavy Product Inventory Systems"],
    light: "border-red-500/30", color: "text-red-400"
  }
];

export const Skills = () => {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
  };

  return (
    <section id="skills" className="w-full max-w-7xl mx-auto py-32 px-6 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="text-center mb-24 relative z-10">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight">Technical <span className="text-gradient">Arsenal</span></h2>
        <p className="text-brand-300 max-w-2xl mx-auto text-xl font-light">
          A definitive breakdown of the specific languages, infrastructure, and architectural logic powering my 18+ production deployments.
        </p>
      </div>

      <motion.div 
        variants={container} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, margin: "-100px" }} 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
      >
        {skillCategories.map((category, index) => (
          <motion.div 
            key={index}
            variants={itemAnim}
            className={`glass-card p-10 rounded-3xl border-t border-l border-brand-800/30 shadow-xl shadow-brand-950 hover:shadow-brand-500/10 transition-shadow ${category.light} !border-opacity-40`}
          >
            <div className="mb-6 pb-6 border-b border-brand-800/80">
              <h3 className={`text-sm font-black uppercase tracking-widest ${category.color} tracking-wide`}>{category.title}</h3>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {category.skills.map((skill, i) => (
                <span 
                  key={i} 
                  className="px-3.5 py-2 bg-brand-950/60 backdrop-blur-sm border border-brand-800/80 rounded-lg text-brand-100 text-sm font-semibold hover:border-brand-500 hover:text-white transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
