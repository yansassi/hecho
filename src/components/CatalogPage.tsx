import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Grid, List, Package, ArrowLeft } from 'lucide-react';
import { getAllProducts, getProductCategories } from '../data/catalogData';
import { Product, ProductCategory } from '../types/Product';
import { useLanguage } from '../contexts/LanguageContext';
import { getProductImage } from '../utils/productImages';

interface CatalogPageProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'catalog') => void;
}

const CatalogPage = ({ onNavigate }: CatalogPageProps) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const allProducts = useMemo(() => getAllProducts(), []);
  const categories = useMemo(() => getProductCategories(), []);

  // Escutar evento customizado para filtrar produto específico
  useEffect(() => {
    const handleFilterProduct = (event: CustomEvent) => {
      const { searchTerm: productSearch } = event.detail;
      setSearchTerm(productSearch);
      setSelectedCategory('all');
    };

    window.addEventListener('filterProduct', handleFilterProduct as EventListener);
    
    return () => {
      window.removeEventListener('filterProduct', handleFilterProduct as EventListener);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.categoria.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.nome.toLowerCase().includes(term) ||
        product.info.toLowerCase().includes(term) ||
        product.codigo.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [allProducts, selectedCategory, searchTerm]);

  const ProductCard = ({ product }: { product: Product }) => {
    const productImage = getProductImage(product);

    if (viewMode === 'list') {
      return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-6">
          <div className="flex gap-6">
            <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={productImage}
                alt={product.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>';
                  }
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
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {product.categoria}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">{t('catalog.info')}</span> {product.info}
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
        <div className="relative h-32 bg-gray-100 overflow-hidden">
          <img
            src={productImage}
            alt={product.nome}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>';
              }
            }}
          />
          <div className="absolute top-2 right-2">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {product.categoria}
            </span>
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
              <span className="font-medium">{t('catalog.info')}</span> {product.info}
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center mb-6">
                <Filter className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">{t('catalog.categories')}</h3>
              </div>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.displayName}</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                {t('catalog.showing').replace('{count}', filteredProducts.length.toString())}
                {selectedCategory !== 'all' && (
                  <span> {t('catalog.in')} {categories.find(c => c.id === selectedCategory)?.displayName}</span>
                )}
                {searchTerm && (
                  <span> {t('catalog.for')} "{searchTerm}"</span>
                )}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
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
              <div className={
                viewMode === 'grid' 
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard key={`${product.codigo}-${product.codigoBarra}`} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;