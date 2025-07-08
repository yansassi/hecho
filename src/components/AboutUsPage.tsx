import React, { useState } from 'react';
import { Award, Users, Clock, Shield, MapPin, Phone, Mail, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTestimonials } from '../hooks/useTestimonials';
import { useContactInfo } from '../hooks/useContactInfo';

const AboutUsPage = () => {
  const { t, language } = useLanguage();
  const { testimonials, loading: testimonialsLoading, error: testimonialsError } = useTestimonials();
  const { contactInfo } = useContactInfo();

  const stats = [
    {
      icon: Award,
      number: '25+',
      label: t('about.yearsMarket'),
      description: t('about.yearsMarket.desc')
    },
    {
      icon: Users,
      number: '10k+',
      label: t('about.satisfiedClients'),
      description: t('about.satisfiedClients.desc')
    },
    {
      icon: Clock,
      number: '24h',
      label: t('about.fastService'),
      description: t('about.fastService.desc')
    },
    {
      icon: Shield,
      number: '100%',
      label: t('about.qualityGuaranteed'),
      description: t('about.qualityGuaranteed.desc')
    }
  ];

  const timeline = [
    {
      year: '1999',
      title: t('timeline.1999.title'),
      description: t('timeline.1999.desc')
    },
    {
      year: '2005',
      title: t('timeline.2005.title'),
      description: t('timeline.2005.desc')
    },
    {
      year: '2010',
      title: t('timeline.2010.title'),
      description: t('timeline.2010.desc')
    },
    {
      year: '2015',
      title: t('timeline.2015.title'),
      description: t('timeline.2015.desc')
    },
    {
      year: '2020',
      title: t('timeline.2020.title'),
      description: t('timeline.2020.desc')
    },
    {
      year: '2024',
      title: t('timeline.2024.title'),
      description: t('timeline.2024.desc')
    }
  ];


  // Texto da história em espanhol e português
  const historyText = {
    es: {
      p1: 'HECHO nació en 1999 con un sueño simple: ofrecer productos de calidad y atención excepcional para quienes necesitan soluciones rápidas y confiables. Lo que comenzó como una pequeña ferretería en el centro de São Paulo se transformó en una referencia en el sector.',
      p2: 'A lo largo de los años, expandimos nuestro catálogo para incluir materiales eléctricos, productos de plomería y artículos para el hogar, manteniendo siempre nuestro compromiso con la calidad y la satisfacción del cliente.',
      p3: 'Hoy atendemos tanto a profesionales de la construcción civil como a personas que buscan soluciones para el hogar, ofreciendo una amplia gama de productos de las mejores marcas del mercado, con la experiencia y confianza que solo 25 años de experiencia pueden proporcionar.'
    },
    pt: {
      p1: 'A HECHO nasceu em 1999 com um sonho simples: oferecer produtos de qualidade e atendimento excepcional para quem precisa de soluções rápidas e confiáveis. O que começou como uma pequena loja de ferragens no centro de São Paulo se transformou em uma referência no setor.',
      p2: 'Ao longo dos anos, expandimos nosso catálogo para incluir materiais elétricos, produtos de encanamento e itens para casa, sempre mantendo nosso compromisso com a qualidade e a satisfação do cliente.',
      p3: 'Hoje, atendemos tanto profissionais da construção civil quanto pessoas que buscam soluções para casa, oferecendo uma ampla gama de produtos das melhores marcas do mercado, com a expertise e confiança que só 25 anos de experiência podem proporcionar.'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-colors group">
                  <div className="flex justify-center mb-4">
                    <div className="bg-black group-hover:bg-gray-800 p-4 rounded-full transition-colors">
                      <IconComponent className="h-8 w-8 text-yellow-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-black mb-2">{stat.number}</div>
                  <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {t('about.ourHistory')}
                </h2>
                <div className="space-y-4 text-lg text-gray-700">
                  <p>{historyText[language].p1}</p>
                  <p>{historyText[language].p2}</p>
                  <p>{historyText[language].p3}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Interior da loja HECHO"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-yellow-500 text-black p-6 rounded-2xl shadow-xl">
                <div className="text-2xl font-bold">25 {t('about.yearsMarket')}</div>
                <div className="text-black/80">{t('common.tradition')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('about.ourJourney')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.ourJourney.desc')}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-yellow-400"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-full border-4 border-white shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="text-center">
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
              <div className="mt-8 bg-gradient-to-r from-black to-gray-800 rounded-2xl p-6 text-white">
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
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('about.ourValues')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.ourValues.desc')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl">
              <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.quality')}</h3>
              <p className="text-gray-600">
                {t('about.quality.desc')}
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.service')}</h3>
              <p className="text-gray-600">
                {t('about.service.desc')}
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.agility')}</h3>
              <p className="text-gray-600">
                {t('about.agility.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('about.testimonials')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.testimonials.desc')}
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-lg animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="h-5 w-5 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : testimonialsError ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <p className="text-lg font-semibold">Erro ao carregar depoimentos</p>
                <p className="text-sm">{testimonialsError}</p>
              </div>
              <p className="text-gray-600">
                {t('about.testimonials.error')}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.slice(0, 6).map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;