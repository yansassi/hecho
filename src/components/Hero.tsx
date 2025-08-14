import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  onNavigate?: (page: 'home' | 'about' | 'catalog') => void;
}

const Hero = ({ onNavigate }: HeroProps) => {
  const { t } = useLanguage();

  return (
    <section id="inicio" className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                {t('hero.title')}
                <span className="block text-yellow-400">{t('hero.titleHighlight')}</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 max-w-lg">
                {t('hero.subtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate?.('catalog')}
                className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('hero.viewCatalog')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <a
                href="#produtos"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold rounded-lg transition-all duration-200"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {t('hero.featuredProducts')}
              </a>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-700">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">25+</div>
                <div className="text-gray-300">{t('hero.yearsExperience')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">5000+</div>
                <div className="text-gray-300">{t('hero.productsAvailable')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">100%</div>
                <div className="text-gray-300">{t('hero.qualityGuaranteed')}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Ferramentas e materiais de construção"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-yellow-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;