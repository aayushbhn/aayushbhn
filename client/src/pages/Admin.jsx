import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Reorder } from 'framer-motion';
import API_URL from '../config';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'blogs', 'inbox'
  
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [inbox, setInbox] = useState([]);
  
  const [editingId, setEditingId] = useState(null);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', full_details: '', tags: '', image: '', link: '' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '', image: '' });

  useEffect(() => {
    if (token) {
      fetchProjects();
      fetchBlogs();
      fetchInbox();
    }
  }, [token]);

  const config = { headers: { Authorization: `Bearer ${token}` } };
  const fetchProjects = async () => setProjects((await axios.get(`${API_URL}/api/projects`)).data);
  const fetchBlogs = async () => setBlogs((await axios.get(`${API_URL}/api/blogs`)).data);
  const fetchInbox = async () => setInbox((await axios.get(`${API_URL}/api/contacts`, config)).data);

  const handleReorder = async (newOrder) => {
    if (activeTab === 'projects') {
      setProjects(newOrder); // Optimistic UI update instantly mapped cleanly!
      const payload = newOrder.map((proj, idx) => ({ id: proj.id, sort_order: idx }));
      try {
        await axios.put(`${API_URL}/api/projects/reorder`, { items: payload }, config);
      } catch (err) {
        console.error("Failed to persist order mathematically.");
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/admin/login`, { email, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch {
      alert("Invalid credentials / Server offline");
    }
  };

  const handleProjectSave = async (e) => {
    e.preventDefault();
    const payload = { ...projectForm, tags: projectForm.tags.split(',').map(s => s.trim()) };
    if (editingId) await axios.put(`${API_URL}/api/projects/${editingId}`, payload, config);
    else await axios.post(`${API_URL}/api/projects`, payload, config);
    setEditingId(null);
    setProjectForm({ title: '', description: '', full_details: '', tags: '', image: '', link: '' });
    fetchProjects();
  };

  const handleBlogSave = async (e) => {
    e.preventDefault();
    if (editingId) await axios.put(`${API_URL}/api/blogs/${editingId}`, blogForm, config);
    else await axios.post(`${API_URL}/api/blogs`, blogForm, config);
    setEditingId(null);
    setBlogForm({ title: '', content: '', image: '' });
    fetchBlogs();
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        await axios.post(`${API_URL}/api/cv`, { base64Data: event.target.result }, config);
        alert('CV Updated Successfully!');
      } catch (err) {
        alert('Failed to update CV');
      }
    };
    reader.readAsDataURL(file);
  };

  const editItem = (item, type) => {
    setEditingId(item.id);
    if (type === 'projects') {
      let tagStr = '';
      try { tagStr = JSON.parse(item.tags).join(', '); } catch { tagStr = item.tags; }
      setProjectForm({ title: item.title, description: item.description, full_details: item.full_details || '', image: item.image || '', link: item.link || '', tags: tagStr });
    } else {
      setBlogForm({ title: item.title, content: item.content, image: item.image || '' });
    }
  };

  const deleteItem = async (id, type) => {
    await axios.delete(`${API_URL}/api/${type}/${id}`, config);
    if (type === 'projects') fetchProjects();
    else if (type === 'blogs') fetchBlogs();
    else fetchInbox();
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-brand-950 flex justify-center items-center font-sans px-4">
        <form onSubmit={handleLogin} className="glass-card p-10 max-w-md w-full space-y-6 rounded-3xl">
          <h2 className="text-white text-3xl font-extrabold mb-8 text-center text-gradient">CMS Access</h2>
          <input className="w-full bg-brand-900 border border-brand-700 p-4 rounded-xl text-white outline-none focus:border-brand-500" type="email" placeholder="Admin Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-brand-900 border border-brand-700 p-4 rounded-xl text-white outline-none focus:border-brand-500" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-brand-500 text-white p-4 rounded-xl font-bold hover:bg-brand-400 mt-4">Secure Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-950 text-white flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-72 bg-brand-900/50 border-r border-brand-800/50 p-6 flex flex-col gap-8 flex-shrink-0 relative z-20">
        <div>
          <h1 className="text-2xl font-black tracking-widest text-white">COMMAND<br/><span className="text-brand-500">CENTER</span></h1>
          <p className="text-xs text-brand-400 mt-2 font-mono break-all">{email}</p>
        </div>
        <nav className="flex flex-col gap-3">
          <button onClick={() => { setActiveTab('projects'); setEditingId(null); }} className={`p-4 text-left rounded-xl font-bold transition-all ${activeTab === 'projects' ? 'bg-brand-600 text-white shadow-lg' : 'text-brand-300 hover:bg-brand-800/50'}`}>📦 Projects</button>
          <button onClick={() => { setActiveTab('blogs'); setEditingId(null); }} className={`p-4 text-left rounded-xl font-bold transition-all ${activeTab === 'blogs' ? 'bg-brand-600 text-white shadow-lg' : 'text-brand-300 hover:bg-brand-800/50'}`}>✍️ Blog Engine</button>
          <button onClick={() => { setActiveTab('contacts'); setEditingId(null); }} className={`p-4 text-left flex justify-between rounded-xl font-bold transition-all ${activeTab === 'contacts' ? 'bg-brand-600 text-white shadow-lg' : 'text-brand-300 hover:bg-brand-800/50'}`}>
            <span>📬 Inbox</span>
            {inbox.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{inbox.length}</span>}
          </button>
          
          <label className="mt-4 p-4 text-left rounded-xl font-bold transition-all text-brand-400 hover:bg-brand-800/50 border border-brand-700 border-dashed cursor-pointer flex justify-center items-center">
            📄 Upload New CV (PDF)
            <input type="file" accept="application/pdf" className="hidden" onChange={handleCVUpload} />
          </label>
        </nav>
        <button onClick={() => { localStorage.removeItem('token'); setToken(''); }} className="mt-auto p-4 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold">Logout</button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto h-screen relative z-10 w-full">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-brand-800/50 pb-6 gap-4">
            <h2 className="text-4xl font-extrabold text-white">
              {activeTab === 'projects' && 'Project Management'}
              {activeTab === 'blogs' && 'SEO Blog Engine'}
              {activeTab === 'contacts' && 'Lead Inbox'}
            </h2>
            {activeTab !== 'contacts' && <button onClick={() => setEditingId(null)} className="px-6 py-3 bg-brand-500 rounded-lg font-bold shadow-lg hover:shadow-brand-500/50">+ Add New Record</button>}
          </div>

          {activeTab === 'contacts' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
               {inbox.map(msg => (
                 <div key={msg.id} className="glass-card p-8 rounded-3xl relative">
                   <div className="flex justify-between items-start mb-6 border-b border-brand-800 pb-4">
                     <div>
                       <h4 className="text-xl font-bold text-white mb-1">{msg.name}</h4>
                       <p className="text-sm font-mono text-brand-400">{msg.email}</p>
                     </div>
                     <span className="text-xs text-brand-500 bg-brand-900 px-3 py-1 rounded-full">{new Date(msg.created_at).toLocaleDateString()}</span>
                   </div>
                   <p className="text-brand-200 leading-relaxed font-light text-lg mb-8">{msg.message}</p>
                   <button onClick={() => deleteItem(msg.id, 'contacts')} className="absolute bottom-6 right-6 text-xs font-bold text-red-500 uppercase hover:underline">Delete Lead</button>
                 </div>
               ))}
               {inbox.length === 0 && <div className="col-span-full p-10 text-center text-brand-400 text-lg">Your inbox is clear.</div>}
             </div>
          ) : (
             <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
              
              <div className="xl:col-span-5 glass-card p-6 bg-brand-900/40 rounded-3xl sticky top-8">
                 <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                   <span className="w-2 h-8 bg-brand-400 rounded-full"></span> 
                   {editingId ? 'Edit Configuration' : 'Create Record'}
                 </h3>

                 {activeTab === 'projects' ? (
                   <form onSubmit={handleProjectSave} className="space-y-4">
                      <div><label className="text-xs font-bold text-brand-300">TITLE</label><input className="w-full bg-brand-950 border border-brand-700 p-3 rounded-lg" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} required/></div>
                      <div><label className="text-xs font-bold text-brand-300">LINK (OPTIONAL)</label><input className="w-full bg-brand-950 border border-brand-700 p-3 rounded-lg" value={projectForm.link} onChange={e => setProjectForm({...projectForm, link: e.target.value})} /></div>
                      <div><label className="text-xs font-bold text-brand-300">SHORT DESCRIPTION</label><textarea className="w-full bg-brand-950 border border-brand-700 p-3 rounded-lg" rows="2" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} required/></div>
                      <div><label className="text-xs font-bold text-brand-300">FULL DETAILS (MARKDOWN)</label><textarea className="w-full bg-brand-950 border border-brand-700 p-3 rounded-lg font-mono text-sm" rows="10" placeholder="Use raw text spacing..." value={projectForm.full_details} onChange={e => setProjectForm({...projectForm, full_details: e.target.value})} required/></div>
                      <div><label className="text-xs font-bold text-brand-300">TAGS</label><input className="w-full bg-brand-950 border border-brand-700 p-3 rounded-lg" placeholder="React, Node, etc." value={projectForm.tags} onChange={e => setProjectForm({...projectForm, tags: e.target.value})} /></div>
                      <div><label className="text-xs font-bold text-brand-300">IMAGE URL</label><input className="w-full bg-brand-950 border border-brand-700 p-3 rounded-lg" value={projectForm.image} onChange={e => setProjectForm({...projectForm, image: e.target.value})} /></div>
                      <button className="w-full py-4 bg-brand-500 rounded-xl font-bold">Deploy Project</button>
                      {editingId && <button type="button" onClick={() => setEditingId(null)} className="w-full py-3 bg-brand-800 rounded-xl font-bold">Cancel</button>}
                   </form>
                 ) : (
                   <form onSubmit={handleBlogSave} className="space-y-4">
                      <div><label className="text-xs font-bold text-brand-300">BLOG HEADLINE</label><input className="w-full bg-brand-950 border border-brand-700 p-3 rounded-lg" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} required/></div>
                      <div><label className="text-xs font-bold text-brand-300">IMAGE URL</label><input className="w-full bg-brand-950 border border-brand-700 p-3 rounded-lg" value={blogForm.image} onChange={e => setBlogForm({...blogForm, image: e.target.value})} /></div>
                      <div><label className="text-xs font-bold text-brand-300">ARTICLE CONTENT (MARKDOWN)</label><textarea className="w-full bg-brand-950 border border-brand-700 p-3 rounded-lg font-mono text-sm leading-relaxed" rows="16" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} required/></div>
                      <button className="w-full py-4 bg-brand-500 rounded-xl font-bold">Publish Article</button>
                      {editingId && <button type="button" onClick={() => setEditingId(null)} className="w-full py-3 bg-brand-800 rounded-xl font-bold">Cancel</button>}
                   </form>
                 )}
              </div>

              <div className="xl:col-span-7 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar pr-4 pb-20 w-full">
                 {activeTab === 'projects' ? (
                   <Reorder.Group axis="y" values={projects} onReorder={handleReorder} className="w-full space-y-4">
                     {projects.map(item => (
                       <Reorder.Item key={item.id} value={item} className="cursor-grab active:cursor-grabbing glass p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start gap-6 border border-brand-800/80 bg-brand-900/40 relative group">
                         <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100 transition-opacity flex flex-col gap-1 cursor-grab active:cursor-grabbing">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                         </div>
                         <div className="flex-1 w-full pl-6">
                           <h4 className="text-xl font-bold text-white mb-2 leading-tight">{item.title}</h4>
                           <span className="text-xs font-mono text-brand-500 mb-2 block">Slug: /{item.slug}</span>
                           <p className="text-brand-300 text-sm line-clamp-3 leading-relaxed">
                             {item.description}
                           </p>
                         </div>
                         <div className="flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto z-10 relative">
                           <button onClick={(e) => { e.stopPropagation(); editItem(item, 'projects'); }} className="flex-1 px-5 py-2 bg-brand-800 rounded-lg font-semibold hover:bg-brand-500 transition-colors">Edit</button>
                           <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id, 'projects'); }} className="flex-1 px-5 py-2 bg-red-900/50 text-red-300 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors">Remove</button>
                         </div>
                       </Reorder.Item>
                     ))}
                   </Reorder.Group>
                 ) : (
                   <div className="w-full space-y-4">
                     {blogs.map(item => (
                       <div key={item.id} className="glass p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start gap-6 border border-brand-800/80">
                         <div className="flex-1 w-full">
                           <h4 className="text-xl font-bold text-white mb-2 leading-tight">{item.title}</h4>
                           <span className="text-xs font-mono text-brand-500 mb-2 block">Slug: /{item.slug}</span>
                           <p className="text-brand-300 text-sm line-clamp-3 leading-relaxed">
                             {item.content}
                           </p>
                         </div>
                         <div className="flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                           <button onClick={() => editItem(item, 'blogs')} className="flex-1 px-5 py-2 bg-brand-800 rounded-lg font-semibold hover:bg-brand-500 transition-colors">Edit</button>
                           <button onClick={() => deleteItem(item.id, 'blogs')} className="flex-1 px-5 py-2 bg-red-900/50 text-red-300 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors">Remove</button>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
