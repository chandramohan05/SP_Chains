import pool from './db.js'

async function testDB() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result')
    console.log('✅ MySQL Connected:', rows[0].result)
    process.exit(0)
  } catch (error) {
    console.error('❌ MySQL Connection Failed:', error.message)
    process.exit(1)
  }
}

testDB()
