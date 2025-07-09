import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'Não configurada');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Configurada' : 'Não configurada');
  throw new Error('Variáveis de ambiente do Supabase não configuradas. Verifique o arquivo .env');
}

// Configurações do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Logs para debug
console.log('🔗 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Anon Key:', supabaseAnonKey ? 'Configurada' : 'Não configurada');
console.log('✅ Cliente Supabase inicializado:', !!supabase);

// Testar conexão
supabase.from('products').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error.message);
    } else {
      console.log('✅ Conexão com Supabase estabelecida. Produtos encontrados:', count);
    }
  })
  .catch((error) => {
    console.error('❌ Falha ao testar conexão:', error);
  });

// Tipos para TypeScript
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content_pt: string;
  content_es: string;
  rating: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string;
  category: string;
  description: string;
  website_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
export interface Category {
  id: string;
  name: string;
  title_pt: string;
  title_es: string;
  description_pt: string;
  description_es: string;
  image_url: string;
  icon_name: string;
  items_pt: string[];
  items_es: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  company_name: string;
  address_street_pt: string;
  address_street_es: string;
  address_district_pt: string;
  address_district_es: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  phone_primary: string;
  phone_secondary: string;
  phone_whatsapp: string;
  email_contact: string;
  email_sales: string;
  email_support: string;
  schedule_weekdays_pt: string;
  schedule_weekdays_es: string;
  schedule_saturday_pt: string;
  schedule_saturday_es: string;
  schedule_sunday_pt: string;
  schedule_sunday_es: string;
  google_maps_url: string;
  google_maps_embed_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroBanner {
  id: string;
  title_pt: string;
  title_es: string;
  subtitle_pt: string;
  subtitle_es: string;
  highlight_pt: string;
  highlight_es: string;
  cta_text_pt: string;
  cta_text_es: string;
  cta_action: string;
  image_url: string;
  mobile_image_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  codigo: string;
  nome: string;
  info: string;
  quantidade: string;
  codigo_barra: string;
  categoria: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}