import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Eye, EyeOff } from 'lucide-react';
import { supabase, type HeroBanner } from '../lib/supabase';
import { useHeroBanners } from '../hooks/useHeroBanners';

interface HeroBannerForm {
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
  display_order: number;
  is_active: boolean;
}

const HeroBannersAdmin = () => {
  const { banners, loading, refetch } = useHeroBanners();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<HeroBannerForm>({
    title_pt: '',
    title_es: '',
    subtitle_pt: '',
    subtitle_es: '',
    highlight_pt: '',
    highlight_es: '',
    cta_text_pt: '',
    cta_text_es: '',
    cta_action: 'catalog',
    image_url: '',
    mobile_image_url: '',
    display_order: 0,
    is_active: true
  });
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setFormData({
      title_pt: '',
      title_es: '',
      subtitle_pt: '',
      subtitle_es: '',
      highlight_pt: '',
      highlight_es: '',
      cta_text_pt: '',
      cta_text_es: '',
      cta_action: 'catalog',
      image_url: '',
      mobile_image_url: '',
      display_order: 0,
      is_active: true
    });
    setIsEditing(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (isAdding) {
        const { error } = await supabase
          .from('hero_banners')
          .insert([formData]);
        
        if (error) throw error;
      } else if (isEditing) {
        const { error } = await supabase
          .from('hero_banners')
          .update(formData)
          .eq('id', isEditing);
        
        if (error) throw error;
      }

      await refetch();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar banner:', error);
      alert('Erro ao salvar banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return;

    try {
      const { error } = await supabase
        .from('hero_banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await refetch();
    } catch (error) {
      console.error('Erro ao excluir banner:', error);
      alert('Erro ao excluir banner');
    }
  };

  const startEdit = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        title_pt: data.title_pt,
        title_es: data.title_es,
        subtitle_pt: data.subtitle_pt,
        subtitle_es: data.subtitle_es,
        highlight_pt: data.highlight_pt,
        highlight_es: data.highlight_es,
        cta_text_pt: data.cta_text_pt,
        cta_text_es: data.cta_text_es,
        cta_action: data.cta_action,
        image_url: data.image_url,
        mobile_image_url: data.mobile_image_url || '',
        display_order: data.display_order,
        is_active: data.is_active
      });
      setIsEditing(id);
    } catch (error) {
      console.error('Erro ao carregar banner:', error);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_banners')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await refetch();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status do banner');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Banners do Hero</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Banner
        </button>
      </div>

      {(isAdding || isEditing) && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border">
          <h2 className="text-xl font-semibold mb-4">
            {isAdding ? 'Adicionar Novo Banner' : 'Editar Banner'}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Coluna Esquerda - Textos em Português */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Português</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={formData.title_pt}
                  onChange={(e) => setFormData({ ...formData, title_pt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Soluções rápidas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto Destacado</label>
                <input
                  type="text"
                  value={formData.highlight_pt}
                  onChange={(e) => setFormData({ ...formData, highlight_pt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: para sua obra"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                <textarea
                  value={formData.subtitle_pt}
                  onChange={(e) => setFormData({ ...formData, subtitle_pt: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descrição do banner em português..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto do Botão</label>
                <input
                  type="text"
                  value={formData.cta_text_pt}
                  onChange={(e) => setFormData({ ...formData, cta_text_pt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Ver Catálogo"
                />
              </div>
            </div>

            {/* Coluna Direita - Textos em Espanhol */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Español</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={formData.title_es}
                  onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Soluciones rápidas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto Destacado</label>
                <input
                  type="text"
                  value={formData.highlight_es}
                  onChange={(e) => setFormData({ ...formData, highlight_es: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: para tu obra"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                <textarea
                  value={formData.subtitle_es}
                  onChange={(e) => setFormData({ ...formData, subtitle_es: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción del banner en español..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto do Botão</label>
                <input
                  type="text"
                  value={formData.cta_text_es}
                  onChange={(e) => setFormData({ ...formData, cta_text_es: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Ver Catálogo"
                />
              </div>
            </div>
          </div>

          {/* Configurações Gerais */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem (Desktop)</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img 
                    src={formData.image_url} 
                    alt="Preview Desktop" 
                    className="w-full h-20 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem (Mobile)</label>
              <input
                type="url"
                value={formData.mobile_image_url}
                onChange={(e) => setFormData({ ...formData, mobile_image_url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://... (opcional - usa desktop se vazio)"
              />
              {formData.mobile_image_url && (
                <div className="mt-2">
                  <img 
                    src={formData.mobile_image_url} 
                    alt="Preview Mobile" 
                    className="w-full h-20 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ação do Botão</label>
              <select
                value={formData.cta_action}
                onChange={(e) => setFormData({ ...formData, cta_action: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="catalog">Catálogo</option>
                <option value="about">Sobre</option>
                <option value="home">Início</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordem de Exibição</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Banner Ativo</span>
            </label>
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
              onClick={resetForm}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conteúdo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                      <div className="text-sm text-gray-500">Ordem: {banner.displayOrder}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {banner.subtitle}
                    </div>
                    <div className="text-xs text-gray-500">
                      Ação: {banner.ctaAction} | CTA: {banner.ctaText}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <div className="text-center">
                        <img 
                          src={banner.image} 
                          alt={`${banner.title} - Desktop`}
                          className="h-12 w-16 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <span className="text-xs text-gray-500">Desktop</span>
                      </div>
                      {banner.mobileImage && banner.mobileImage !== banner.image && (
                        <div className="text-center">
                          <img 
                            src={banner.mobileImage} 
                            alt={`${banner.title} - Mobile`}
                            className="h-12 w-16 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <span className="text-xs text-gray-500">Mobile</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(banner.id, true)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {true ? (
                        <><Eye className="h-3 w-3 mr-1" /> Ativo</>
                      ) : (
                        <><EyeOff className="h-3 w-3 mr-1" /> Inativo</>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(banner.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HeroBannersAdmin;