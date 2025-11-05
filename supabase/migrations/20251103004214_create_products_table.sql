/*
  # Criar tabela de produtos

  1. Nova Tabela
    - `products`
      - `id` (uuid, primary key, gerado automaticamente)
      - `codigo` (text, código do produto, ex: "Cód. F101")
      - `nome` (text, nome do produto)
      - `info` (text, informações adicionais do produto)
      - `quantidade` (text, quantidade padrão, ex: "1 Unid.")
      - `codigo_barra` (text, código de barras)
      - `categoria` (text, categoria do produto: Ferreteria, Plomeria, Elétrica, Bazar)
      - `image_url` (text, URL da imagem do produto, opcional)
      - `created_at` (timestamptz, data de criação)
      - `updated_at` (timestamptz, data de atualização)

  2. Segurança
    - Habilitar RLS na tabela `products`
    - Adicionar políticas para:
      - Permitir leitura pública (SELECT)
      - Apenas administradores podem inserir (INSERT)
      - Apenas administradores podem atualizar (UPDATE)
      - Apenas administradores podem deletar (DELETE)

  3. Índices
    - Índice na coluna `categoria` para filtros rápidos
    - Índice na coluna `codigo` para buscas
    - Índice na coluna `codigo_barra` para buscas por código de barras

  4. Notas Importantes
    - A tabela permite acesso público para leitura
    - Operações de escrita requerem autenticação (futura implementação de admin)
    - Valores padrão definidos para facilitar inserção
*/

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  nome text NOT NULL,
  info text DEFAULT '',
  quantidade text DEFAULT '1 Unid.',
  codigo_barra text NOT NULL,
  categoria text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política: Permitir leitura pública
CREATE POLICY "Permitir leitura pública de produtos"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Política: Permitir inserção para usuários autenticados (admin)
CREATE POLICY "Permitir inserção para autenticados"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política: Permitir atualização para usuários autenticados (admin)
CREATE POLICY "Permitir atualização para autenticados"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Permitir exclusão para usuários autenticados (admin)
CREATE POLICY "Permitir exclusão para autenticados"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_categoria ON products(categoria);
CREATE INDEX IF NOT EXISTS idx_products_codigo ON products(codigo);
CREATE INDEX IF NOT EXISTS idx_products_codigo_barra ON products(codigo_barra);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();