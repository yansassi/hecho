import React, { useState } from 'react';
import { Save, X, MapPin, Phone, Mail, Clock, Building } from 'lucide-react';
import { supabase, type ContactInfo } from '../lib/supabase';
import { useContactInfo } from '../hooks/useContactInfo';

interface ContactInfoForm {
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
}

const ContactInfoAdmin = () => {
  const { contactInfo, loading, refetch } = useContactInfo();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ContactInfoForm>({
    company_name: '',
    address_street_pt: '',
    address_street_es: '',
    address_district_pt: '',
    address_district_es: '',
    address_city: '',
    address_state: '',
    address_zipcode: '',
    phone_primary: '',
    phone_secondary: '',
    phone_whatsapp: '',
    email_contact: '',
    email_sales: '',
    email_support: '',
    schedule_weekdays_pt: '',
    schedule_weekdays_es: '',
    schedule_saturday_pt: '',
    schedule_saturday_es: '',
    schedule_sunday_pt: '',
    schedule_sunday_es: '',
    google_maps_url: '',
    google_maps_embed_url: ''
  });
  const [saving, setSaving] = useState(false);

  const startEdit = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          company_name: data.company_name,
          address_street_pt: data.address_street_pt,
          address_street_es: data.address_street_es,
          address_district_pt: data.address_district_pt,
          address_district_es: data.address_district_es,
          address_city: data.address_city,
          address_state: data.address_state,
          address_zipcode: data.address_zipcode,
          phone_primary: data.phone_primary,
          phone_secondary: data.phone_secondary,
          phone_whatsapp: data.phone_whatsapp,
          email_contact: data.email_contact,
          email_sales: data.email_sales,
          email_support: data.email_support,
          schedule_weekdays_pt: data.schedule_weekdays_pt,
          schedule_weekdays_es: data.schedule_weekdays_es,
          schedule_saturday_pt: data.schedule_saturday_pt,
          schedule_saturday_es: data.schedule_saturday_es,
          schedule_sunday_pt: data.schedule_sunday_pt,
          schedule_sunday_es: data.schedule_sunday_es,
          google_maps_url: data.google_maps_url,
          google_maps_embed_url: data.google_maps_embed_url
        });
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Erro ao carregar informações de contato:', error);
      alert('Erro ao carregar informações de contato');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('contact_info')
        .update(formData)
        .eq('is_active', true);
      
      if (error) throw error;

      await refetch();
      setIsEditing(false);
      alert('Informações atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar informações de contato:', error);
      alert('Erro ao salvar informações de contato');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      company_name: '',
      address_street_pt: '',
      address_street_es: '',
      address_district_pt: '',
      address_district_es: '',
      address_city: '',
      address_state: '',
      address_zipcode: '',
      phone_primary: '',
      phone_secondary: '',
      phone_whatsapp: '',
      email_contact: '',
      email_sales: '',
      email_support: '',
      schedule_weekdays_pt: '',
      schedule_weekdays_es: '',
      schedule_saturday_pt: '',
      schedule_saturday_es: '',
      schedule_sunday_pt: '',
      schedule_sunday_es: '',
      google_maps_url: '',
      google_maps_embed_url: ''
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Informações de Contato</h1>
        {!isEditing && (
          <button
            onClick={startEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Building className="h-4 w-4" />
            Editar Informações
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h2 className="text-xl font-semibold mb-6">Editar Informações de Contato</h2>
          
          {/* Informações da Empresa */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Informações da Empresa
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Endereço
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rua (Português)</label>
                <input
                  type="text"
                  value={formData.address_street_pt}
                  onChange={(e) => setFormData({ ...formData, address_street_pt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rua (Espanhol)</label>
                <input
                  type="text"
                  value={formData.address_street_es}
                  onChange={(e) => setFormData({ ...formData, address_street_es: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro (Português)</label>
                <input
                  type="text"
                  value={formData.address_district_pt}
                  onChange={(e) => setFormData({ ...formData, address_district_pt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro (Espanhol)</label>
                <input
                  type="text"
                  value={formData.address_district_es}
                  onChange={(e) => setFormData({ ...formData, address_district_es: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input
                  type="text"
                  value={formData.address_city}
                  onChange={(e) => setFormData({ ...formData, address_city: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <input
                  type="text"
                  value={formData.address_state}
                  onChange={(e) => setFormData({ ...formData, address_state: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <input
                  type="text"
                  value={formData.address_zipcode}
                  onChange={(e) => setFormData({ ...formData, address_zipcode: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Telefones */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Telefones
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Principal</label>
                <input
                  type="text"
                  value={formData.phone_primary}
                  onChange={(e) => setFormData({ ...formData, phone_primary: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Secundário</label>
                <input
                  type="text"
                  value={formData.phone_secondary}
                  onChange={(e) => setFormData({ ...formData, phone_secondary: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (com código do país)</label>
                <input
                  type="text"
                  value={formData.phone_whatsapp}
                  onChange={(e) => setFormData({ ...formData, phone_whatsapp: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5511987654321"
                />
              </div>
            </div>
          </div>

          {/* E-mails */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              E-mails
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de Contato</label>
                <input
                  type="email"
                  value={formData.email_contact}
                  onChange={(e) => setFormData({ ...formData, email_contact: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de Vendas</label>
                <input
                  type="email"
                  value={formData.email_sales}
                  onChange={(e) => setFormData({ ...formData, email_sales: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de Suporte</label>
                <input
                  type="email"
                  value={formData.email_support}
                  onChange={(e) => setFormData({ ...formData, email_support: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Horários */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Horários de Funcionamento
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dias Úteis (Português)</label>
                <input
                  type="text"
                  value={formData.schedule_weekdays_pt}
                  onChange={(e) => setFormData({ ...formData, schedule_weekdays_pt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dias Úteis (Espanhol)</label>
                <input
                  type="text"
                  value={formData.schedule_weekdays_es}
                  onChange={(e) => setFormData({ ...formData, schedule_weekdays_es: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sábado (Português)</label>
                <input
                  type="text"
                  value={formData.schedule_saturday_pt}
                  onChange={(e) => setFormData({ ...formData, schedule_saturday_pt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sábado (Espanhol)</label>
                <input
                  type="text"
                  value={formData.schedule_saturday_es}
                  onChange={(e) => setFormData({ ...formData, schedule_saturday_es: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domingo (Português)</label>
                <input
                  type="text"
                  value={formData.schedule_sunday_pt}
                  onChange={(e) => setFormData({ ...formData, schedule_sunday_pt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domingo (Espanhol)</label>
                <input
                  type="text"
                  value={formData.schedule_sunday_es}
                  onChange={(e) => setFormData({ ...formData, schedule_sunday_es: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Google Maps
            </h3>
            <div className="grid md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL do Google Maps</label>
                <input
                  type="url"
                  value={formData.google_maps_url}
                  onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL do Embed do Google Maps</label>
                <input
                  type="url"
                  value={formData.google_maps_embed_url}
                  onChange={(e) => setFormData({ ...formData, google_maps_embed_url: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Endereço */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Endereço
              </h3>
              <div className="space-y-2 text-gray-600">
                <p className="font-medium">{contactInfo?.companyName}</p>
                <p>{contactInfo?.addressStreet}</p>
                <p>{contactInfo?.addressDistrict}</p>
                <p>CEP: {contactInfo?.addressZipcode}</p>
              </div>
            </div>

            {/* Telefones */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-green-600" />
                Telefones
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>{contactInfo?.phonePrimary}</p>
                <p>{contactInfo?.phoneSecondary}</p>
                <p>WhatsApp: {contactInfo?.phoneWhatsapp}</p>
              </div>
            </div>

            {/* E-mails */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-red-600" />
                E-mails
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>{contactInfo?.emailContact}</p>
                <p>{contactInfo?.emailSales}</p>
                <p>{contactInfo?.emailSupport}</p>
              </div>
            </div>

            {/* Horários */}
            <div className="md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                Horários de Funcionamento
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-gray-600">
                <div>
                  <p className="font-medium">Dias Úteis</p>
                  <p>{contactInfo?.scheduleWeekdays}</p>
                </div>
                <div>
                  <p className="font-medium">Sábado</p>
                  <p>{contactInfo?.scheduleSaturday}</p>
                </div>
                <div>
                  <p className="font-medium">Domingo</p>
                  <p>{contactInfo?.scheduleSunday}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfoAdmin;