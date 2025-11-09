import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Grid, List, Package, ArrowLeft, ChevronLeft, ChevronRight, Layers, Hammer, Zap, Droplet, ShoppingBag, Wrench, Paintbrush, Shovel, Cat, Smartphone, ShoppingCart, Fish, X } from 'lucide-react';
import { getGroupedProductsPaginated, getProductCategoriesFromSupabase, ProductGroup } from '../data/supabaseProducts';
import { ProductCategory } from '../types/Product';
import { useLanguage } from '../contexts/LanguageContext';
import ProductVariationsModal from './ProductVariationsModal';

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
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalGroups, setTotalGroups] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedProductGroup, setSelectedProductGroup] = useState<ProductGroup | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getGroupedProductsPaginated(
        currentPage,
        PRODUCTS_PER_PAGE,
        selectedCategory,
        debouncedSearchTerm
      );
      setProductGroups(result.groups);
      setTotalGroups(result.total);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, debouncedSearchTerm]);

  const totalPages = Math.ceil(totalGroups / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, totalGroups);

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

  const ProductCard = ({ group }: { group: ProductGroup }) => {
    const product = group.variations[0];
    const hasVariations = group.totalVariations > 1;

    const getProductImageForCatalog = (imageUrl: string | null | undefined): string => {
      if (imageUrl && imageUrl.trim() !== '') {
        return imageUrl;
      }
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMTc1VjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCA5MEgyNTBWMTcwSDE1MFY5MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkltYWdlbSBuw6NvIGRpc3BvbsOtdmVsPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIj5ubyBtb21lbnRvPC90ZXh0Pgo8L3N2Zz4K';
    };

    const productImage = getProductImageForCatalog(product.imageUrl);

    const handleClick = () => {
      if (hasVariations) {
        setSelectedProductGroup(group);
      }
    };

    if (viewMode === 'list') {
      return (
        <div
          className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-3 sm:p-6 ${hasVariations ? 'cursor-pointer' : ''}`}
          onClick={handleClick}
        >
          <div className="flex gap-3 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={productImage}
                alt={product.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMTc1VjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCA5MEgyNTBWMTcwSDE1MFY5MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkltYWdlbSBuw6NvIGRpc3BvbsOtdmVsPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIj5ubyBtb21lbnRvPC90ZXh0Pgo8L3N2Zz4K';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2 gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-lg font-bold text-gray-900 hover:text-yellow-600 transition-colors line-clamp-2">
                    {product.nome}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-mono truncate">{product.codigo}</p>
                  {hasVariations && (
                    <span className="inline-block mt-1 bg-yellow-500 text-black px-2 py-0.5 rounded-full text-xs font-semibold">
                      {group.totalVariations} {t('catalog.variations')}
                    </span>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  {product.isPromotion ? (
                    <span className="bg-red-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase animate-pulse">
                      {t('products.promotion')}
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium hidden sm:inline-block">
                      {product.categoria}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="truncate">
                  <span className="font-medium">{t('catalog.info')}</span> {product.description || product.info || '-'}
                </div>
                <div>
                  <span className="font-medium">{t('catalog.quantity')}</span> {product.quantidade}
                </div>
                <div className="col-span-1 sm:col-span-2 truncate">
                  <span className="font-medium">{t('catalog.barcode')}</span>
                  <span className="font-mono ml-1 text-[10px] sm:text-xs">{product.codigoBarra}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 sm:transform sm:hover:-translate-y-1 border border-gray-100 overflow-hidden ${hasVariations ? 'cursor-pointer' : ''}`}
        onClick={handleClick}
      >
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
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex flex-col gap-1 items-end">
            {product.isPromotion ? (
              <span className="bg-red-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase animate-pulse">
                {t('products.promotion')}
              </span>
            ) : (
              <span className="bg-blue-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-medium truncate max-w-[80px] sm:max-w-none block">
                {product.categoria}
              </span>
            )}
            {hasVariations && (
              <span className="bg-yellow-500 text-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold">
                {group.totalVariations} {t('catalog.variations')}
              </span>
            )}
          </div>
        </div>

        <div className="p-2.5 sm:p-4">
          <div className="mb-2">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 hover:text-yellow-600 transition-colors line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
              {product.nome}
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-500 font-mono truncate">{product.codigo}</p>
          </div>

          <div className="space-y-1 text-[10px] sm:text-xs text-gray-600">
            <div className="truncate">
              <span className="font-medium">{t('catalog.info')}</span> {product.description || product.info || '-'}
            </div>
            <div className="hidden sm:block">
              <span className="font-medium">{t('catalog.qty')}</span> {product.quantidade}
            </div>
          </div>

          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
            <div className="text-[9px] sm:text-xs text-gray-500 font-mono truncate">
              {product.codigoBarra}
            </div>
          </div>

          {hasVariations && (
            <div className="mt-2 text-center">
              <span className="text-[10px] sm:text-xs text-yellow-600 font-medium">
                {t('catalog.clickToSee')}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedProductGroup && (
        <ProductVariationsModal
          productName={selectedProductGroup.nome}
          variations={selectedProductGroup.variations}
          onClose={() => setSelectedProductGroup(null)}
        />
      )}

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <button
                onClick={() => onNavigate?.('home')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">{t('catalog.back')}</span>
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{t('catalog.title')}</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block">
                  {t('catalog.subtitle')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <input
                  type="text"
                  placeholder={t('catalog.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-full text-sm sm:text-base"
                />
              </div>

              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm">Filtros</span>
              </button>

              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg p-1 flex-shrink-0">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex gap-4 lg:gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
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
                      <span className="font-medium text-sm">{category.displayName}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
              <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 text-gray-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">{t('catalog.categories')}</h3>
                  </div>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <div className="overflow-y-auto p-4 space-y-2 flex-1">
                  {categories.length === 0 ? (
                    <p className="text-gray-500 text-sm">Carregando categorias...</p>
                  ) : (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setShowMobileFilters(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                          selectedCategory === category.id
                            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            : 'text-gray-700 hover:bg-gray-50 border border-gray-100'
                        }`}
                      >
                        <span className={selectedCategory === category.id ? 'text-yellow-600' : 'text-gray-500'}>
                          {getCategoryIcon(category.displayName)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium block">{category.displayName}</span>
                          <span className="text-xs text-gray-500">{category.count} produtos</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                Mostrando {startIndex + 1}-{endIndex} de {totalGroups} productos
                {selectedCategory !== 'all' && (
                  <span className="hidden sm:inline"> {t('catalog.in')} {categories.find(c => c.id === selectedCategory)?.displayName}</span>
                )}
                {debouncedSearchTerm && (
                  <span className="hidden sm:inline"> {t('catalog.for')} "{debouncedSearchTerm}"</span>
                )}
              </p>
              {totalPages > 1 && (
                <p className="text-xs sm:text-sm text-gray-500">
                  Página {currentPage} de {totalPages}
                </p>
              )}
            </div>

            {totalGroups === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  {t('catalog.noProducts')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t('catalog.noProducts.desc')}
                </p>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'
                    : 'space-y-4'
                }>
                  {productGroups.map((group, index) => (
                    <ProductCard key={`${group.nome}-${index}`} group={group} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 sm:mt-8 flex justify-center px-2">
                    <nav className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-1.5 sm:p-2 rounded-lg border ${
                          currentPage === 1
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>

                      <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto max-w-[calc(100vw-200px)] sm:max-w-none">
                        {getPageNumbers().map((page, index) => (
                          <button
                            key={index}
                            onClick={() => typeof page === 'number' && handlePageChange(page)}
                            disabled={page === '...'}
                            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border text-sm sm:text-base flex-shrink-0 ${
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
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-1.5 sm:p-2 rounded-lg border ${
                          currentPage === totalPages
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
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
