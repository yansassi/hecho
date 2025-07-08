import { Product, ProductCategory } from '../types/Product';
import { supabase } from '../lib/supabase';


// Função para buscar todos os produtos do Supabase
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }

    // Converter formato do Supabase para o formato esperado
    return (data || []).map(product => ({
      codigo: product.codigo,
      nome: product.nome,
      info: product.info,
      quantidade: product.quantidade,
      codigoBarra: product.codigo_barra,
      categoria: product.categoria,
      image_url: product.image_url
    }));
  } catch (error) {
    console.error('Erro na conexão com Supabase:', error);
    return [];
  }
};

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  const products = await getAllProducts();
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
};