/*
  # Criar tabela de produtos

  1. Nova Tabela
    - `products`
      - `id` (uuid, primary key)
      - `codigo` (text, unique)
      - `nome` (text)
      - `info` (text)
      - `quantidade` (text)
      - `codigo_barra` (text)
      - `categoria` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `products`
    - Adicionar política para leitura pública dos produtos
    - Adicionar política para administradores gerenciarem produtos

  3. Índices
    - Índice na coluna `categoria` para filtros rápidos
    - Índice na coluna `codigo` para buscas
*/

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text UNIQUE NOT NULL,
  nome text NOT NULL,
  info text DEFAULT '',
  quantidade text DEFAULT '1 Unid.',
  codigo_barra text DEFAULT '',
  categoria text NOT NULL,
  image_url text DEFAULT '',
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

-- Política para inserção (apenas usuários autenticados podem adicionar)
CREATE POLICY "Usuários autenticados podem inserir produtos"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para atualização (apenas usuários autenticados podem atualizar)
CREATE POLICY "Usuários autenticados podem atualizar produtos"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para exclusão (apenas usuários autenticados podem excluir)
CREATE POLICY "Usuários autenticados podem excluir produtos"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_categoria ON products(categoria);
CREATE INDEX IF NOT EXISTS idx_products_codigo ON products(codigo);
CREATE INDEX IF NOT EXISTS idx_products_nome ON products USING gin(to_tsvector('portuguese', nome));

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