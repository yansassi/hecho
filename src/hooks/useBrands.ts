import { useState, useEffect } from 'react';
import { supabase, type Brand } from '../lib/supabase';

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando marcas do Supabase...');

      const { data, error: supabaseError } = await supabase
        .from('brands')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      console.log('📊 Resposta do Supabase (brands):', { 
        data: data?.length ? `${data.length} marcas encontradas` : 'Nenhuma marca', 
        error: supabaseError 
      });

      if (supabaseError) {
        throw supabaseError;
      }

      console.log('✅ Marcas carregadas:', data?.length || 0);
      setBrands(data || []);
    } catch (err) {
      console.error('❌ Erro ao buscar marcas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      
      // Fallback para dados estáticos em caso de erro
      console.log('🔄 Usando dados de fallback para marcas...');
      const fallbackBrands: Brand[] = [
        {
          id: 'fallback-1',
          name: 'Tigre',
          logo_url: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
          category: 'Tubos e Conexões',
          description: 'Líder em soluções para sistemas hidráulicos',
          website_url: '',
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'fallback-2',
          name: 'Tramontina',
          logo_url: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
          category: 'Ferramentas',
          description: 'Ferramentas e utensílios de alta qualidade',
          website_url: '',
          is_active: true,
          display_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'fallback-3',
          name: 'Siemens',
          logo_url: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
          category: 'Materiais Elétricos',
          description: 'Tecnologia alemã em materiais elétricos',
          website_url: '',
          is_active: true,
          display_order: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'fallback-4',
          name: 'Viqua',
          logo_url: 'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
          category: 'Hidráulica',
          description: 'Soluções completas para hidráulica',
          website_url: '',
          is_active: true,
          display_order: 4,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'fallback-5',
          name: 'Famastil',
          logo_url: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
          category: 'Jardinagem',
          description: 'Produtos para jardinagem e paisagismo',
          website_url: '',
          is_active: true,
          display_order: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'fallback-6',
          name: 'Master',
          logo_url: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
          category: 'Discos de Corte',
          description: 'Discos e ferramentas de corte profissionais',
          website_url: '',
          is_active: true,
          display_order: 6,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setBrands(fallbackBrands);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Configurar real-time subscription para atualizações automáticas
  useEffect(() => {
    const channel = supabase
      .channel('brands-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'brands'
        },
        () => {
          // Recarregar marcas quando houver mudanças
          fetchBrands();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    brands,
    loading,
    error,
    refetch: fetchBrands
  };
};