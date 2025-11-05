import { Product } from '../types/Product';

export const parseCSVData = (csvText: string): Product[] => {
  const lines = csvText.split('\n');
  const products: Product[] = [];
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const columns = line.split(';');
      if (columns.length >= 6) {
        products.push({
          codigo: columns[0],
          nome: columns[1],
          info: columns[2],
          quantidade: columns[3],
          codigoBarra: columns[4],
          categoria: columns[5]
        });
      }
    }
  }
  
  return products;
};

export const getProductsByCategory = (products: Product[], category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(product => 
    product.categoria.toLowerCase() === category.toLowerCase()
  );
};

export const searchProducts = (products: Product[], searchTerm: string): Product[] => {
  if (!searchTerm) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product =>
    product.nome.toLowerCase().includes(term) ||
    product.info.toLowerCase().includes(term) ||
    product.codigo.toLowerCase().includes(term)
  );
};