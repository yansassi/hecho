/*
  # Criar tabela de banners do Hero

  1. Nova Tabela
    - `hero_banners`
      - `id` (uuid, primary key)
      - `title_pt` (text) - Título em português
      - `title_es` (text) - Título em espanhol
      - `subtitle_pt` (text) - Subtítulo em português
      - `subtitle_es` (text) - Subtítulo em espanhol
      - `highlight_pt` (text) - Texto destacado em português
      - `highlight_es` (text) - Texto destacado em espanhol
      - `cta_text_pt` (text) - Texto do botão em português
      - `cta_text_es` (text) - Texto do botão em espanhol
      - `cta_action` (text) - Ação do botão (catalog, about, etc.)
      - `image_url` (text) - URL da imagem do banner
      - `is_active` (boolean) - Se o banner está ativo
      - `display_order` (integer) - Ordem de exibição
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `hero_banners`
    - Política para leitura pública de banners ativos
    - Política para administradores gerenciarem banners

  3. Dados Iniciais
    - Inserir os banners atuais como dados iniciais
*/

CREATE TABLE IF NOT EXISTS hero_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_pt text NOT NULL,
  title_es text NOT NULL,
  subtitle_pt text NOT NULL,
  subtitle_es text NOT NULL,
  highlight_pt text NOT NULL DEFAULT '',
  highlight_es text NOT NULL DEFAULT '',
  cta_text_pt text NOT NULL,
  cta_text_es text NOT NULL,
  cta_action text NOT NULL DEFAULT 'catalog',
  image_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública de banners ativos
CREATE POLICY "Banners do Hero são visíveis publicamente"
  ON hero_banners
  FOR SELECT
  TO public
  USING (is_active = true);

-- Política para administradores gerenciarem banners
CREATE POLICY "Administradores podem gerenciar banners do Hero"
  ON hero_banners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_hero_banners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_hero_banners_updated_at
  BEFORE UPDATE ON hero_banners
  FOR EACH ROW
  EXECUTE FUNCTION update_hero_banners_updated_at();

-- Inserir dados iniciais dos banners atuais
INSERT INTO hero_banners (
  title_pt, 
  title_es, 
  subtitle_pt, 
  subtitle_es, 
  highlight_pt, 
  highlight_es, 
  cta_text_pt, 
  cta_text_es, 
  cta_action, 
  image_url, 
  display_order
) VALUES
(
  'Soluções rápidas',
  'Soluciones rápidas',
  'Ferragens, materiais elétricos, encanamento e muito mais. Qualidade e agilidade em um só lugar.',
  'Ferretería, materiales eléctricos, plomería y mucho más. Calidad y agilidad en un solo lugar.',
  'para sua obra',
  'para tu obra',
  'Ver Catálogo',
  'Ver Catálogo',
  'catalog',
  'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=1200',
  1
),
(
  'Ferramentas Profissionais',
  'Herramientas Profesionales',
  'As melhores marcas em ferramentas manuais e elétricas para profissionais e entusiastas.',
  'Las mejores marcas en herramientas manuales y eléctricas para profesionales y entusiastas.',
  'de qualidade',
  'de calidad',
  'Ver Ferramentas',
  'Ver Herramientas',
  'catalog',
  'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=1200',
  2
),
(
  'Materiais Hidráulicos',
  'Materiales Hidráulicos',
  'Tubos, conexões, registros e tudo para suas instalações hidráulicas.',
  'Tubos, conexiones, registros y todo para tus instalaciones hidráulicas.',
  'completos',
  'completos',
  'Ver Produtos',
  'Ver Productos',
  'catalog',
  'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=1200',
  3
),
(
  'Materiais Elétricos',
  'Materiales Eléctricos',
  'Cabos, tomadas, disjuntores e componentes elétricos de alta qualidade.',
  'Cables, tomacorrientes, disyuntores y componentes eléctricos de alta calidad.',
  'seguros',
  'seguros',
  'Ver Catálogo',
  'Ver Catálogo',
  'catalog',
  'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1200',
  4
),
(
  'Bazar e Casa',
  'Bazar y Casa',
  'Utensílios domésticos, produtos de limpeza e itens para o dia a dia.',
  'Utensilios domésticos, productos de limpieza y artículos para el día a día.',
  'práticos',
  'prácticos',
  'Explorar Bazar',
  'Explorar Bazar',
  'catalog',
  'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=1200',
  5
);