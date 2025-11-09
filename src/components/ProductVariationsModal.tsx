import React from 'react';
import { X, Package } from 'lucide-react';
import { Product } from '../types/Product';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductVariationsModalProps {
  productName: string;
  variations: Product[];
  onClose: () => void;
}

const ProductVariationsModal = ({ productName, variations, onClose }: ProductVariationsModalProps) => {
  const { t } = useLanguage();

  const getProductImageForCatalog = (product: Product): string => {
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      return product.imageUrl;
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMTc1VjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCA5MEgyNTBWMTcwSDE1MFY5MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkltYWdlbSBuw6NvIGRpc3BvbsOtdmVsPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIj5ubyBtb21lbnRvPC90ZXh0Pgo8L3N2Zz4K';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-yellow-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{productName}</h2>
              <p className="text-sm text-gray-600">
                {variations.length} {t('catalog.variations.available')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {variations.map((variation, index) => (
              <div
                key={`${variation.codigo}-${index}`}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                    <img
                      src={getProductImageForCatalog(variation)}
                      alt={variation.nome}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMTc1VjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCA5MEgyNTBWMTcwSDE1MFY5MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkltYWdlbSBuw6NvIGRpc3BvbsOtdmVsPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIj5ubyBtb21lbnRvPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-gray-600 truncate">{variation.codigo}</p>
                        {variation.isPromotion && (
                          <span className="inline-block mt-1 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold uppercase">
                            {t('products.promotion')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      {variation.info && (
                        <div className="truncate">
                          <span className="font-medium">{t('catalog.info')}</span> {variation.info}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">{t('catalog.quantity')}</span> {variation.quantidade}
                      </div>
                      <div className="truncate">
                        <span className="font-medium text-xs">{t('catalog.barcode')}</span>
                        <span className="font-mono ml-1 text-xs">{variation.codigoBarra}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-black hover:bg-gray-800 text-yellow-400 font-semibold rounded-lg transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductVariationsModal;
