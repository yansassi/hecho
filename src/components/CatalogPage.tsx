import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Grid, List, Package, ArrowLeft, ChevronLeft, ChevronRight, Layers, Hammer, Zap, Droplet, ShoppingBag, Wrench, Paintbrush, Shovel, Cat, Smartphone, ShoppingCart, Fish } from 'lucide-react';
import { getProductsPaginated, getProductCategoriesFromSupabase } from '../data/supabaseProducts';
import { Product, ProductCategory } from '../types/Product';
import { useLanguage } from '../contexts/LanguageContext';
import { getProductImage } from '../utils/productImages';

interface CatalogPageProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'catalog' | 'admin') => void;
}

const PRODUCTS_PER_PAGE = 50;

const CatalogPage = ({ onNavigate }: CatalogPageProps) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Carregar categorias com filtro de busca
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getProductCategoriesFromSupabase(debouncedSearchTerm);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    loadCategories();
  }, [debouncedSearchTerm]);

  // Carregar produtos com paginação
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getProductsPaginated(
        currentPage,
        PRODUCTS_PER_PAGE,
        selectedCategory,
        debouncedSearchTerm
      );
      setProducts(result.products);
      setTotalProducts(result.total);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, debouncedSearchTerm]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Escutar evento customizado para filtrar produto específico
  useEffect(() => {
    const handleFilterProduct = (event: CustomEvent) => {
      const { searchTerm: productSearch } = event.detail;
      setSearchTerm(productSearch);
      setSelectedCategory('all');
      setCurrentPage(1);
    };

    window.addEventListener('filterProduct', handleFilterProduct as EventListener);

    return () => {
      window.removeEventListener('filterProduct', handleFilterProduct as EventListener);
    };
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, debouncedSearchTerm]);

  // Pagination
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts);
  const currentProducts = products;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= showPages; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - showPages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const getCategoryIcon = (categoryName: string) => {
    const iconProps = { className: 'h-5 w-5' };
    const lowerName = categoryName.toLowerCase();

    if (lowerName === 'todos los productos' || lowerName === 'todos os produtos' || lowerName === 'all') {
      return <Package {...iconProps} />;
    }
    if (lowerName.includes('ferreteria') || lowerName.includes('ferragens')) {
      return <Hammer {...iconProps} />;
    }
    if (lowerName.includes('plomeria') || lowerName.includes('encanamento')) {
      return <Droplet {...iconProps} />;
    }
    if (lowerName.includes('elétrica') || lowerName.includes('electrica') || lowerName.includes('eletrica')) {
      return <Zap {...iconProps} />;
    }
    if (lowerName.includes('bazar')) {
      return <ShoppingBag {...iconProps} />;
    }
    if (lowerName.includes('pesca') || lowerName.includes('camping')) {
      return <Fish {...iconProps} />;
    }
    if (lowerName.includes('agropecuari')) {
      return <Layers {...iconProps} />;
    }
    if (lowerName.includes('pintura')) {
      return <Paintbrush {...iconProps} />;
    }
    if (lowerName.includes('jardinage') || lowerName.includes('jardin')) {
      return <Shovel {...iconProps} />;
    }
    if (lowerName.includes('pet') || lowerName.includes('mascot')) {
      return <Cat {...iconProps} />;
    }
    if (lowerName.includes('eletron') || lowerName.includes('electron')) {
      return <Smartphone {...iconProps} />;
    }
    if (lowerName.includes('mercado') || lowerName.includes('supermercado')) {
      return <ShoppingCart {...iconProps} />;
    }
    if (lowerName.includes('sin categoría') || lowerName.includes('sem categoria') || lowerName.includes('uncategorized')) {
      return <Grid {...iconProps} />;
    }
    return <Package {...iconProps} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }
  const ProductCard = ({ product }: { product: Product }) => {
    // Para o catálogo, usar a URL do Supabase ou mostrar placeholder
    const getProductImageForCatalog = (product: Product): string => {
      if (product.imageUrl && product.imageUrl.trim() !== '') {
        return product.imageUrl;
      }
      // Retorna uma imagem placeholder indicando que não há imagem
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMTc1VjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCA5MEgyNTBWMTcwSDE1MFY5MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkltYWdlbSBuw6NvIGRpc3BvbsOtdmVsPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIj5ubyBtb21lbnRvPC90ZXh0Pgo8L3N2Zz4K';
    };

    const productImage = getProductImageForCatalog(product);

    if (viewMode === 'list') {
      return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-6">
          <div className="flex gap-6">
            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={productImage}
                alt={product.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // Se a imagem falhar ao carregar, mostrar placeholder
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMTc1VjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCA5MEgyNTBWMTcwSDE1MFY5MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkltYWdlbSBuw6NvIGRpc3BvbsOtdmVsPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIj5ubyBtb21lbnRvPC90ZXh0Pgo8L3N2Zz4K';
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 hover:text-yellow-600 transition-colors">
                    {product.nome}
                  </h3>
                  <p className="text-sm text-gray-500 font-mono">{product.codigo}</p>
                </div>
                <div className="text-right">
                  {product.isPromotion ? (
                    <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold uppercase animate-pulse">
                      {t('products.promotion')}
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {product.categoria}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">{t('catalog.info')}</span> {product.description || product.info || '-'}
                </div>
                <div>
                  <span className="font-medium">{t('catalog.quantity')}</span> {product.quantidade}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">{t('catalog.barcode')}</span>
                  <span className="font-mono ml-1">{product.codigoBarra}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={productImage}
            alt={product.nome}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMTc1VjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCA5MEgyNTBWMTcwSDE1MFY5MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkltYWdlbSBuw6NvIGRpc3BvbsOtdmVsPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIj5ubyBtb21lbnRvPC90ZXh0Pgo8L3N2Zz4K';
            }}
          />
          <div className="absolute top-2 right-2">
            {product.isPromotion ? (
              <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold uppercase animate-pulse">
                {t('products.promotion')}
              </span>
            ) : (
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {product.categoria}
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-gray-900 hover:text-yellow-600 transition-colors line-clamp-2 min-h-[2.5rem]">
              {product.nome}
            </h3>
            <p className="text-xs text-gray-500 font-mono">{product.codigo}</p>
          </div>
          
          <div className="space-y-1 text-xs text-gray-600">
            <div>
              <span className="font-medium">{t('catalog.info')}</span> {product.description || product.info || '-'}
            </div>
            <div>
              <span className="font-medium">{t('catalog.qty')}</span> {product.quantidade}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 font-mono truncate">
              {product.codigoBarra}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate?.('home')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('catalog.back')}
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('catalog.title')}</h1>
                <p className="text-gray-600 mt-1">
                  {t('catalog.subtitle')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={t('catalog.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-64"
                />
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col">
              <div className="flex items-center p-6 pb-4 border-b border-gray-200">
                <Filter className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">{t('catalog.categories')}</h3>
              </div>

              <div className="overflow-y-auto p-6 pt-4 space-y-2 flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-sm">Carregando categorias...</p>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                        selectedCategory === category.id
                          ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className={selectedCategory === category.id ? 'text-yellow-600' : 'text-gray-500'}>
                        {getCategoryIcon(category.displayName)}
                      </span>
                      <span className="font-medium">{category.displayName}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Mostrando {startIndex + 1}-{endIndex} de {totalProducts} productos
                {selectedCategory !== 'all' && (
                  <span> {t('catalog.in')} {categories.find(c => c.id === selectedCategory)?.displayName}</span>
                )}
                {debouncedSearchTerm && (
                  <span> {t('catalog.for')} "{debouncedSearchTerm}"</span>
                )}
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-gray-500">
                  Página {currentPage} de {totalPages}
                </p>
              )}
            </div>

            {totalProducts === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('catalog.noProducts')}
                </h3>
                <p className="text-gray-600">
                  {t('catalog.noProducts.desc')}
                </p>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }>
                  {currentProducts.map((product) => (
                    <ProductCard key={`${product.codigo}-${product.codigoBarra}`} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border ${
                          currentPage === 1
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === 'number' && handlePageChange(page)}
                          disabled={page === '...'}
                          className={`px-4 py-2 rounded-lg border ${
                            page === currentPage
                              ? 'bg-yellow-500 border-yellow-500 text-black font-semibold'
                              : page === '...'
                              ? 'border-transparent text-gray-400 cursor-default'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border ${
                          currentPage === totalPages
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;