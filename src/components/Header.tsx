import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  onNavigate?: (page: 'home' | 'about' | 'catalog' | 'admin') => void;
}

const Header = ({ onNavigate }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { href: '#inicio', label: t('nav.inicio'), action: () => onNavigate?.('home') },
    { href: '#catalogo', label: t('nav.catalogo'), action: () => onNavigate?.('catalog') },
    { href: '#sobre', label: t('nav.sobre'), action: () => onNavigate?.('about') },
  ];

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.action) {
      e.preventDefault();
      item.action();
      setIsMenuOpen(false);
    }
  };

  const handleLanguageChange = (lang: 'es' | 'pt') => {
    setLanguage(lang);
  };

  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-50">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate?.('home')}>
            <img
              src="https://hechopy.com/logo%20hecho%20colorida%20horizontal.png"
              alt="HECHO - Soluções Rápidas"
              className="h-12 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(item, e)}
                    className="text-white hover:text-yellow-400 font-medium transition-colors duration-200 relative group cursor-pointer"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-200 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Language Selector - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => handleLanguageChange('pt')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                language === 'pt' 
                  ? 'bg-yellow-500 text-black' 
                  : 'hover:bg-gray-800 text-white'
              }`}
              title="Português"
            >
              <img 
                src="https://flagcdn.com/w20/br.png" 
                alt="Brasil" 
                className="w-5 h-auto"
              />
              <span className="text-sm font-medium">PT</span>
            </button>
            <button
              onClick={() => handleLanguageChange('es')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                language === 'es' 
                  ? 'bg-yellow-500 text-black' 
                  : 'hover:bg-gray-800 text-white'
              }`}
              title="Español"
            >
              <img 
                src="https://flagcdn.com/w20/py.png" 
                alt="Paraguay" 
                className="w-5 h-auto"
              />
              <span className="text-sm font-medium">ES</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(item, e)}
                      className="block py-3 px-4 text-white hover:bg-gray-800 hover:text-yellow-400 rounded-lg transition-colors cursor-pointer"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Mobile Language Selector */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="px-4 mb-2">
                <span className="text-sm text-gray-400">Idioma:</span>
              </div>
              <div className="flex space-x-2 px-4">
                <button
                  onClick={() => handleLanguageChange('pt')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    language === 'pt' 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  <img 
                    src="https://flagcdn.com/w20/br.png" 
                    alt="Brasil" 
                    className="w-5 h-auto"
                  />
                  <span className="text-sm font-medium">PT</span>
                </button>
                <button
                  onClick={() => handleLanguageChange('es')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    language === 'es' 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  <img 
                    src="https://flagcdn.com/w20/py.png" 
                    alt="Paraguay" 
                    className="w-5 h-auto"
                  />
                  <span className="text-sm font-medium">ES</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;