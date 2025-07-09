import React, { useState } from 'react';
import { 
  LogOut, 
  Settings, 
  Image, 
  Users, 
  MessageSquare, 
  Phone, 
  Grid,
  Home,
  User,
  Package
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import HeroBannersAdmin from './HeroBannersAdmin';
import CategoriesAdmin from './CategoriesAdmin';
import BrandsAdmin from './BrandsAdmin';
import TestimonialsAdmin from './TestimonialsAdmin';
import ContactInfoAdmin from './ContactInfoAdmin';
import ProductsAdmin from './ProductsAdmin';

interface AdminPanelProps {
  onNavigate?: (page: 'home' | 'about' | 'catalog' | 'login' | 'admin') => void;
}

type AdminSection = 'dashboard' | 'hero-banners' | 'categories' | 'products' | 'testimonials' | 'contact-info';
type AdminSection = 'dashboard' | 'hero-banners' | 'categories' | 'brands' | 'products' | 'testimonials' | 'contact-info';

const AdminPanel = ({ onNavigate }: AdminPanelProps) => {
  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    // Obter usuário atual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onNavigate?.('home');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const menuItems = [
    {
      id: 'dashboard' as AdminSection,
      label: 'Dashboard',
      icon: Grid,
      description: 'Visão geral do sistema'
    },
    {
      id: 'hero-banners' as AdminSection,
      label: 'Banners do Hero',
      icon: Image,
      description: 'Gerenciar banners da página inicial'
    },
    {
      id: 'categories' as AdminSection,
      label: 'Categorias',
      icon: Grid,
      description: 'Gerenciar categorias de produtos'
    },
    {
      id: 'brands' as AdminSection,
      label: 'Marcas',
      icon: Package,
      description: 'Gerenciar marcas parceiras'
    },
    {
      id: 'products' as AdminSection,
      label: 'Produtos',
      icon: Package,
      description: 'Gerenciar catálogo de produtos'
    },
    {
      id: 'testimonials' as AdminSection,
      label: 'Depoimentos',
      icon: MessageSquare,
      description: 'Gerenciar depoimentos de clientes'
    },
    {
      id: 'contact-info' as AdminSection,
      label: 'Informações de Contato',
      icon: Phone,
      description: 'Gerenciar dados de contato da empresa'
    }
  ];

  const renderContent = () => {
    switch (currentSection) {
      case 'hero-banners':
        return <HeroBannersAdmin />;
      case 'categories':
        return <CategoriesAdmin />;
      case 'brands':
        return <BrandsAdmin />;
      case 'products':
        return <ProductsAdmin />;
      case 'testimonials':
        return <TestimonialsAdmin />;
      case 'contact-info':
        return <ContactInfoAdmin />;
      default:
        return (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Bem-vindo ao Painel Administrativo
                </h1>
                <p className="text-gray-600 mb-6">
                  Gerencie o conteúdo do seu site HECHO de forma fácil e intuitiva.
                </p>
                
                {user && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-yellow-600 mr-2" />
                      <span className="text-yellow-800">
                        Logado como: <strong>{user.email}</strong>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.slice(1).map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setCurrentSection(item.id)}
                      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-200 cursor-pointer border-l-4 border-yellow-500 hover:border-yellow-600"
                    >
                      <div className="flex items-center mb-4">
                        <div className="bg-yellow-100 p-3 rounded-full mr-4">
                          <IconComponent className="h-6 w-6 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.label}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => onNavigate?.('home')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Ver Site
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="HECHO Admin" 
                className="h-8 w-auto mr-4"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-500">HECHO</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate?.('home')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Home className="h-4 w-4 mr-2" />
                Ver Site
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setCurrentSection(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        currentSection === item.id
                          ? 'bg-yellow-50 text-yellow-700 border-r-2 border-yellow-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;