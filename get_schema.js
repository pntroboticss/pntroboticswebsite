const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // fallback
);

async function run() {
  const { data, error } = await supabaseAdmin.from('gallery').select('*').limit(1);
  console.log("Error:", error);
  
  // To get columns, we can just insert a dummy and see error, or query information_schema (if we have direct postgres access, but we don't over REST).
  // I will just do a generic select. The error already said "category".
}
run();
