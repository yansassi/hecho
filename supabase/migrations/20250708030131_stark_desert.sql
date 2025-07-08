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