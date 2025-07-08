import { useState, useEffect } from 'react';
import { supabase, type Product } from '../lib/supabase';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando produtos do Supabase...');

      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('📊 Resposta do Supabase (products):', { 
        data: data?.length ? `${data.length} produtos encontrados` : 'Nenhum produto', 
        error: supabaseError 
      });

      if (supabaseError) {
        throw supabaseError;
      }

      console.log('✅ Produtos carregados:', data?.length || 0);
      setProducts(data || []);
    } catch (err) {
      console.error('❌ Erro ao buscar produtos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Configurar real-time subscription para atualizações automáticas
  useEffect(() => {
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          // Recarregar produtos quando houver mudanças
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  };
};

// Hook para buscar produtos por categoria
export const useProductsByCategory = (categoria?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductsByCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('products').select('*');
      
      if (categoria && categoria !== 'all') {
        query = query.eq('categoria', categoria);
      }
      
      const { data, error: supabaseError } = await query.order('nome', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      setProducts(data || []);
    } catch (err) {
      console.error('❌ Erro ao buscar produtos por categoria:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, [categoria]);

  return {
    products,
    loading,
    error,
    refetch: fetchProductsByCategory
  };
};

// Hook para buscar produtos com busca por texto
export const useProductsSearch = (searchTerm?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('products').select('*');
      
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        query = query.or(`nome.ilike.%${term}%,info.ilike.%${term}%,codigo.ilike.%${term}%`);
      }
      
      const { data, error: supabaseError } = await query.order('nome', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      setProducts(data || []);
    } catch (err) {
      console.error('❌ Erro ao buscar produtos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchProducts();
  }, [searchTerm]);

  return {
    products,
    loading,
    error,
    refetch: searchProducts
  };
};