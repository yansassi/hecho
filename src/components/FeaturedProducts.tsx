import React from 'react';
import { Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { getProductImage } from '../utils/productImages';

interface FeaturedProductsProps {
  onNavigate?: (page: 'home' | 'about' | 'catalog' | 'admin') => void;
}

const FeaturedProducts = ({ onNavigate }: FeaturedProductsProps = {}) => {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const { data: featured, error: featuredError } = await supabase
          .from('featured_products')
          .select('product_code, display_order')
          .eq('active', true)
          .order('display_order', { ascending: true });

        if (featuredError) {
          console.error('Erro ao buscar produtos destacados:', featuredError);
          setLoading(false);
          return;
        }

        if (!featured || featured.length === 0) {
          setLoading(false);
          return;
        }

        const productCodes = featured.map(f => f.product_code);

        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id, codigo, nome, info, quantidade, codigo_barra, category_id, image_url, categories(id, name)')
          .in('codigo', productCodes);

        if (productsError) {
          console.error('Erro ao buscar produtos:', productsError);
          setLoading(false);
          return;
        }

        const productIds = products?.map(p => p.id) || [];
        const { data: promotions, error: promotionsError } = await supabase
          .from('promotions')
          .select('product_id, active')
          .in('product_id', productIds)
          .eq('active', true);

        if (promotionsError) {
          console.error('Erro ao buscar promoções:', promotionsError);
        }

        const promotionMap = new Map(promotions?.map(p => [p.product_id, true]) || []);

        const productsMap = new Map(products?.map(p => [p.codigo, {
          ...p,
          categoria: p.categories?.name || 'Sin Categoría',
          categoryName: p.categories?.name || 'Sin Categoría',
          codigoBarra: p.codigo_barra,
          imageUrl: p.image_url,
          isPromotion: promotionMap.has(p.id)
        }]));

        const orderedProducts = featured
          .map(f => productsMap.get(f.product_code))
          .filter(Boolean);

        setFeaturedProducts(orderedProducts);
      } catch (error) {
        console.error('Erro ao carregar produtos destacados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section id="produtos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => {
            const config = categoryConfig[product.categoria] || categoryConfig['Ferreteria'];
            const productImage = product.imageUrl && product.imageUrl.trim() !== ''
              ? product.imageUrl
              : getProductImage(product);

            return (
              <div
                key={`${product.codigo}-${index}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100 overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={productImage}
                    alt={product.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallbackImage = getProductImage(product);
                      if (target.src !== fallbackImage) {
                        target.src = fallbackImage;
                      } else {
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div><div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><div class="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg"><svg class="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div></div>';
                        }
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4">
                    {product.isPromotion ? (
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold uppercase animate-pulse">
                        {t('products.promotion')}
                      </span>
                    ) : (
                      <span className="bg-black text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                        {config.displayName}
                      </span>
                    )}
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
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('products.wantToSeeAll')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {t('products.viewComplete.desc').replace('{count}', '1000+')}
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