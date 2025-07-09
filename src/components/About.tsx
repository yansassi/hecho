import React from 'react';
import { Award, Users, Clock, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTestimonials } from '../hooks/useTestimonials';

const About = () => {
  const { t } = useLanguage();
  const { testimonials, loading: testimonialsLoading } = useTestimonials();

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

  return (
    <section id="sobre" className="py-20 bg-gradient-to-br from-yellow-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full">
                    <div className="flex justify-center mb-4">
                      <div className="bg-black p-3 rounded-full">
                        <IconComponent className="h-6 w-6 text-yellow-400" />
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

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Interior da loja HECHO"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-yellow-500 text-black p-6 rounded-2xl shadow-xl">
              <div className="text-2xl font-bold">{t('about.visitStore')}</div>
              <div className="text-black/80">{t('about.visitStore.desc')}</div>
            </div>
          </div>
        </div>

        {/* Seção de Depoimentos */}
        {!testimonialsLoading && testimonials.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {t('about.testimonials')}
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('about.testimonials.desc')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <div key={i} className="w-5 h-5 text-yellow-400">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;