/*
  # Create brands table

  1. New Tables
    - `brands`
      - `id` (uuid, primary key)
      - `name` (text, brand name)
      - `logo_url` (text, URL for brand logo)
      - `category` (text, brand category/specialty)
      - `description` (text, brand description)
      - `website_url` (text, optional brand website)
      - `is_active` (boolean, whether brand is active)
      - `display_order` (integer, for ordering brands)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `brands` table
    - Add policy for public read access
    - Add policies for authenticated users to manage brands

  3. Sample Data
    - Insert initial brand data
*/

CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text DEFAULT '',
  category text NOT NULL,
  description text DEFAULT '',
  website_url text DEFAULT '',
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Public read access for brands
CREATE POLICY "Brands are publicly visible"
  ON brands
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Authenticated users can insert brands
CREATE POLICY "Authenticated users can insert brands"
  ON brands
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update brands
CREATE POLICY "Authenticated users can update brands"
  ON brands
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete brands
CREATE POLICY "Authenticated users can delete brands"
  ON brands
  FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_brands_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_brands_updated_at();

-- Insert sample brand data
INSERT INTO brands (name, logo_url, category, description, display_order) VALUES
  ('Tigre', 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop', 'Tubos e Conexões', 'Líder em soluções para sistemas hidráulicos', 1),
  ('Tramontina', 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop', 'Ferramentas', 'Ferramentas e utensílios de alta qualidade', 2),
  ('Siemens', 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop', 'Materiais Elétricos', 'Tecnologia alemã em materiais elétricos', 3),
  ('Viqua', 'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop', 'Hidráulica', 'Soluções completas para hidráulica', 4),
  ('Famastil', 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop', 'Jardinagem', 'Produtos para jardinagem e paisagismo', 5),
  ('Master', 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop', 'Discos de Corte', 'Discos e ferramentas de corte profissionais', 6);