/*
  # Criar tabela de produtos

  1. Nova Tabela
    - `products`
      - `id` (uuid, chave primária)
      - `codigo` (text, único, código do produto)
      - `nome` (text, nome do produto)
      - `info` (text, informações do produto)
      - `quantidade` (text, quantidade disponível)
      - `codigo_barra` (text, código de barras)
      - `categoria` (text, categoria do produto)
      - `created_at` (timestamp, data de criação)
      - `updated_at` (timestamp, data de atualização)

  2. Segurança
    - Habilitar RLS na tabela `products`
    - Adicionar políticas para operações CRUD autenticadas
    - Permitir leitura pública para exibição no site
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text UNIQUE NOT NULL,
  nome text NOT NULL,
  info text DEFAULT '',
  quantidade text DEFAULT '1 Unid.',
  codigo_barra text NOT NULL,
  categoria text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (qualquer pessoa pode ver os produtos)
CREATE POLICY "Produtos são visíveis publicamente"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Política para inserção (apenas usuários autenticados)
CREATE POLICY "Usuários autenticados podem inserir produtos"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para atualização (apenas usuários autenticados)
CREATE POLICY "Usuários autenticados podem atualizar produtos"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para exclusão (apenas usuários autenticados)
CREATE POLICY "Usuários autenticados podem excluir produtos"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados iniciais (migrar dados existentes do CSV)
INSERT INTO products (codigo, nome, info, quantidade, codigo_barra, categoria) VALUES
('Cód. B186', 'COLADOR PLÁSTICO', '7CM', '1 Unid.', '1860001007892', 'Bazar'),
('Cód. B188', 'BOMBILLA LISA INOX', 'C04 19CM', '1 Unid.', '1881701004561', 'Bazar'),
('Cód. B190', 'GOMA P/TAPA OLLA PRECION', '5, 7 Y 10L', '1 Unid.', '1905710011232', 'Bazar'),
('Cód. B193', 'ABRIDOR', '3 EM 1', '1 Unid.', '1933101001234', 'Bazar'),
('Cód. B194', 'PELADOR DE PAPAS', 'PLASTICO', '1 Unid.', '1940001004562', 'Bazar'),
('Cód. B196', 'GANCHO PLASTICO', 'GOGADOR', '3 Unid.', '1960003001239', 'Bazar'),
('Cód. B197', 'PINZAS P/ ROPA', 'MADERA', '12 Unid.', '1970010004567', 'Bazar'),
('Cód. B198', 'TENDEDERO PIOLIN NYLON', '20MT', '1 Unid.', '1981501007899', 'Bazar'),
('Cód. B199', 'GOMA DE EQUIPAGEM', '2MT', '1 Unid.', '1991501001230', 'Bazar'),
('Cód. B201', 'CORTA UÑAS', 'AÇO INOXIDÁVEL', '1 Unid.', '2010001007890', 'Bazar'),
('Cód. E160', 'FIXA ADAPTADOR TRIPLE COLORIDO', '10/20A', '1 Unid.', '1601020010780', 'Elétrica'),
('Cód. E161', 'FIXA ADAPTADOR MULTIPLE', '10A', '1 Unid.', '1611001001232', 'Elétrica'),
('Cód. E162', 'FIXA ADAPTADOR BOB ESPONJA', '10A/20A', '1 Unid.', '1621020014564', 'Elétrica'),
('Cód. E163', 'FIXA ENCHUFE MACHO', '10A', '1 Unid.', '1631001007898', 'Elétrica'),
('Cód. E164', 'FIXA ENCHUFE HEMBRA', '10A', '1 Unid.', '1641001001239', 'Elétrica'),
('Cód. F101', 'TORNILLO CHIBORARD CAB. CHATA', '4.0X16', '30 Unid.', '1014016301234', 'Ferreteria'),
('Cód. F102', 'TORNILLO CHIBORARD CAB. CHATA', '4.0X25', '20 Unid.', '1024025202347', 'Ferreteria'),
('Cód. F103', 'TORNILLO CHIBORARD CAB. CHATA', '4.0X40', '12 Unid.', '1034040123459', 'Ferreteria'),
('Cód. F104', 'TORNILLO CHIBORARD CAB. CHATA', '5.0X45', '10 Unid.', '1045045104565', 'Ferreteria'),
('Cód. F105', 'TORNILLO CHIBORARD CAB. CHATA', '6.0X50', '4 Unid.', '1056050047891', 'Ferreteria'),
('Cód. P131', 'UNIÓN SOLDABLE', '20MM', '1 Unid.', '1312001000125', 'Plomeria'),
('Cód. P132', 'UNIÓN SOLDABLE', '25MM', '1 Unid.', '1322501000457', 'Plomeria'),
('Cód. P133', 'UNIÓN CODO SOLDABLE', '90° 20MM', '1 Unid.', '1339020017897', 'Plomeria'),
('Cód. P134', 'UNIÓN CODO SOLDABLE', '90° 25MM', '1 Unid.', '1349025011233', 'Plomeria'),
('Cód. P135', 'UNIÓN "T" SOLDABLE', '20MM', '1 Unid.', '1352001004563', 'Plomeria')
ON CONFLICT (codigo) DO NOTHING;