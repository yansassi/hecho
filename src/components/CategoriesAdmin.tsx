import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Eye, EyeOff } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { supabase, type Category } from '../lib/supabase';
import { useCategories } from '../hooks/useCategories';

interface CategoryForm {
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
}

const CategoriesAdmin = () => {
  const { categories, loading, refetch } = useCategories();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    title_pt: '',
    title_es: '',
    description_pt: '',
    description_es: '',
    image_url: '',
    icon_name: 'Package',
    items_pt: ['', '', '', ''],
    items_es: ['', '', '', ''],
    display_order: 0,
    is_active: true
  });
  const [saving, setSaving] = useState(false);

  // Lista de ícones disponíveis
  const availableIcons = [
    'Package', 'Wrench', 'Droplet', 'Zap', 'Hammer', 'Screwdriver', 
    'Drill', 'Paintbrush', 'Home', 'Building', 'Tool', 'Settings'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      title_pt: '',
      title_es: '',
      description_pt: '',
      description_es: '',
      image_url: '',
      icon_name: 'Package',
      items_pt: ['', '', '', ''],
      items_es: ['', '', '', ''],
      display_order: 0,
      is_active: true
    });
    setIsEditing(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Filtrar itens vazios
      const filteredItemsPt = formData.items_pt.filter(item => item.trim() !== '');
      const filteredItemsEs = formData.items_es.filter(item => item.trim() !== '');
      
      const dataToSave = {
        ...formData,
        items_pt: filteredItemsPt,
        items_es: filteredItemsEs
      };
      
      if (isAdding) {
        const { error } = await supabase
          .from('categories')
          .insert([dataToSave]);
        
        if (error) throw error;
      } else if (isEditing) {
        const { error } = await supabase
          .from('categories')
          .update(dataToSave)
          .eq('id', isEditing);
        
        if (error) throw error;
      }

      await refetch();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await refetch();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria');
    }
  };

  const startEdit = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Garantir que items_pt e items_es tenham pelo menos 4 elementos
      const itemsPt = [...data.items_pt];
      const itemsEs = [...data.items_es];
      while (itemsPt.length < 4) itemsPt.push('');
      while (itemsEs.length < 4) itemsEs.push('');

      setFormData({
        name: data.name,
        title_pt: data.title_pt,
        title_es: data.title_es,
        description_pt: data.description_pt,
        description_es: data.description_es,
        image_url: data.image_url,
        icon_name: data.icon_name,
        items_pt: itemsPt,
        items_es: itemsEs,
        display_order: data.display_order,
        is_active: data.is_active
      });
      setIsEditing(id);
    } catch (error) {
      console.error('Erro ao carregar categoria:', error);
    }
  };

  const updateItem = (language: 'pt' | 'es', index: number, value: string) => {
    const key = language === 'pt' ? 'items_pt' : 'items_es';
    const newItems = [...formData[key]];
    newItems[index] = value;
    setFormData({ ...formData, [key]: newItems });
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Package;
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
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Categorias</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Categoria
        </button>
      </div>

      {(isAdding || isEditing) && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border">
          <h2 className="text-xl font-semibold mb-4">
            {isAdding ? 'Adicionar Nova Categoria' : 'Editar Categoria'}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Coluna Esquerda - Informações Básicas */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Interno</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: ferragens"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título (Português)</label>
                <input
                  type="text"
                  value={formData.title_pt}
                  onChange={(e) => setFormData({ ...formData, title_pt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Ferragens"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título (Espanhol)</label>
                <input
                  type="text"
                  value={formData.title_es}
                  onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Ferretería"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
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
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ícone</label>
                <select
                  value={formData.icon_name}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableIcons.map((iconName) => (
                    <option key={iconName} value={iconName}>
                      {iconName}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Preview:</span>
                  {React.createElement(getIconComponent(formData.icon_name), { 
                    className: "h-6 w-6 text-blue-600" 
                  })}
                </div>
              </div>
            </div>

            {/* Coluna Direita - Descrições e Configurações */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (Português)</label>
                <textarea
                  value={formData.description_pt}
                  onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descrição da categoria em português..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (Espanhol)</label>
                <textarea
                  value={formData.description_es}
                  onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción de la categoría en español..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="flex items-center justify-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Ativo</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Itens da Categoria */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Itens (Português)</label>
              <div className="space-y-2">
                {formData.items_pt.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => updateItem('pt', index, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Item ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Itens (Espanhol)</label>
              <div className="space-y-2">
                {formData.items_es.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => updateItem('es', index, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Ítem ${index + 1}`}
                  />
                ))}
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
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
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
              {categories.map((category) => {
                const IconComponent = getIconComponent(category.iconName);
                return (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{category.title}</div>
                          <div className="text-sm text-gray-500">{category.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={category.image} 
                        alt={category.title}
                        className="h-12 w-12 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Ativo
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(category.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoriesAdmin;