import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageLoader from './components/ui/PageLoader';
import ScrollProgress from './components/ui/ScrollProgress';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import { useLenis } from './hooks/useLenis';
import { trackConversion } from './utils/gtag';

function RouteConversionTracker() {
  const location = useLocation();

  useEffect(() => {
    trackConversion('page_view');
  }, [location.pathname]);

  return null;
}

export default function App() {
  useLenis();

  return (
    <BrowserRouter>
      <RouteConversionTracker />
      <PageLoader />
      <ScrollProgress />
      <Navbar />

      <main className="overflow-x-hidden pt-[72px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
