import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mfzafryvlfseuexdnfcs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1memFmcnl2bGZzZXVleGRuZmNzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTgyMjIwMywiZXhwIjoyMDY1Mzk4MjAzfQ.edmqNCAWZVRix-q1V3UjG9hYCOBwVriTNBpqX0aD1YQ'
);

console.log('🔍 Checking database schema...\n');

// Check what tables exist
const { data: tables } = await supabase.rpc('exec', {
  sql: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
}).then(() => null).catch(() => null);

// Check users/employees tables
console.log('📋 Checking related tables:');

const checkTable = async (tableName) => {
  const { data, error } = await supabase.from(tableName).select('id').limit(1);
  if (error) {
    console.log(`❌ ${tableName}: ${error.message}`);
  } else {
    console.log(`✅ ${tableName}: exists`);
    if (data.length > 0) {
      console.log(`   Sample ID: ${data[0].id}`);
    }
  }
};

await checkTable('users');
await checkTable('employees');
await checkTable('user_profiles');
await checkTable('companies');

console.log('\n🗃️ Checking policy_uploads table structure:');
const { data: sample, error: sampleError } = await supabase
  .from('policy_uploads')
  .select('*')
  .limit(1);

if (sampleError) {
  console.log('Error:', sampleError.message);
} else {
  if (sample.length > 0) {
    console.log('Sample record structure:');
    console.log(Object.keys(sample[0]));
  } else {
    console.log('Table exists but no records yet');
  }
}
