require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data: highlights, error: hError } = await supabase.from('site_highlights').select('*');
  console.log('Highlights:', highlights, hError);
  
  const { data: testimonials, error: tError } = await supabase.from('client_testimonials').select('*');
  console.log('Testimonials:', testimonials, tError);
}

test();
