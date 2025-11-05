import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar todos os produtos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar produtos');
    } finally {
      setLoading(false);
    }
  };

  // Adicionar produto
  const addProduct = async (product: ProductInsert) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar produto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Atualizar produto
  const updateProduct = async (id: string, updates: ProductUpdate) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === id ? data : p));
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar produto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Remover produto
  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover produto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Buscar produtos por categoria
  const getProductsByCategory = (category: string) => {
    if (category === 'all') return products;
    return products.filter(product => 
      product.categoria.toLowerCase() === category.toLowerCase()
    );
  };

  // Buscar produtos por termo
  const searchProducts = (searchTerm: string) => {
    if (!searchTerm) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter(product =>
      product.nome.toLowerCase().includes(term) ||
      product.info.toLowerCase().includes(term) ||
      product.codigo.toLowerCase().includes(term) ||
      product.codigo_barra.toLowerCase().includes(term)
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
    getProductsByCategory,
    searchProducts
  };
};