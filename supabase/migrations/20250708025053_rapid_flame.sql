/*
  # Criar tabela de categorias

  1. Nova Tabela
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, nome interno da categoria)
      - `title_pt` (text, título em português)
      - `title_es` (text, título em espanhol)
      - `description_pt` (text, descrição em português)
      - `description_es` (text, descrição em espanhol)
      - `image_url` (text, URL da imagem)
      - `icon_name` (text, nome do ícone Lucide)
      - `items_pt` (jsonb, lista de itens em português)
      - `items_es` (jsonb, lista de itens em espanhol)
      - `display_order` (integer, ordem de exibição)
      - `is_active` (boolean, se está ativo)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `categories`
    - Política para leitura pública de categorias ativas
    - Política para administradores gerenciarem categorias
*/

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  title_pt text NOT NULL,
  title_es text NOT NULL,
  description_pt text NOT NULL,
  description_es text NOT NULL,
  image_url text NOT NULL DEFAULT '',
  icon_name text NOT NULL DEFAULT 'Package',
  items_pt jsonb NOT NULL DEFAULT '[]',
  items_es jsonb NOT NULL DEFAULT '[]',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "Permitir leitura pública de categorias ativas" ON categories;
DROP POLICY IF EXISTS "Administradores podem gerenciar categorias" ON categories;

-- Política para leitura pública de categorias ativas
CREATE POLICY "Permitir leitura pública de categorias ativas"
  ON categories
  FOR SELECT
  TO public
  USING (is_active = true);

-- Política para administradores (usuários autenticados) gerenciarem todas as categorias
CREATE POLICY "Administradores podem gerenciar categorias"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Remover trigger existente se existir
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados iniciais apenas se a tabela estiver vazia
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM categories LIMIT 1) THEN
    INSERT INTO categories (
      name, 
      title_pt, 
      title_es, 
      description_pt, 
      description_es, 
      image_url, 
      icon_name, 
      items_pt, 
      items_es, 
      display_order
    ) VALUES
    (
      'ferragens',
      'Ferragens',
      'Ferretería',
      'Ferramentas, parafusos, pregos, dobradiças e todos os acessórios para sua obra.',
      'Herramientas, tornillos, clavos, bisagras y todos los accesorios para tu obra.',
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Wrench',
      '["Ferramentas manuais", "Parafusos e fixadores", "Fechaduras e dobradiças", "Materiais de soldagem"]',
      '["Herramientas manuales", "Tornillos y fijadores", "Cerraduras y bisagras", "Materiales de soldadura"]',
      1
    ),
    (
      'encanamento',
      'Encanamento',
      'Plomería',
      'Tubos, conexões, registros e tudo para instalações hidráulicas.',
      'Tubos, conexiones, registros y todo para instalaciones hidráulicas.',
      'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Droplet',
      '["Tubos PVC e PPR", "Conexões e registros", "Torneiras e chuveiros", "Bombas e reservatórios"]',
      '["Tubos PVC y PPR", "Conexiones y registros", "Grifos y duchas", "Bombas y reservatorios"]',
      2
    ),
    (
      'eletrica',
      'Elétrica',
      'Eléctrica',
      'Fios, cabos, disjuntores, tomadas e materiais elétricos em geral.',
      'Cables, disyuntores, tomacorrientes y materiales eléctricos en general.',
      'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Zap',
      '["Fios e cabos elétricos", "Disjuntores e quadros", "Tomadas e interruptores", "Lâmpadas LED"]',
      '["Cables eléctricos", "Disyuntores y cuadros", "Tomacorrientes e interruptores", "Lámparas LED"]',
      3
    ),
    (
      'bazar',
      'Bazar',
      'Bazar',
      'Utensílios domésticos, produtos de limpeza e itens para o dia a dia.',
      'Utensilios domésticos, productos de limpieza y artículos para el día a día.',
      'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Package',
      '["Utensílios de cozinha", "Produtos de limpeza", "Organização doméstica", "Jardinagem"]',
      '["Utensilios de cocina", "Productos de limpieza", "Organización doméstica", "Jardinería"]',
      4
    );
  END IF;
END $$;