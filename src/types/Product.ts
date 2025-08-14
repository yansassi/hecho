export interface Product {
  codigo: string;
  nome: string;
  info: string;
  quantidade: string;
  codigoBarra: string;
  categoria: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  displayName: string;
  count: number;
  description: string;
  image: string;
}