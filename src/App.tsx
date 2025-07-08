import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
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
import ContactInfoAdmin from './components/ContactInfoAdmin';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'catalog' | 'contact-admin'>('home');

  return (
    <LanguageProvider>
      <div className="min-h-screen">
        {currentPage === 'about' && (
          <>
            <Header onNavigate={setCurrentPage} />
            <AboutUsPage />
            <Footer />
          </>
        )}

        {currentPage === 'catalog' && (
          <>
            <Header onNavigate={setCurrentPage} />
            <CatalogPage onNavigate={setCurrentPage} />
            <Footer />
          </>
        )}

        {currentPage === 'contact-admin' && (
          <>
            <Header onNavigate={setCurrentPage} />
            <ContactInfoAdmin />
            <Footer />
          </>
        )}

        {currentPage === 'home' && (
          <>
            <Header onNavigate={setCurrentPage} />
            <Hero onNavigate={setCurrentPage} />
            <Categories />
            <Brands />
            <FeaturedProducts onNavigate={setCurrentPage} />
            <About />
            <Footer />
          </>
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;