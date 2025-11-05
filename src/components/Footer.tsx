import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  const quickLinks = [
    { name: t('nav.inicio'), href: '#inicio' },
    { name: t('nav.catalogo'), href: '#catalogo' },
    { name: t('nav.sobre'), href: '#sobre' },
    { name: t('contact.title'), href: '#contato' }
  ];

  const categories = [
    t('categories.ferragens'),
    t('categories.encanamento'),
    t('categories.eletrica'),
    t('categories.bazar'),
    'Jardinagem',
    'Tintas'
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <img
                src="https://hechopy.com/logo%20hecho%20colorida%20horizontal.png"
                alt="HECHO - Soluções Rápidas"
                className="h-12 w-auto mb-4"
              />
              <p className="text-gray-400">
                {t('hero.subtitle')}
              </p>
            </div>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="bg-gray-800 hover:bg-yellow-500 hover:text-black p-3 rounded-full transition-colors"
                    aria-label={social.label}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-yellow-400">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-yellow-400">{t('footer.categories')}</h4>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <a
                    href="#categorias"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-yellow-400">{t('footer.contact')}</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-400">
                  <p>{t('common.address.street')}</p>
                  <p>{t('common.address.district')}</p>
                  <p>CEP: 01234-567</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <div className="text-gray-400">
                  <p>(11) 3456-7890</p>
                  <p>(11) 98765-4321</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <p className="text-gray-400">contato@hecho.com.br</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-400">
                  <p>{t('common.schedule.weekdays')}</p>
                  <p>{t('common.schedule.saturday')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400 text-sm">
                {t('footer.developed')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;