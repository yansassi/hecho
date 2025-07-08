import React from 'react';
import { useState, useEffect } from 'react';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllProducts } from '../data/catalogData';
import { Product } from '../types/Product';
import { useLanguage } from '../contexts/LanguageContext';
import { getProductImage } from '../utils/productImages';

interface FeaturedProductsProps {
  onNavigate?: (page: 'home' | 'about' | 'catalog') => void;
}

const FeaturedProducts = ({ onNavigate }: FeaturedProductsProps = {}) => {
  const { t } = useLanguage();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // Carregar produtos do Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getAllProducts();
        setAllProducts(productsData);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  
  // Selecionar produtos em destaque de cada categoria
  const featuredProducts = React.useMemo(() => {
    if (allProducts.length === 0) return [];
    
    return [
      // Ferragens
      allProducts.find(p => p.codigo === 'Cód. F232') || allProducts.find(p => p.categoria === 'Ferreteria'),
      allProducts.find(p => p.codigo === 'Cód. F128') || allProducts.find(p => p.categoria === 'Ferreteria'),
      allProducts.find(p => p.codigo === 'Cód. F245') || allProducts.find(p => p.categoria === 'Ferreteria'),
      
      // Encanamento/Plomeria
      allProducts.find(p => p.codigo === 'Cód. P151') || allProducts.find(p => p.categoria === 'Plomeria'),
      allProducts.find(p => p.codigo === 'Cód. P147') || allProducts.find(p => p.categoria === 'Plomeria'),
      allProducts.find(p => p.codigo === 'Cód. P140') || allProducts.find(p => p.categoria === 'Plomeria'),
      
      // Elétrica
      allProducts.find(p => p.codigo === 'Cód. E178') || allProducts.find(p => p.categoria === 'Elétrica'),
      allProducts.find(p => p.codigo === 'Cód. E160') || allProducts.find(p => p.categoria === 'Elétrica'),
      allProducts.find(p => p.codigo === 'Cód. E182') || allProducts.find(p => p.categoria === 'Elétrica'),
      
      // Bazar
      allProducts.find(p => p.codigo === 'Cód. B227') || allProducts.find(p => p.categoria === 'Bazar'),
      allProducts.find(p => p.codigo === 'Cód. B236') || allProducts.find(p => p.categoria === 'Bazar'),
      allProducts.find(p => p.codigo === 'Cód. B215') || allProducts.find(p => p.categoria === 'Bazar')
    ].filter(Boolean).slice(0, 12); // Aumentar para 12 produtos para melhor rotação
  }, [allProducts]);

  // Configuração responsiva do carrossel
  const getProductsPerView = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1; // mobile
    if (window.innerWidth < 1024) return 2; // tablet
    return 3; // desktop
  };

  const [productsPerView, setProductsPerView] = useState(getProductsPerView);

  useEffect(() => {
    const handleResize = () => {
      setProductsPerView(getProductsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcular número máximo de slides
  const maxSlides = Math.max(0, featuredProducts.length - productsPerView);

  // Navegação do carrossel
  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev >= maxSlides ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev <= 0 ? maxSlides : prev - 1));
  };

  // Auto-rotação do carrossel
  useEffect(() => {
    if (featuredProducts.length <= productsPerView) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Rotaciona a cada 5 segundos

    return () => clearInterval(interval);
  }, [featuredProducts.length, productsPerView, maxSlides]);

  // Mapear categorias para cores
  const categoryConfig = {
    'Ferreteria': {
      color: 'bg-red-500',
      displayName: t('categories.ferragens')
    },
    'Plomeria': {
      color: 'bg-blue-500',
      displayName: t('categories.encanamento')
    },
    'Elétrica': {
      color: 'bg-yellow-500',
      displayName: t('categories.eletrica')
    },
    'Bazar': {
      color: 'bg-green-500',
      displayName: t('categories.bazar')
    }
  };

  const handleProductClick = (product: any) => {
    // Navegar para o catálogo e aplicar filtro de busca pelo código do produto
    if (onNavigate) {
      onNavigate('catalog');
      // Usar setTimeout para garantir que a navegação aconteça primeiro
      setTimeout(() => {
        // Disparar evento customizado para filtrar o produto no catálogo
        window.dispatchEvent(new CustomEvent('filterProduct', { 
          detail: { searchTerm: product.codigo } 
        }));
      }, 100);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section id="produtos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('products.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('products.subtitle')}
            </p>
          </div>

          <div className="flex space-x-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-6"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Se não há produtos em destaque, não renderizar a seção
  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section id="produtos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('products.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>

        {/* Carrossel de Produtos */}
        <div className="relative">
          {/* Container do carrossel */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlideIndex * (100 / productsPerView)}%)`
              }}
            >
              {featuredProducts.map((product, index) => {
                const config = categoryConfig[product.categoria] || categoryConfig['Ferreteria'];
                const productImage = getProductImage(product);
                
                return (
                  <div
                    key={`${product.codigo}-${index}`}
                    className={`flex-shrink-0 px-3 ${
                      productsPerView === 1 ? 'w-full' : 
                      productsPerView === 2 ? 'w-1/2' : 'w-1/3'
                    }`}
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100 overflow-hidden h-full">
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        <img
                          src={productImage}
                          alt={product.nome}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div><div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><div class="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg"><svg class="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div></div>';
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        
                        <div className="absolute top-4 left-4">
                          <span className="bg-black text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                            {config.displayName}
                          </span>
                        </div>
                        
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-bold text-white drop-shadow-lg line-clamp-2">
                            {product.nome}
                          </h3>
                          <p className="text-sm text-gray-300 font-mono mt-1">{product.codigo}</p>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="mb-6">
                          <p className="text-gray-600 mb-2">{product.info}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{t('catalog.quantity')} {product.quantidade}</span>
                            <span className="font-mono text-xs">{product.codigoBarra}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleProductClick(product)}
                          className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-yellow-400 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          {t('products.viewCatalog')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botões de navegação - só mostrar se houver mais produtos que a visualização */}
          {featuredProducts.length > productsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-10 border border-gray-200"
                aria-label="Produto anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-10 border border-gray-200"
                aria-label="Próximo produto"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Indicadores de slide */}
          {featuredProducts.length > productsPerView && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: maxSlides + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlideIndex
                      ? 'bg-yellow-500 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('products.wantToSeeAll')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {t('products.viewComplete.desc').replace('{count}', allProducts.length.toString())}
            </p>
            <button
              onClick={() => onNavigate?.('catalog')}
              className="inline-flex items-center px-8 py-3 bg-black hover:bg-gray-800 text-yellow-400 font-semibold rounded-lg transition-colors"
            >
              {t('products.viewComplete')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;