import React from 'react';
import { Wrench, Droplet, Zap, Package } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Categories = () => {
  const { t } = useLanguage();

  const categories = [
    {
      icon: Wrench,
      title: t('categories.ferragens'),
      description: t('categories.ferragens.desc'),
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=600',
      items: [
        t('categories.ferragens.item1'),
        t('categories.ferragens.item2'),
        t('categories.ferragens.item3'),
        t('categories.ferragens.item4')
      ]
    },
    {
      icon: Droplet,
      title: t('categories.encanamento'),
      description: t('categories.encanamento.desc'),
      image: 'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=600',
      items: [
        t('categories.encanamento.item1'),
        t('categories.encanamento.item2'),
        t('categories.encanamento.item3'),
        t('categories.encanamento.item4')
      ]
    },
    {
      icon: Zap,
      title: t('categories.eletrica'),
      description: t('categories.eletrica.desc'),
      image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600',
      items: [
        t('categories.eletrica.item1'),
        t('categories.eletrica.item2'),
        t('categories.eletrica.item3'),
        t('categories.eletrica.item4')
      ]
    },
    {
      icon: Package,
      title: t('categories.bazar'),
      description: t('categories.bazar.desc'),
      image: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=600',
      items: [
        t('categories.bazar.item1'),
        t('categories.bazar.item2'),
        t('categories.bazar.item3'),
        t('categories.bazar.item4')
      ]
    }
  ];

  return (
    <section id="categorias" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('categories.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('categories.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Ícone e título posicionados corretamente */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center mb-3">
                      <div className="bg-yellow-500 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <IconComponent className="h-6 w-6 text-black" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
                      {category.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;