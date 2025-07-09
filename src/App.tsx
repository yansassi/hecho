import React, { useState } from 'react';
import { useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Brands from './components/Brands';
import FeaturedProducts from './components/FeaturedProducts';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AboutUsPage from './components/AboutUsPage';
import CatalogPage from './components/CatalogPage';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'catalog' | 'login' | 'admin'>('home');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário logado
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setCurrentPage('home');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigate = (page: 'home' | 'about' | 'catalog' | 'login' | 'admin') => {
    // Se tentar acessar admin sem estar logado, redirecionar para login
    if (page === 'admin' && !user) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen overflow-x-hidden">
        {currentPage === 'login' && (
          <LoginPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'admin' && user && (
          <AdminPanel onNavigate={handleNavigate} />
        )}

        {currentPage === 'about' && (
          <>
            <Header onNavigate={handleNavigate} />
            <AboutUsPage />
            <Footer onNavigate={handleNavigate} />
          </>
        )}

        {currentPage === 'catalog' && (
          <>
            <Header onNavigate={handleNavigate} />
            <CatalogPage onNavigate={handleNavigate} />
            <Footer onNavigate={handleNavigate} />
          </>
        )}

        {currentPage === 'home' && (
          <>
            <Header onNavigate={handleNavigate} />
            <Hero onNavigate={handleNavigate} />
            <Categories />
            <Brands />
            <FeaturedProducts onNavigate={handleNavigate} />
            <About />
            <Footer onNavigate={handleNavigate} />
          </>
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;