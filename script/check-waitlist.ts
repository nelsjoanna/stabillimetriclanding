import pg from "pg";
const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

async function checkWaitlist() {
  try {
    const result = await pool.query(
      "SELECT * FROM waitlist_signups ORDER BY created_at DESC LIMIT 20"
    );
    
    console.log(`\n📊 Found ${result.rows.length} waitlist signups:\n`);
    
    if (result.rows.length === 0) {
      console.log("⚠️  No signups found in database");
    } else {
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.email}`);
        console.log(`   Name: ${row.name || "N/A"}`);
        console.log(`   Phone: ${row.phone_number || "N/A"}`);
        console.log(`   Created: ${row.created_at}`);
        console.log(`   ID: ${row.id}\n`);
      });
    }
    
    // Check table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'waitlist_signups'
      ORDER BY ordinal_position
    `);
    
    console.log("\n📋 Table structure:");
    tableInfo.rows.forEach((col) => {
      console.log(`   ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
  } catch (error: any) {
    console.error("❌ Error querying database:", error.message);
    if (error.message.includes("does not exist")) {
      console.error("\n⚠️  The waitlist_signups table doesn't exist!");
      console.error("   Run: npm run db:push to create the table");
    }
  } finally {
    await pool.end();
  }
}

checkWaitlist();
