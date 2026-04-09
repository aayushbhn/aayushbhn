import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Blogs } from './components/Blogs';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import Admin from './pages/Admin';
import ProjectDetail from './pages/ProjectDetail';
import BlogDetail from './pages/BlogDetail';

const PublicLayout = () => (
  <div className="relative min-h-screen overflow-x-hidden selection:bg-brand-500 selection:text-white pb-12 sm:pb-32">
    <div 
      className="fixed inset-0 z-[-1] bg-center bg-cover bg-no-repeat transition-transform duration-[20s] ease-linear scale-110 motion-safe:animate-pulse"
      style={{ backgroundImage: 'url("/hero-bg.png")' }}
    >
      <div className="absolute inset-0 bg-brand-950/85 backdrop-blur-[4px]"></div>
    </div>
    
    <main className="z-10 relative flex flex-col items-center">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Blogs />
      <Contact />
      <Footer />
    </main>
  </div>
);

const RootLayout = () => {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <PublicLayout /> },
      { path: "/admin", element: <Admin /> },
      { path: "/project/:slug", element: <ProjectDetail /> },
      { path: "/blog/:slug", element: <BlogDetail /> },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
