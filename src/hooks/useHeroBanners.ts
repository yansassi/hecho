import { useState, useEffect } from 'react';
import { supabase, type HeroBanner } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

export interface HeroBannerDisplay {
  id: string;
  title: string;
  subtitle: string;
  highlight: string;
  ctaText: string;
  ctaAction: string;
  image: string;
  mobileImage: string;
}

export const useHeroBanners = () => {
  const [banners, setBanners] = useState<HeroBannerDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando banners do Hero do Supabase...');

      const { data, error: supabaseError } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      console.log('📊 Resposta do Supabase (hero_banners):', { 
        data: data?.length ? `${data.length} banners encontrados` : 'Nenhum banner', 
        error: supabaseError 
      });

      if (supabaseError) {
        throw supabaseError;
      }

      // Transformar dados para o formato de exibição baseado no idioma
      const transformedData: HeroBannerDisplay[] = (data || []).map((banner: HeroBanner) => ({
        id: banner.id,
        title: language === 'pt' ? banner.title_pt : banner.title_es,
        subtitle: language === 'pt' ? banner.subtitle_pt : banner.subtitle_es,
        highlight: language === 'pt' ? banner.highlight_pt : banner.highlight_es,
        ctaText: language === 'pt' ? banner.cta_text_pt : banner.cta_text_es,
        ctaAction: banner.cta_action,
        image: banner.image_url,
        mobileImage: banner.mobile_image_url || banner.image_url
      }));

      console.log('✅ Banners transformados:', transformedData.length);
      setBanners(transformedData);
    } catch (err) {
      console.error('❌ Erro ao buscar banners:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      
      // Fallback para dados estáticos em caso de erro
      console.log('🔄 Usando dados de fallback para banners...');
      const fallbackBanners: HeroBannerDisplay[] = [
        {
          id: 'fallback-1',
          title: language === 'pt' ? 'Soluções rápidas' : 'Soluciones rápidas',
          subtitle: language === 'pt' 
            ? 'Ferragens, materiais elétricos, encanamento e muito mais. Qualidade e agilidade em um só lugar.'
            : 'Ferretería, materiales eléctricos, plomería y mucho más. Calidad y agilidad en un solo lugar.',
          highlight: language === 'pt' ? 'para sua obra' : 'para tu obra',
          ctaText: language === 'pt' ? 'Ver Catálogo' : 'Ver Catálogo',
          ctaAction: 'catalog',
          image: 'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=1200',
          mobileImage: 'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
        },
        {
          id: 'fallback-2',
          title: language === 'pt' ? 'Ferramentas Profissionais' : 'Herramientas Profesionales',
          subtitle: language === 'pt' 
            ? 'As melhores marcas em ferramentas manuais e elétricas para profissionais e entusiastas.'
            : 'Las mejores marcas en herramientas manuales y eléctricas para profesionales y entusiastas.',
          highlight: language === 'pt' ? 'de qualidade' : 'de calidad',
          ctaText: language === 'pt' ? 'Ver Ferramentas' : 'Ver Herramientas',
          ctaAction: 'catalog',
          image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=1200',
          mobileImage: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
        },
        {
          id: 'fallback-3',
          title: language === 'pt' ? 'Materiais Hidráulicos' : 'Materiales Hidráulicos',
          subtitle: language === 'pt'
            ? 'Tubos, conexões, registros e tudo para suas instalações hidráulicas.'
            : 'Tubos, conexiones, registros y todo para tus instalaciones hidráulicas.',
          highlight: language === 'pt' ? 'completos' : 'completos',
          ctaText: language === 'pt' ? 'Ver Produtos' : 'Ver Productos',
          ctaAction: 'catalog',
          image: 'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=1200',
          mobileImage: 'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
        }
      ];
      
      setBanners(fallbackBanners);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [language]);

  // Configurar real-time subscription para atualizações automáticas
  useEffect(() => {
    const channel = supabase
      .channel('hero-banners-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hero_banners'
        },
        () => {
          // Recarregar banners quando houver mudanças
          fetchBanners();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [language]);

  return {
    banners,
    loading,
    error,
    refetch: fetchBanners
  };
};