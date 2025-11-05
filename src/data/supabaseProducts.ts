import { supabase } from '../lib/supabase';
import { Product, ProductCategory } from '../types/Product';

const convertSupabaseProduct = (supabaseProduct: any): Product => ({
  codigo: supabaseProduct.codigo,
  nome: supabaseProduct.nome,
  info: supabaseProduct.info || '',
  description: supabaseProduct.description || '',
  quantidade: supabaseProduct.quantidade || '1 Unid.',
  codigoBarra: supabaseProduct.codigo_barra,
  categoryId: supabaseProduct.category_id,
  categoryName: supabaseProduct.category_name || 'Sin Categoría',
  categoria: supabaseProduct.category_name || 'Sin Categoría',
  imageUrl: supabaseProduct.image_url || null,
  isPromotion: supabaseProduct.is_promotion || false
});

export interface PaginatedResult {
  products: Product[];
  total: number;
  hasMore: boolean;
}

export const getProductsPaginated = async (
  page: number = 1,
  pageSize: number = 50,
  category?: string,
  searchTerm?: string
): Promise<PaginatedResult> => {
  try {
    let query = supabase
      .from('products')
      .select('id, codigo, nome, info, description, quantidade, codigo_barra, category_id, image_url, created_at, updated_at, categories(id, name)', { count: 'exact' });

    // Filtrar por categoria
    if (category && category !== 'all') {
      if (category === 'uncategorized') {
        query = query.is('category_id', null);
      } else {
        query = query.eq('category_id', category);
      }
    }

    // Filtrar por termo de busca
    if (searchTerm && searchTerm.trim()) {
      const term = `%${searchTerm}%`;
      const normalizedTerm = searchTerm.replace(/[^a-zA-Z0-9]/g, '');

      if (normalizedTerm.length > 0) {
        query = query.or(`nome.ilike.${term},info.ilike.${term},codigo.ilike.${term},codigo_barra.ilike.${term},codigo.ilike.%${normalizedTerm}%`);
      } else {
        query = query.or(`nome.ilike.${term},info.ilike.${term},codigo.ilike.${term},codigo_barra.ilike.${term}`);
      }
    }

    // Aplicar ordenação e paginação
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Erro ao buscar produtos do Supabase:', error);
      return { products: [], total: 0, hasMore: false };
    }

    const total = count || 0;

    const productIds = data?.map(p => p.id) || [];
    const { data: promotions } = await supabase
      .from('promotions')
      .select('product_id')
      .in('product_id', productIds)
      .eq('active', true);

    const promotionSet = new Set(promotions?.map(p => p.product_id) || []);

    const products = data ? data.map((item: any) => {
      const categoryName = item.categories?.name || 'Sin Categoría';
      return convertSupabaseProduct({
        ...item,
        category_id: item.category_id,
        category_name: categoryName,
        is_promotion: promotionSet.has(item.id)
      });
    }) : [];

    const hasMore = (from + products.length) < total;

    return { products, total, hasMore };
  } catch (err) {
    console.error('Erro na conexão com Supabase:', err);
    return { products: [], total: 0, hasMore: false };
  }
};

export const getAllProductsFromSupabase = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, codigo, nome, info, description, quantidade, codigo_barra, category_id, image_url, created_at, updated_at, categories(id, name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar produtos do Supabase:', error);
      const { getAllProducts } = await import('./catalogData');
      return getAllProducts();
    }

    return data ? data.map((item: any) => {
      const categoryName = item.categories?.name || 'Sin Categoría';
      return convertSupabaseProduct({
        ...item,
        category_id: item.category_id,
        category_name: categoryName
      });
    }) : [];
  } catch (err) {
    console.error('Erro na conexão com Supabase:', err);
    const { getAllProducts } = await import('./catalogData');
    return getAllProducts();
  }
};

export const getProductCategoriesFromSupabase = async (searchTerm?: string): Promise<ProductCategory[]> => {
  try {
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, description');

    if (categoriesError) {
      console.error('Erro ao buscar categorias:', categoriesError);
      return [];
    }

    let query = supabase
      .from('products')
      .select('category_id', { count: 'exact' });

    if (searchTerm && searchTerm.trim()) {
      const term = `%${searchTerm}%`;
      const normalizedTerm = searchTerm.replace(/[^a-zA-Z0-9]/g, '');

      if (normalizedTerm.length > 0) {
        query = query.or(`nome.ilike.${term},info.ilike.${term},codigo.ilike.${term},codigo_barra.ilike.${term},codigo.ilike.%${normalizedTerm}%`);
      } else {
        query = query.or(`nome.ilike.${term},info.ilike.${term},codigo.ilike.${term},codigo_barra.ilike.${term}`);
      }
    }

    const { count: totalCount, error: countError } = await query;

    if (countError) {
      console.error('Erro ao buscar contagem total:', countError);
      return [];
    }

    let countsQuery = supabase
      .from('products')
      .select('category_id, categories(id, name)');

    if (searchTerm && searchTerm.trim()) {
      const term = `%${searchTerm}%`;
      const normalizedTerm = searchTerm.replace(/[^a-zA-Z0-9]/g, '');

      if (normalizedTerm.length > 0) {
        countsQuery = countsQuery.or(`nome.ilike.${term},info.ilike.${term},codigo.ilike.${term},codigo_barra.ilike.${term},codigo.ilike.%${normalizedTerm}%`);
      } else {
        countsQuery = countsQuery.or(`nome.ilike.${term},info.ilike.${term},codigo.ilike.${term},codigo_barra.ilike.${term}`);
      }
    }

    const { data: categoryCounts, error: countsError } = await countsQuery;

    if (countsError) {
      console.error('Erro ao buscar contagem por categoria:', countsError);
      return [];
    }

    const categoryCountMap = new Map<string, number>();
    let uncategorizedCount = 0;

    categoryCounts?.forEach((product: any) => {
      if (product.category_id) {
        categoryCountMap.set(product.category_id, (categoryCountMap.get(product.category_id) || 0) + 1);
      } else {
        uncategorizedCount++;
      }
    });

    const categoryImages: Record<string, string> = {
      'Bazar': 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Elétrica': 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Ferreteria': 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Plomeria': 'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Pesca': 'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Agropecuari': 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Sin Categoría': 'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=600'
    };

    const result: ProductCategory[] = [
      {
        id: 'all',
        name: 'all',
        displayName: 'Todos los Productos',
        count: totalCount || 0,
        description: 'Visualiza todos los productos disponibles',
        image: 'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ];

    if (categories) {
      const sortedCategories = [...categories].sort((a: any, b: any) => {
        const countA = categoryCountMap.get(a.id) || 0;
        const countB = categoryCountMap.get(b.id) || 0;
        return countB - countA;
      });

      sortedCategories.forEach((cat: any) => {
        const count = categoryCountMap.get(cat.id) || 0;
        result.push({
          id: cat.id,
          name: cat.name,
          displayName: cat.name,
          count,
          description: cat.description || `Productos de la categoría ${cat.name}`,
          image: categoryImages[cat.name] || 'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=600'
        });
      });
    }

    if (uncategorizedCount > 0) {
      result.push({
        id: 'uncategorized',
        name: 'Sin Categoría',
        displayName: 'Sin Categoría',
        count: uncategorizedCount,
        description: 'Productos sin categoría definida',
        image: 'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=600'
      });
    }

    return result;
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    const { getProductCategories } = await import('./catalogData');
    return getProductCategories();
  }
};