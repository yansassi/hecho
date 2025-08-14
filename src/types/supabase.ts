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
          categoria: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          codigo: string;
          nome: string;
          info?: string;
          quantidade?: string;
          codigo_barra: string;
          categoria: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          codigo?: string;
          nome?: string;
          info?: string;
          quantidade?: string;
          codigo_barra?: string;
          categoria?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}