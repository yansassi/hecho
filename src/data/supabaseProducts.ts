import { supabase } from '../lib/supabase';
import { Product, ProductCategory } from '../types/Product';

// Converter produto do Supabase para o formato usado no app
const convertSupabaseProduct = (supabaseProduct: any): Product => ({
  codigo: supabaseProduct.codigo,
  nome: supabaseProduct.nome,
  info: supabaseProduct.info || '',
  quantidade: supabaseProduct.quantidade || '1 Unid.',
  codigoBarra: supabaseProduct.codigo_barra,
  categoria: supabaseProduct.categoria,
  imageUrl: supabaseProduct.image_url || null
});

export const getAllProductsFromSupabase = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar produtos do Supabase:', error);
      // Fallback para dados locais em caso de erro
      const { getAllProducts } = await import('./catalogData');
      return getAllProducts();
    }

    return data ? data.map(convertSupabaseProduct) : [];
  } catch (err) {
    console.error('Erro na conexão com Supabase:', err);
    // Fallback para dados locais
    const { getAllProducts } = await import('./catalogData');
    return getAllProducts();
  }
};

export const getProductCategoriesFromSupabase = async (): Promise<ProductCategory[]> => {
  try {
    const products = await getAllProductsFromSupabase();
    const categoryMap = new Map<string, number>();
    
    products.forEach(product => {
      const category = product.categoria;
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const categories: ProductCategory[] = [
      {
        id: 'all',
        name: 'all',
        displayName: 'Todos los Productos',
        count: products.length,
        description: 'Visualiza todos los productos disponibles',
        image: 'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ];

    const categoryImages: Record<string, string> = {
      'Bazar': 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Elétrica': 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Ferreteria': 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Plomeria': 'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=600'
    };

    const categoryDescriptions: Record<string, string> = {
      'Bazar': 'Utensilios domésticos, productos de limpieza y artículos para el día a día',
      'Elétrica': 'Materiales eléctricos, cables, tomacorrientes y componentes electrónicos',
      'Ferreteria': 'Herramientas, tornillos, clavos, cerraduras y materiales de construcción',
      'Plomeria': 'Tubos, conexiones, registros y materiales para instalaciones hidráulicas'
    };

    categoryMap.forEach((count, categoryName) => {
      categories.push({
        id: categoryName.toLowerCase(),
        name: categoryName,
        displayName: categoryName,
        count,
        description: categoryDescriptions[categoryName] || `Productos de la categoría ${categoryName}`,
        image: categoryImages[categoryName] || 'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=600'
      });
    });

    return categories;
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    // Fallback para dados locais
    const { getProductCategories } = await import('./catalogData');
    return getProductCategories();
  }
};