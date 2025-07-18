import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContactInfo } from '../hooks/useContactInfo';

interface FooterProps {
  onNavigate?: (page: 'home' | 'about' | 'catalog' | 'login' | 'admin') => void;
}

const Footer = ({ onNavigate }: FooterProps) => {
  const { t } = useLanguage();
  const { contactInfo } = useContactInfo();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  const quickLinks = [
    { name: t('nav.inicio'), href: '#inicio' },
    { name: t('nav.catalogo'), href: '#catalogo' },
    { name: t('nav.sobre'), href: '#sobre' },
    { name: t('contact.title'), href: '#contato' },
    { name: 'Login', href: '#login', action: () => onNavigate?.('login') }
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
                src="/logo.png" 
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
                    onClick={(e) => {
                      if (link.action) {
                        e.preventDefault();
                        link.action();
                      }
                    }}
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
                  <p>{contactInfo?.addressStreet || t('common.address.street')}</p>
                  <p>{contactInfo?.addressDistrict || t('common.address.district')}</p>
                  <p>CEP: {contactInfo?.addressZipcode || '01234-567'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <div className="text-gray-400">
                  <p>{contactInfo?.phonePrimary || '(11) 3456-7890'}</p>
                  <p>{contactInfo?.phoneSecondary || '(11) 98765-4321'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <p className="text-gray-400">{contactInfo?.emailContact || 'contato@hecho.com.br'}</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-400">
                  <p>{contactInfo?.scheduleWeekdays || t('common.schedule.weekdays')}</p>
                  <p>{contactInfo?.scheduleSaturday || t('common.schedule.saturday')}</p>
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