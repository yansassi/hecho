import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useHeroBanners } from '../hooks/useHeroBanners';

interface HeroProps {
  onNavigate?: (page: 'home' | 'about' | 'catalog') => void;
}

const Hero = ({ onNavigate }: HeroProps) => {
  const { t } = useLanguage();
  const { banners, loading } = useHeroBanners();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotação dos slides
  useEffect(() => {
    if (banners.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleCTAClick = (action: string) => {
    switch (action) {
      case 'catalog':
        onNavigate?.('catalog');
        break;
      case 'about':
        onNavigate?.('about');
        break;
      default:
        onNavigate?.('catalog');
    }
  };

  // Loading state
  if (loading || banners.length === 0) {
    return (
      <section id="inicio" className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <div className="space-y-6 animate-pulse">
                <div className="space-y-4">
                  <div className="h-12 lg:h-16 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-8 lg:h-12 bg-yellow-600 rounded w-1/2"></div>
                </div>
                <div className="h-6 lg:h-8 bg-gray-600 rounded w-5/6"></div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="h-12 bg-yellow-600 rounded w-40"></div>
                  <div className="h-12 bg-transparent border-2 border-yellow-600 rounded w-48"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentSlide];

  return (
    <section id="inicio" className="relative h-64 sm:h-80 md:h-[500px] lg:h-[600px] overflow-hidden w-full">
      {/* Container do Banner */}
      <div className="relative w-full h-full">
        {/* Imagem de Fundo */}
        <div className="absolute inset-0">
          <picture>
            <source 
              media="(max-width: 767px)" 
              srcSet={currentBanner.mobileImage}
            />
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
              key={currentSlide}
            />
          </picture>
          {/* Overlay escuro para melhor legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:bg-black/50"></div>
        </div>

        {/* Conteúdo Sobreposto */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <div className="space-y-6 animate-fade-in" key={`content-${currentSlide}`}>
                <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold leading-tight text-white">
                  {currentBanner.title}
                  {currentBanner.highlight && (
                    <span className="block text-yellow-400">{currentBanner.highlight}</span>
                  )}
                </h1>
                <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-200 max-w-2xl leading-relaxed">
                  {currentBanner.subtitle}
                </p>
                
                <div className="flex flex-row gap-2 sm:gap-4 pt-2 sm:pt-4">
                  <button
                    onClick={() => handleCTAClick(currentBanner.ctaAction)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 sm:px-8 sm:py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-xs sm:text-base"
                  >
                    {currentBanner.ctaText}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <a
                    href="#produtos"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 sm:px-8 sm:py-4 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold rounded-lg transition-all duration-200 text-xs sm:text-base"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {t('hero.featuredProducts')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controles de Navegação - só mostrar se houver mais de um banner */}
        {banners.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 flex items-center z-20">
              <button
                onClick={prevSlide}
                className="ml-2 sm:ml-4 p-2 sm:p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110 active:scale-95 shadow-lg"
                aria-label="Slide anterior"
                type="button"
              >
                <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center z-20">
              <button
                onClick={nextSlide}
                className="mr-2 sm:mr-4 p-2 sm:p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110 active:scale-95 shadow-lg"
                aria-label="Próximo slide"
                type="button"
              >
                <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Indicadores de Slide */}
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
              <div className="flex space-x-3">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 hover:scale-125 cursor-pointer ${
                      index === currentSlide
                        ? 'bg-yellow-400 scale-125 shadow-lg'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Ir para slide ${index + 1}`}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;