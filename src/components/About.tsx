import React from 'react';
import { Award, Users, Clock, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

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
                  <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
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
      </div>
    </section>
  );
};

export default About;