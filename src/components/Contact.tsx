import React from 'react';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.address'),
      details: [t('common.address.street'), t('common.address.district'), 'CEP: 01234-567']
    },
    {
      icon: Phone,
      title: t('contact.phones'),
      details: ['(11) 3456-7890', '(11) 98765-4321', 'WhatsApp disponível']
    },
    {
      icon: Clock,
      title: t('contact.schedule'),
      details: [t('common.schedule.weekdays'), t('common.schedule.saturday'), t('common.schedule.sunday')]
    },
    {
      icon: Mail,
      title: t('contact.email'),
      details: ['contato@hecho.com.br', 'vendas@hecho.com.br', 'suporte@hecho.com.br']
    }
  ];

  return (
    <section id="contato" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-yellow-50 transition-colors group">
                <div className="flex justify-center mb-4">
                  <div className="bg-black group-hover:bg-gray-800 p-4 rounded-full transition-colors">
                    <IconComponent className="h-8 w-8 text-yellow-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <div className="space-y-2">
                  {item.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-600">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-black to-gray-800 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">{t('contact.specialQuote')}</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            {t('contact.specialQuote.desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:1134567890"
              className="inline-flex items-center justify-center px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors"
            >
              <Phone className="mr-2 h-5 w-5" />
              {t('contact.callNow')}
            </a>
            <a
              href="https://wa.me/5511987654321"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold rounded-lg transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;