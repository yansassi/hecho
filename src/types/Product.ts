export interface Product {
  codigo: string;
  nome: string;
  info: string;
  description?: string;
  quantidade: string;
  codigoBarra: string;
  categoria: string;
  categoryId?: string;
  categoryName?: string;
  imageUrl?: string | null;
  isPromotion?: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  displayName: string;
  count: number;
  description: string;
  image: string;
}