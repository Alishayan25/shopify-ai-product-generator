import { Router, Request, Response } from 'express';
import { getDB } from '../db/database';
import { logger } from '../utils/logger';

const router = Router();

router.post('/products/create', async (req: Request, res: Response) => {
  try {
    const { jobId, shopId, title, description, images } = req.body;

    if (!jobId || !shopId || !title) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
      });
    }

    const db = getDB();

    // Get user by shop ID
    const userResult = await db.query('SELECT id FROM users WHERE shop_id = $1', [shopId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const userId = userResult.rows[0].id;

    // Create product record
    const productResult = await db.query(
      `INSERT INTO generated_products (job_id, title, description, images)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [jobId, title, description, images]
    );

    logger.info(`Product created for job ${jobId}`);

    res.json({
      status: 'success',
      productId: productResult.rows[0].id,
      message: 'Product created successfully',
    });
  } catch (error) {
    logger.error('Product creation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create product',
    });
  }
});

export default router;
