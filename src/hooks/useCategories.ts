import { useState, useEffect } from 'react';
import { supabase, type Category } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

export interface CategoryDisplay {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  iconName: string;
  items: string[];
}

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando categorias do Supabase...');

      const { data, error: supabaseError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      console.log('📊 Resposta do Supabase (categorias):', { 
        data: data?.length ? `${data.length} categorias encontradas` : 'Nenhuma categoria', 
        error: supabaseError 
      });

      if (supabaseError) {
        throw supabaseError;
      }

      // Transformar dados para o formato de exibição baseado no idioma
      const transformedData: CategoryDisplay[] = (data || []).map((category: Category) => ({
        id: category.id,
        name: category.name,
        title: language === 'pt' ? category.title_pt : category.title_es,
        description: language === 'pt' ? category.description_pt : category.description_es,
        image: category.image_url,
        iconName: category.icon_name,
        items: language === 'pt' ? category.items_pt : category.items_es
      }));

      console.log('✅ Categorias transformadas:', transformedData.length);
      setCategories(transformedData);
    } catch (err) {
      console.error('❌ Erro ao buscar categorias:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      
      // Fallback para dados estáticos em caso de erro
      console.log('🔄 Usando dados de fallback para categorias...');
      const fallbackCategories: CategoryDisplay[] = [
        {
          id: 'fallback-1',
          name: 'ferragens',
          title: language === 'pt' ? 'Ferragens' : 'Ferretería',
          description: language === 'pt' 
            ? 'Ferramentas, parafusos, pregos, dobradiças e todos os acessórios para sua obra.'
            : 'Herramientas, tornillos, clavos, bisagras y todos los accesorios para tu obra.',
          image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=600',
          iconName: 'Wrench',
          items: language === 'pt' 
            ? ['Ferramentas manuais', 'Parafusos e fixadores', 'Fechaduras e dobradiças', 'Materiais de soldagem']
            : ['Herramientas manuales', 'Tornillos y fijadores', 'Cerraduras y bisagras', 'Materiales de soldadura']
        },
        {
          id: 'fallback-2',
          name: 'encanamento',
          title: language === 'pt' ? 'Encanamento' : 'Plomería',
          description: language === 'pt'
            ? 'Tubos, conexões, registros e tudo para instalações hidráulicas.'
            : 'Tubos, conexiones, registros y todo para instalaciones hidráulicas.',
          image: 'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=600',
          iconName: 'Droplet',
          items: language === 'pt'
            ? ['Tubos PVC e PPR', 'Conexões e registros', 'Torneiras e chuveiros', 'Bombas e reservatórios']
            : ['Tubos PVC y PPR', 'Conexiones y registros', 'Grifos y duchas', 'Bombas y reservatorios']
        },
        {
          id: 'fallback-3',
          name: 'eletrica',
          title: language === 'pt' ? 'Elétrica' : 'Eléctrica',
          description: language === 'pt'
            ? 'Fios, cabos, disjuntores, tomadas e materiais elétricos em geral.'
            : 'Cables, disyuntores, tomacorrientes y materiales eléctricos en general.',
          image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600',
          iconName: 'Zap',
          items: language === 'pt'
            ? ['Fios e cabos elétricos', 'Disjuntores e quadros', 'Tomadas e interruptores', 'Lâmpadas LED']
            : ['Cables eléctricos', 'Disyuntores y cuadros', 'Tomacorrientes e interruptores', 'Lámparas LED']
        },
        {
          id: 'fallback-4',
          name: 'bazar',
          title: language === 'pt' ? 'Bazar' : 'Bazar',
          description: language === 'pt'
            ? 'Utensílios domésticos, produtos de limpeza e itens para o dia a dia.'
            : 'Utensilios domésticos, productos de limpieza y artículos para el día a día.',
          image: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=600',
          iconName: 'Package',
          items: language === 'pt'
            ? ['Utensílios de cozinha', 'Produtos de limpeza', 'Organização doméstica', 'Jardinagem']
            : ['Utensilios de cocina', 'Productos de limpieza', 'Organización doméstica', 'Jardinería']
        }
      ];
      
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [language]);

  // Configurar real-time subscription para atualizações automáticas
  useEffect(() => {
    const channel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          // Recarregar categorias quando houver mudanças
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [language]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};