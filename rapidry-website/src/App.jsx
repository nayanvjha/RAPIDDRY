import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageLoader from './components/ui/PageLoader';
import ScrollProgress from './components/ui/ScrollProgress';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import { useLenis } from './hooks/useLenis';

export default function App() {
  useLenis();

  return (
    <BrowserRouter>
      <PageLoader />
      <ScrollProgress />
      <Navbar />

      <main className="pt-[72px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
