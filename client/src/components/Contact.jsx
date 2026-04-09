import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Sending...' });
    try {
      await axios.post('http://localhost:5001/api/contact', formData);
      setStatus({ type: 'success', msg: 'Message sent successfully! I will get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.log("Contact API Error:", error);
      setStatus({ type: 'error', msg: 'Failed to send message. Please try again or reach out directly.' });
    }
  };

  return (
    <section id="contact" className="w-full max-w-4xl mx-auto py-32 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-card p-10 md:p-16 relative overflow-hidden"
      >
        {/* Decorative backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px]"></div>

        <div className="text-center mb-12 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Let's <span className="text-gradient">Connect</span></h2>
          <p className="text-brand-300">Interested in working together or have a question? Drop a message below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-200">Name</label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-brand-900/50 border border-brand-700/50 rounded-xl px-4 py-3 text-white placeholder-brand-400 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-200">Email</label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-brand-900/50 border border-brand-700/50 rounded-xl px-4 py-3 text-white placeholder-brand-400 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-200">Message</label>
            <textarea 
              name="message"
              required
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-brand-900/50 border border-brand-700/50 rounded-xl px-4 py-3 text-white placeholder-brand-400 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all resize-none"
              placeholder="How can I help you?"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={status.type === 'loading'}
            className="w-full py-4 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-medium transition-all duration-300 shadow-[0_0_15px_rgba(74,120,123,0.3)] hover:shadow-[0_0_25px_rgba(74,120,123,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status.type === 'loading' ? 'Sending...' : 'Send Message'}
          </button>

          {status.msg && (
            <div className={`p-4 rounded-lg text-sm text-center ${status.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-200' : 'bg-red-500/20 border border-red-500/50 text-red-200'}`}>
              {status.msg}
            </div>
          )}
        </form>
      </motion.div>
    </section>
  );
};
