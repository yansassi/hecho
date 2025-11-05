export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          codigo: string;
          nome: string;
          info: string;
          quantidade: string;
          codigo_barra: string;
          created_at: string;
          updated_at: string;
          name: string;
          description: string;
          price: number;
          category_id: string | null;
          image_url: string;
          stock: number;
          active: boolean;
        };
        Insert: {
          id?: string;
          codigo: string;
          nome: string;
          info?: string;
          quantidade?: string;
          codigo_barra: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          description?: string;
          price?: number;
          category_id?: string | null;
          image_url?: string;
          stock?: number;
          active?: boolean;
        };
        Update: {
          id?: string;
          codigo?: string;
          nome?: string;
          info?: string;
          quantidade?: string;
          codigo_barra?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          description?: string;
          price?: number;
          category_id?: string | null;
          image_url?: string;
          stock?: number;
          active?: boolean;
        };
      };
    };
  };
}