import React, { useEffect } from 'react';
import Hero from './components/Hero';
import SubPixelSection from './components/SubPixelSection';
import ImageGallery from './components/ImageGallery';
import FeatureGrid from './components/FeatureGrid';
import Story from './components/Story';
import Footer from './components/Footer';

const App: React.FC = () => {
  // Smooth scroll behavior fix for iOS
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/50 border-b border-white/5">
        <div className="text-xl font-bold tracking-tighter">Feather</div>
        <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
          Download
        </button>
      </nav>

      <main className="flex flex-col items-center w-full">
        <Hero />
        <SubPixelSection />
        <ImageGallery />
        <FeatureGrid />
        <Story />
      </main>

      <Footer />
    </div>
  );
};

export default App;