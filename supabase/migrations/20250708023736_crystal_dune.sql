/*
  # Criar tabela de depoimentos

  1. Nova Tabela
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text) - Nome do cliente
      - `role` (text) - Profissão/cargo do cliente
      - `content_pt` (text) - Conteúdo do depoimento em português
      - `content_es` (text) - Conteúdo do depoimento em espanhol
      - `rating` (integer) - Avaliação de 1 a 5 estrelas
      - `is_active` (boolean) - Se o depoimento está ativo
      - `display_order` (integer) - Ordem de exibição
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `testimonials`
    - Adicionar política para leitura pública de depoimentos ativos
    - Adicionar política para administradores gerenciarem depoimentos
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  content_pt text NOT NULL,
  content_es text NOT NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública de depoimentos ativos
CREATE POLICY "Permitir leitura pública de depoimentos ativos"
  ON testimonials
  FOR SELECT
  TO public
  USING (is_active = true);

-- Política para administradores (usuários autenticados) gerenciarem todos os depoimentos
CREATE POLICY "Administradores podem gerenciar depoimentos"
  ON testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados iniciais
INSERT INTO testimonials (name, role, content_pt, content_es, rating, display_order) VALUES
(
  'João Silva',
  'Engenheiro Civil',
  'A HECHO é minha fornecedora há mais de 10 anos. Qualidade excepcional e atendimento sempre atencioso. Recomendo para todos os profissionais da área.',
  'HECHO es mi proveedor desde hace más de 10 años. Calidad excepcional y atención siempre atenta. Recomiendo a todos los profesionales del área.',
  5,
  1
),
(
  'Maria Santos',
  'Arquiteta',
  'Encontro tudo que preciso em um só lugar. A variedade de produtos e a expertise da equipe fazem toda a diferença nos meus projetos.',
  'Encuentro todo lo que necesito en un solo lugar. La variedad de productos y la experiencia del equipo hacen toda la diferencia en mis proyectos.',
  5,
  2
),
(
  'Carlos Oliveira',
  'Proprietário de Casa',
  'Excelente atendimento e produtos de qualidade. Sempre que preciso de algo para casa, sei que posso contar com a HECHO.',
  'Excelente atención y productos de calidad. Siempre que necesito algo para casa, sé que puedo contar con HECHO.',
  5,
  3
),
(
  'Ana Rodriguez',
  'Construtora',
  'Parceria sólida há anos. A HECHO sempre tem os materiais que preciso com a qualidade que meus clientes merecem.',
  'Sociedad sólida desde hace años. HECHO siempre tiene los materiales que necesito con la calidad que mis clientes merecen.',
  5,
  4
),
(
  'Pedro Fernandez',
  'Eletricista',
  'Materiais elétricos de primeira qualidade. A equipe conhece bem os produtos e sempre me orienta na melhor escolha.',
  'Materiales eléctricos de primera calidad. El equipo conoce bien los productos y siempre me orienta en la mejor elección.',
  5,
  5
),
(
  'Lucia Mendoza',
  'Designer de Interiores',
  'Além da qualidade dos produtos, o que mais me impressiona é a variedade. Sempre encontro soluções criativas para meus projetos.',
  'Además de la calidad de los productos, lo que más me impresiona es la variedad. Siempre encuentro soluciones creativas para mis proyectos.',
  5,
  6
);