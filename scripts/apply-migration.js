import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Read environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'Não configurada');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Configurada' : 'Não configurada');
  console.log('Certifique-se de que as variáveis estão definidas no arquivo .env');
  process.exit(1);
}

// Criar cliente Supabase com service role key para operações administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com Supabase...');
    console.log('URL:', supabaseUrl);
    console.log('Service Key:', supabaseServiceKey ? 'Configurada' : 'Não configurada');
    
    // Testar tabelas principais
    const tables = ['products', 'categories', 'testimonials', 'contact_info', 'hero_banners'];
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ Tabela '${table}': ${error.message}`);
        } else {
          console.log(`✅ Tabela '${table}': ${count} registros`);
        }
      } catch (err) {
        console.log(`❌ Erro ao acessar tabela '${table}':`, err.message);
      }
    }
    
    console.log('\n🎉 Teste de conexão concluído!');
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    console.log('\n📋 Passos para resolver:');
    console.log('1. Verifique se as variáveis de ambiente estão corretas no arquivo .env');
    console.log('2. Acesse o painel do Supabase em https://supabase.com/dashboard');
    console.log('3. Verifique se o projeto está ativo e as chaves estão corretas');
    console.log('4. Execute as migrações manualmente se necessário');
  }
}

testConnection();