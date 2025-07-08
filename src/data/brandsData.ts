import { supabase, Brand } from '../lib/supabase';

// Função para buscar todas as marcas ativas
export const getAllBrands = async (): Promise<Brand[]> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Erro ao buscar marcas:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro na conexão com Supabase:', error);
    return [];
  }
};

// Função para buscar marcas por categoria
export const getBrandsByCategory = async (category: string): Promise<Brand[]> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .eq('category', category)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Erro ao buscar marcas por categoria:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro na conexão com Supabase:', error);
    return [];
  }
};

// Função para adicionar uma nova marca
export const addBrand = async (brand: Omit<Brand, 'id' | 'created_at' | 'updated_at'>): Promise<Brand | null> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .insert([brand])
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar marca:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro na conexão com Supabase:', error);
    return null;
  }
};

// Função para atualizar uma marca
export const updateBrand = async (id: string, updates: Partial<Brand>): Promise<Brand | null> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar marca:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro na conexão com Supabase:', error);
    return null;
  }
};

// Função para deletar uma marca (soft delete - marca como inativa)
export const deleteBrand = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('brands')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar marca:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro na conexão com Supabase:', error);
    return false;
  }
};

// Função para buscar uma marca específica por ID
export const getBrandById = async (id: string): Promise<Brand | null> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar marca por ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro na conexão com Supabase:', error);
    return null;
  }
};

// Função para reordenar marcas
export const reorderBrands = async (brandUpdates: { id: string; display_order: number }[]): Promise<boolean> => {
  try {
    const promises = brandUpdates.map(update =>
      supabase
        .from('brands')
        .update({ display_order: update.display_order })
        .eq('id', update.id)
    );

    const results = await Promise.all(promises);
    
    // Verificar se alguma operação falhou
    const hasError = results.some(result => result.error);
    
    if (hasError) {
      console.error('Erro ao reordenar marcas');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro na conexão com Supabase:', error);
    return false;
  }
};