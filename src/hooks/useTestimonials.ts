import { useState, useEffect } from 'react';
import { supabase, type Testimonial } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

export interface TestimonialDisplay {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<TestimonialDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando depoimentos do Supabase...');
      console.log('📍 URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('🔑 Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'Não configurada');

      const { data, error: supabaseError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      console.log('📊 Resposta do Supabase:', { 
        data: data?.length ? `${data.length} depoimentos encontrados` : 'Nenhum depoimento', 
        error: supabaseError 
      });

      if (supabaseError) {
        throw supabaseError;
      }

      // Transformar dados para o formato de exibição baseado no idioma
      const transformedData: TestimonialDisplay[] = (data || []).map((testimonial: Testimonial) => ({
        id: testimonial.id,
        name: testimonial.name,
        role: testimonial.role,
        content: language === 'pt' ? testimonial.content_pt : testimonial.content_es,
        rating: testimonial.rating
      }));

      console.log('✅ Depoimentos transformados:', transformedData.length);
      setTestimonials(transformedData);
    } catch (err) {
      console.error('❌ Erro ao buscar depoimentos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      
      // Fallback para dados estáticos em caso de erro
      console.log('🔄 Usando dados de fallback...');
      const fallbackTestimonials: TestimonialDisplay[] = [
        {
          id: 'fallback-1',
          name: language === 'pt' ? 'João Silva' : 'Juan Silva',
          role: language === 'pt' ? 'Engenheiro Civil' : 'Ingeniero Civil',
          content: language === 'pt' 
            ? 'A HECHO é minha fornecedora há mais de 10 anos. Qualidade excepcional e atendimento sempre atencioso.'
            : 'HECHO es mi proveedor desde hace más de 10 años. Calidad excepcional y atención siempre atenta.',
          rating: 5
        },
        {
          id: 'fallback-2',
          name: language === 'pt' ? 'Maria Santos' : 'María Santos',
          role: language === 'pt' ? 'Arquiteta' : 'Arquitecta',
          content: language === 'pt'
            ? 'Encontro tudo que preciso em um só lugar. A variedade de produtos e a expertise da equipe fazem toda a diferença.'
            : 'Encuentro todo lo que necesito en un solo lugar. La variedad de productos y la experiencia del equipo hacen toda la diferencia.',
          rating: 5
        },
        {
          id: 'fallback-3',
          name: 'Carlos Oliveira',
          role: language === 'pt' ? 'Proprietário de Casa' : 'Propietario de Casa',
          content: language === 'pt'
            ? 'Excelente atendimento e produtos de qualidade. Sempre que preciso de algo para casa, sei que posso contar com a HECHO.'
            : 'Excelente atención y productos de calidad. Siempre que necesito algo para casa, sé que puedo contar con HECHO.',
          rating: 5
        }
      ];
      
      setTestimonials(fallbackTestimonials);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [language]);

  // Configurar real-time subscription para atualizações automáticas
  useEffect(() => {
    const channel = supabase
      .channel('testimonials-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'testimonials'
        },
        () => {
          // Recarregar depoimentos quando houver mudanças
          fetchTestimonials();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [language]);

  return {
    testimonials,
    loading,
    error,
    refetch: fetchTestimonials
  };
};