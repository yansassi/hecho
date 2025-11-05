/*
  # Add missing product categories
  
  1. Changes
    - Insert missing categories (Bazar, Elétrica) to categories table
    - These categories exist in products but were not in the categories table
*/

INSERT INTO categories (name, description) 
VALUES 
  ('Bazar', 'Utensilios domésticos, productos de limpieza y artículos para el día a día'),
  ('Elétrica', 'Materiales eléctricos, cables, tomacorrientes y componentes electrónicos')
ON CONFLICT (name) DO NOTHING;
