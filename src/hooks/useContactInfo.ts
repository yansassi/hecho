import { useState, useEffect } from 'react';
import { supabase, type ContactInfo } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

export interface ContactInfoDisplay {
  id: string;
  companyName: string;
  addressStreet: string;
  addressDistrict: string;
  addressCity: string;
  addressState: string;
  addressZipcode: string;
  phonePrimary: string;
  phoneSecondary: string;
  phoneWhatsapp: string;
  emailContact: string;
  emailSales: string;
  emailSupport: string;
  scheduleWeekdays: string;
  scheduleSaturday: string;
  scheduleSunday: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
}

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfoDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando informações de contato do Supabase...');

      const { data, error: supabaseError } = await supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true)
        .single();

      console.log('📊 Resposta do Supabase (contact_info):', { 
        data: data ? 'Informações encontradas' : 'Nenhuma informação', 
        error: supabaseError 
      });

      if (supabaseError) {
        throw supabaseError;
      }

      if (data) {
        // Transformar dados para o formato de exibição baseado no idioma
        const transformedData: ContactInfoDisplay = {
          id: data.id,
          companyName: data.company_name,
          addressStreet: language === 'pt' ? data.address_street_pt : data.address_street_es,
          addressDistrict: language === 'pt' ? data.address_district_pt : data.address_district_es,
          addressCity: data.address_city,
          addressState: data.address_state,
          addressZipcode: data.address_zipcode,
          phonePrimary: data.phone_primary,
          phoneSecondary: data.phone_secondary,
          phoneWhatsapp: data.phone_whatsapp,
          emailContact: data.email_contact,
          emailSales: data.email_sales,
          emailSupport: data.email_support,
          scheduleWeekdays: language === 'pt' ? data.schedule_weekdays_pt : data.schedule_weekdays_es,
          scheduleSaturday: language === 'pt' ? data.schedule_saturday_pt : data.schedule_saturday_es,
          scheduleSunday: language === 'pt' ? data.schedule_sunday_pt : data.schedule_sunday_es,
          googleMapsUrl: data.google_maps_url,
          googleMapsEmbedUrl: data.google_maps_embed_url
        };

        console.log('✅ Informações de contato transformadas');
        setContactInfo(transformedData);
      }
    } catch (err) {
      console.error('❌ Erro ao buscar informações de contato:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      
      // Fallback para dados estáticos em caso de erro
      console.log('🔄 Usando dados de fallback para informações de contato...');
      const fallbackContactInfo: ContactInfoDisplay = {
        id: 'fallback-1',
        companyName: 'HECHO',
        addressStreet: language === 'pt' ? 'Rua das Ferramentas, 123' : 'Calle de las Herramientas, 123',
        addressDistrict: language === 'pt' ? 'Centro - São Paulo/SP' : 'Centro, São Paulo/SP',
        addressCity: 'São Paulo',
        addressState: 'SP',
        addressZipcode: '01234-567',
        phonePrimary: '(11) 3456-7890',
        phoneSecondary: '(11) 98765-4321',
        phoneWhatsapp: '5511987654321',
        emailContact: 'contato@hecho.com.br',
        emailSales: 'vendas@hecho.com.br',
        emailSupport: 'suporte@hecho.com.br',
        scheduleWeekdays: language === 'pt' ? 'Seg-Sex: 8h às 18h' : 'Lun-Vie: 8h a 18h',
        scheduleSaturday: language === 'pt' ? 'Sáb: 8h às 14h' : 'Sáb: 8h a 14h',
        scheduleSunday: language === 'pt' ? 'Domingo: Fechado' : 'Dom: Cerrado',
        googleMapsUrl: 'https://www.google.com/maps/d/viewer?mid=14vRBlp-WKFtLojsqiPuiBG6258rtzDw&ehbc=2E312F',
        googleMapsEmbedUrl: 'https://www.google.com/maps/d/embed?mid=14vRBlp-WKFtLojsqiPuiBG6258rtzDw&ehbc=2E312F'
      };
      
      setContactInfo(fallbackContactInfo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, [language]);

  // Configurar real-time subscription para atualizações automáticas
  useEffect(() => {
    const channel = supabase
      .channel('contact-info-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_info'
        },
        () => {
          // Recarregar informações quando houver mudanças
          fetchContactInfo();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [language]);

  return {
    contactInfo,
    loading,
    error,
    refetch: fetchContactInfo
  };
};