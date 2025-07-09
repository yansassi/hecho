import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContactInfo } from '../hooks/useContactInfo';
import { useBrands } from '../hooks/useBrands';

const Brands = () => {
  const { t } = useLanguage();
  const { contactInfo } = useContactInfo();
  const { brands, loading } = useBrands();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brands Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('brands.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('brands.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-20">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group bg-gray-50 rounded-xl p-6 w-full animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                <div className="text-center">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-20">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="group bg-gray-50 rounded-xl p-6 hover:bg-yellow-50 transition-all duration-300 hover:shadow-lg w-full"
              >
                <div className="aspect-video bg-white rounded-lg overflow-hidden mb-4 shadow-sm">
                  <img
                    src={brand.logo_url}
                    alt={`Logo ${brand.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100"><div class="text-gray-400 text-xs font-medium">' + brand.name + '</div></div>';
                      }
                    }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-gray-900 mb-1">{brand.name}</h3>
                  <p className="text-sm text-gray-600">{brand.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Location Section */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('about.ourLocation')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.ourLocation.desc')}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100 mb-6">
                <iframe 
                  src={contactInfo?.googleMapsEmbedUrl || "https://www.google.com/maps/d/embed?mid=14vRBlp-WKFtLojsqiPuiBG6258rtzDw&ehbc=2E312F"} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: '384px' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de localização HECHO"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                ></iframe>
              </div>
              
              {/* Fallback link if iframe doesn't load */}
              <div className="text-center mb-8">
                <a 
                  href={contactInfo?.googleMapsUrl || "https://www.google.com/maps/d/viewer?mid=14vRBlp-WKFtLojsqiPuiBG6258rtzDw&ehbc=2E312F"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  {t('about.openMap')}
                </a>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-r from-black to-gray-800 rounded-2xl p-6 text-white">
                <h4 className="text-xl font-bold mb-4 text-yellow-400 text-center">
                  {t('about.contactInfo')}
                </h4>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <MapPin className="h-6 w-6 text-yellow-400 mx-auto" />
                    <div className="text-gray-300">
                      <p className="font-semibold">{t('about.address')}</p>
                      <p className="text-sm">{contactInfo?.addressStreet || t('common.address.street')}</p>
                      <p className="text-sm">{contactInfo?.addressDistrict || t('common.address.district')}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Phone className="h-6 w-6 text-yellow-400 mx-auto" />
                    <div className="text-gray-300">
                      <p className="font-semibold">{t('about.phone')}</p>
                      <p className="text-sm">{contactInfo?.phonePrimary || '(11) 3456-7890'}</p>
                      <p className="text-sm">{contactInfo?.phoneSecondary || '(11) 98765-4321'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Clock className="h-6 w-6 text-yellow-400 mx-auto" />
                    <div className="text-gray-300">
                      <p className="font-semibold">{t('about.schedule')}</p>
                      <p className="text-sm">{contactInfo?.scheduleWeekdays || t('common.schedule.weekdays')}</p>
                      <p className="text-sm">{contactInfo?.scheduleSaturday || t('common.schedule.saturday')}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                  <a
                    href={`tel:${contactInfo?.phonePrimary?.replace(/\D/g, '') || '1134567890'}`}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    {t('about.call')}
                  </a>
                  <a
                    href={`https://wa.me/${contactInfo?.phoneWhatsapp || '5511987654321'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    {t('about.whatsapp')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;