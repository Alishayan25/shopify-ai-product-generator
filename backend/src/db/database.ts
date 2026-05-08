import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

let pool: Pool;

export const initializeDatabase = async (): Promise<void> => {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    // Test connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    logger.info('Database connection successful');
    await runMigrations();
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

export const getDB = (): Pool => {
  if (!pool) {
    throw new Error('Database not initialized');
  }
  return pool;
};

export const getClient = async (): Promise<PoolClient> => {
  return getDB().connect();
};

const runMigrations = async (): Promise<void> => {
  const client = await getClient();
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        shop_id VARCHAR(255) UNIQUE NOT NULL,
        shop_url VARCHAR(255) UNIQUE NOT NULL,
        access_token VARCHAR(255) NOT NULL,
        scopes TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Jobs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        input_image_url TEXT,
        price DECIMAL(10, 2),
        metadata JSONB,
        generated_images JSONB,
        generated_content JSONB,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Generated products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS generated_products (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        shopify_product_id VARCHAR(255),
        title TEXT NOT NULL,
        description TEXT,
        images TEXT[],
        published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_generated_products_job_id ON generated_products(job_id)');

    logger.info('Database migrations completed successfully');
  } catch (error) {
    logger.error('Migration error:', error);
  } finally {
    client.release();
  }
};
