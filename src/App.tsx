import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { BenefitsSection } from './components/BenefitsSection';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { EmailCaptureModal } from './components/EmailCaptureModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AppCommandStation } from './components/app/AppCommandStation';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'admin' | 'app'>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.startsWith('/admin') || hash === '#admin' || hash.startsWith('#/admin')) {
      return 'admin';
    }
    if (path.startsWith('/app') || hash === '#app' || hash.startsWith('#/app')) {
      return 'app';
    }
    return 'home';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.startsWith('/admin') || hash === '#admin' || hash.startsWith('#/admin')) {
        setCurrentRoute('admin');
      } else if (path.startsWith('/app') || hash === '#app' || hash.startsWith('#/app')) {
        setCurrentRoute('app');
      } else {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (route: 'home' | 'admin' | 'app') => {
    const targetPath = route === 'admin' ? '/admin' : route === 'app' ? '/app' : '/';
    window.history.pushState({}, '', targetPath);
    setCurrentRoute(route);
  };

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    source: string;
    pricingTier?: string;
    title?: string;
  }>({
    isOpen: false,
    source: 'modal',
  });

  const handleOpenCapture = (source: string, pricingTier?: string, title?: string) => {
    setModalState({
      isOpen: true,
      source,
      pricingTier,
      title: title || (pricingTier ? `Get Early Access — ${pricingTier}` : 'Get My Free Idle Report'),
    });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Route 1: /admin -> Private Launch HQ dashboard
  if (currentRoute === 'admin') {
    return <AdminDashboard />;
  }

  // Route 2: /app -> Product Remote Command Station
  if (currentRoute === 'app') {
    return <AppCommandStation onNavigateHome={() => navigateTo('home')} />;
  }

  // Route 3: / -> Public Landing Page
  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#22272B] flex flex-col selection:bg-[#F2A900] selection:text-[#22272B]">
      {/* Top Navbar */}
      <Navbar
        onOpenCapture={(src) => handleOpenCapture(src)}
        onNavigateToApp={() => navigateTo('app')}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection onOpenCapture={(src) => handleOpenCapture(src)} />

        {/* 2. Problem Section */}
        <ProblemSection />

        {/* 3. How It Works Section & Demo Panels */}
        <HowItWorksSection onOpenCapture={(src) => handleOpenCapture(src)} />

        {/* 4. Benefits Section */}
        <BenefitsSection />

        {/* 5. Pricing Section */}
        <PricingSection
          onSelectTier={(tierName) =>
            handleOpenCapture(`pricing_${tierName.toLowerCase().replace(/\s+/g, '_')}`, tierName)
          }
        />

        {/* 6. FAQ Section */}
        <FaqSection />

        {/* 7. Final CTA Section */}
        <FinalCtaSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Capture Modal for Direct Actions */}
      <EmailCaptureModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        source={modalState.source}
        pricingTier={modalState.pricingTier}
        title={modalState.title}
      />
    </div>
  );
}
