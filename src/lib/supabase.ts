import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fxnzgvpeyadupjcaupvg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4bnpndnBleWFkdXBqY2F1cHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5Mzg3OTksImV4cCI6MjA2NzUxNDc5OX0.CK6TtIjGYr3we2-NDDIiDbRbSTeAYHlTZmUmD-qmpwk';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log para debug
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase conectado:', !!supabase);

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