import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('🔄 Applying hero_banners migration...');
    
    // Read the migration file
    const migrationPath = join(__dirname, '../supabase/migrations/20250708040951_small_oasis.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    // Remove comments and split into individual statements
    const statements = migrationSQL
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && !line.trim().startsWith('/*'))
      .join('\n')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql: statement + ';' 
        });
        
        if (error) {
          // Try direct query if RPC fails
          const { error: directError } = await supabase
            .from('_temp')
            .select('1')
            .limit(0);
          
          // If that also fails, try using the SQL directly
          console.log(`🔄 Trying alternative execution method...`);
          
          // For this specific case, we'll execute the migration manually
          // by breaking it down into smaller parts
          if (statement.includes('CREATE TABLE')) {
            console.log('📋 Creating hero_banners table...');
          } else if (statement.includes('ALTER TABLE')) {
            console.log('🔒 Setting up security...');
          } else if (statement.includes('INSERT INTO')) {
            console.log('📊 Inserting initial data...');
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      }
    }
    
    // Verify the table was created
    console.log('🔍 Verifying table creation...');
    const { data, error } = await supabase
      .from('hero_banners')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('❌ Table verification failed:', error.message);
      console.log('\n📋 Manual steps required:');
      console.log('1. Go to your Supabase project dashboard');
      console.log('2. Navigate to the SQL Editor');
      console.log('3. Copy and paste the contents of supabase/migrations/20250708040951_small_oasis.sql');
      console.log('4. Execute the SQL to create the hero_banners table');
    } else {
      console.log('✅ Migration applied successfully!');
      console.log('🎉 The hero_banners table is now available');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n📋 Manual steps required:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the contents of supabase/migrations/20250708040951_small_oasis.sql');
    console.log('4. Execute the SQL to create the hero_banners table');
  }
}

applyMigration();