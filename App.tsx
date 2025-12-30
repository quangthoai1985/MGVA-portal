import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { SettingsProvider } from './context/SettingsContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { AdminDashboard } from './components/AdminDashboard';
import { NewsDetail } from './components/NewsDetail';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ResourcesPage } from './components/ResourcesPage';
import { AnnouncementDetail } from './components/AnnouncementDetail';
import { NewsPage } from './components/NewsPage';
import { GalleryPage } from './components/GalleryPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string, hash?: string) => {
    if (path === 'home') {
      navigate('/');
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (path.startsWith('#')) {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(path);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Determine if Header/Footer should be shown
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname === '/login';
  const isDetail = location.pathname.startsWith('/news/') || location.pathname.startsWith('/announcement-detail/');

  const showHeader = !isAdmin && !isDetail;
  const showFooter = !isAdmin && !isDetail;

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 selection:bg-brand-200 selection:text-brand-900">
      {showHeader && <Header onNavigate={handleNavigate} />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/login" element={<AdminDashboard onNavigate={handleNavigate} />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard onNavigate={handleNavigate} /></ProtectedRoute>} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/announcement-detail/:id" element={<AnnouncementDetailWrapper />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </main>

      {showFooter && <Footer onNavigate={handleNavigate} />}
      <ScrollToTop />
    </div>
  );
};

// Wrapper for AnnouncementDetail to handle params
const AnnouncementDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) return null;

  return (
    <AnnouncementDetail
      id={id}
      onBack={() => navigate('/')}
    />
  );
};

function App() {
  useEffect(() => {
    const incrementVisitCount = async () => {
      const visited = sessionStorage.getItem('visited');
      if (!visited) {
        try {
          const docRef = doc(db, 'settings', 'general');
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            await updateDoc(docRef, {
              visitCount: increment(1)
            });
          } else {
            await setDoc(docRef, {
              visitCount: 1,
              totalStudents: 524
            });
          }
          sessionStorage.setItem('visited', 'true');
        } catch (error) {
          console.error("Error updating visit count:", error);
        }
      }
    };

    incrementVisitCount();
  }, []);

  return (
    <SettingsProvider>
      <ToastProvider>
        <ConfirmProvider>
          <Router>
            <Layout />
          </Router>
        </ConfirmProvider>
      </ToastProvider>
    </SettingsProvider>
  );
}

export default App;