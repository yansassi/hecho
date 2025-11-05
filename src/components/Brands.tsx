import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Brands = () => {
  const { t } = useLanguage();

  const brands = [
    {
      name: 'Tigre',
      logo: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
      category: 'Tubos e Conexões'
    },
    {
      name: 'Tramontina',
      logo: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
      category: 'Ferramentas'
    },
    {
      name: 'Siemens',
      logo: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
      category: 'Materiais Elétricos'
    },
    {
      name: 'Viqua',
      logo: 'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
      category: 'Hidráulica'
    },
    {
      name: 'Famastil',
      logo: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
      category: 'Jardinagem'
    },
    {
      name: 'Master',
      logo: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
      category: 'Discos de Corte'
    }
  ];

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-20">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="group bg-gray-50 rounded-xl p-6 hover:bg-yellow-50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="aspect-video bg-white rounded-lg overflow-hidden mb-4 shadow-sm">
                <img
                  src={brand.logo}
                  alt={`Logo ${brand.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-gray-900 mb-1">{brand.name}</h3>
                <p className="text-sm text-gray-600">{brand.category}</p>
              </div>
            </div>
          ))}
        </div>

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
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('about.location')}</h3>
              <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100 mb-6">
                <iframe 
                  src="https://www.google.com/maps/d/embed?mid=14vRBlp-WKFtLojsqiPuiBG6258rtzDw&ehbc=2E312F" 
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
                  href="https://www.google.com/maps/d/viewer?mid=14vRBlp-WKFtLojsqiPuiBG6258rtzDw&ehbc=2E312F"
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
                      <p className="text-sm">{t('common.address.street')}</p>
                      <p className="text-sm">{t('common.address.district')}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Phone className="h-6 w-6 text-yellow-400 mx-auto" />
                    <div className="text-gray-300">
                      <p className="font-semibold">{t('about.phone')}</p>
                      <p className="text-sm">(11) 3456-7890</p>
                      <p className="text-sm">(11) 98765-4321</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Clock className="h-6 w-6 text-yellow-400 mx-auto" />
                    <div className="text-gray-300">
                      <p className="font-semibold">{t('about.schedule')}</p>
                      <p className="text-sm">{t('common.schedule.weekdays')}</p>
                      <p className="text-sm">{t('common.schedule.saturday')}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                  <a
                    href="tel:1134567890"
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    {t('about.call')}
                  </a>
                  <a
                    href="https://wa.me/5511987654321"
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