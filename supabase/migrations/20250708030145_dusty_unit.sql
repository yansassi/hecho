/*
  # Criar tabela de informações de contato

  1. Nova Tabela
    - `contact_info`
      - `id` (uuid, primary key)
      - `company_name` (text) - Nome da empresa
      - `address_street_pt` (text) - Endereço rua em português
      - `address_street_es` (text) - Endereço rua em espanhol
      - `address_district_pt` (text) - Bairro em português
      - `address_district_es` (text) - Bairro em espanhol
      - `address_city` (text) - Cidade
      - `address_state` (text) - Estado
      - `address_zipcode` (text) - CEP
      - `phone_primary` (text) - Telefone principal
      - `phone_secondary` (text) - Telefone secundário
      - `phone_whatsapp` (text) - WhatsApp
      - `email_contact` (text) - Email de contato
      - `email_sales` (text) - Email de vendas
      - `email_support` (text) - Email de suporte
      - `schedule_weekdays_pt` (text) - Horário dias úteis em português
      - `schedule_weekdays_es` (text) - Horário dias úteis em espanhol
      - `schedule_saturday_pt` (text) - Horário sábado em português
      - `schedule_saturday_es` (text) - Horário sábado em espanhol
      - `schedule_sunday_pt` (text) - Horário domingo em português
      - `schedule_sunday_es` (text) - Horário domingo em espanhol
      - `google_maps_url` (text) - URL do Google Maps
      - `google_maps_embed_url` (text) - URL do embed do Google Maps
      - `is_active` (boolean) - Se está ativo
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS na tabela `contact_info`
    - Adicionar política para leitura pública
    - Adicionar política para administradores gerenciarem

  3. Dados Iniciais
    - Inserir dados padrão da empresa
*/

CREATE TABLE IF NOT EXISTS contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'HECHO',
  address_street_pt text NOT NULL DEFAULT 'Rua das Ferramentas, 123',
  address_street_es text NOT NULL DEFAULT 'Calle de las Herramientas, 123',
  address_district_pt text NOT NULL DEFAULT 'Centro - São Paulo/SP',
  address_district_es text NOT NULL DEFAULT 'Centro, São Paulo/SP',
  address_city text NOT NULL DEFAULT 'São Paulo',
  address_state text NOT NULL DEFAULT 'SP',
  address_zipcode text NOT NULL DEFAULT '01234-567',
  phone_primary text NOT NULL DEFAULT '(11) 3456-7890',
  phone_secondary text NOT NULL DEFAULT '(11) 98765-4321',
  phone_whatsapp text NOT NULL DEFAULT '5511987654321',
  email_contact text NOT NULL DEFAULT 'contato@hecho.com.br',
  email_sales text NOT NULL DEFAULT 'vendas@hecho.com.br',
  email_support text NOT NULL DEFAULT 'suporte@hecho.com.br',
  schedule_weekdays_pt text NOT NULL DEFAULT 'Seg-Sex: 8h às 18h',
  schedule_weekdays_es text NOT NULL DEFAULT 'Lun-Vie: 8h a 18h',
  schedule_saturday_pt text NOT NULL DEFAULT 'Sáb: 8h às 14h',
  schedule_saturday_es text NOT NULL DEFAULT 'Sáb: 8h a 14h',
  schedule_sunday_pt text NOT NULL DEFAULT 'Domingo: Fechado',
  schedule_sunday_es text NOT NULL DEFAULT 'Dom: Cerrado',
  google_maps_url text NOT NULL DEFAULT 'https://www.google.com/maps/d/viewer?mid=14vRBlp-WKFtLojsqiPuiBG6258rtzDw&ehbc=2E312F',
  google_maps_embed_url text NOT NULL DEFAULT 'https://www.google.com/maps/d/embed?mid=14vRBlp-WKFtLojsqiPuiBG6258rtzDw&ehbc=2E312F',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública das informações de contato ativas
CREATE POLICY "Informações de contato são visíveis publicamente"
  ON contact_info
  FOR SELECT
  TO public
  USING (is_active = true);

-- Política para administradores gerenciarem informações de contato
CREATE POLICY "Administradores podem gerenciar informações de contato"
  ON contact_info
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_contact_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON contact_info
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_info_updated_at();

-- Inserir dados iniciais da empresa
INSERT INTO contact_info (
  company_name,
  address_street_pt,
  address_street_es,
  address_district_pt,
  address_district_es,
  address_city,
  address_state,
  address_zipcode,
  phone_primary,
  phone_secondary,
  phone_whatsapp,
  email_contact,
  email_sales,
  email_support,
  schedule_weekdays_pt,
  schedule_weekdays_es,
  schedule_saturday_pt,
  schedule_saturday_es,
  schedule_sunday_pt,
  schedule_sunday_es,
  google_maps_url,
  google_maps_embed_url,
  is_active
) VALUES (
  'HECHO',
  'Rua das Ferramentas, 123',
  'Calle de las Herramientas, 123',
  'Centro - São Paulo/SP',
  'Centro, São Paulo/SP',
  'São Paulo',
  'SP',
  '01234-567',
  '(11) 3456-7890',
  '(11) 98765-4321',
  '5511987654321',
  'contato@hecho.com.br',
  'vendas@hecho.com.br',
  'suporte@hecho.com.br',
  'Seg-Sex: 8h às 18h',
  'Lun-Vie: 8h a 18h',
  'Sáb: 8h às 14h',
  'Sáb: 8h a 14h',
  'Domingo: Fechado',
  'Dom: Cerrado',
  'https://www.google.com/maps/d/viewer?mid=14vRBlp-WKFtLojsqiPuiBG6258rtzDw&ehbc=2E312F',
  'https://www.google.com/maps/d/embed?mid=14vRBlp-WKFtLojsqiPuiBG6258rtzDw&ehbc=2E312F',
  true
) ON CONFLICT DO NOTHING;