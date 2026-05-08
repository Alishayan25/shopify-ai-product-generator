import { Router, Request, Response } from 'express';
import { getDB } from '../db/database';
import { enqueueImageGeneration, enqueueContentGeneration } from '../services/jobQueue';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.post('/create', async (req: Request, res: Response) => {
  try {
    const { userId, imageUrl, productName, productDescription, price, category } = req.body;

    if (!userId || !imageUrl || !productName || !price) {
      throw new AppError(400, 'Missing required fields');
    }

    const db = getDB();

    // Create job record
    const result = await db.query(
      `INSERT INTO jobs (user_id, input_image_url, price, metadata, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        userId,
        imageUrl,
        price,
        JSON.stringify({ productName, productDescription, category }),
        'pending',
      ]
    );

    const jobId = result.rows[0].id;

    // Enqueue image generation
    await enqueueImageGeneration({
      jobId,
      userId,
      imageUrl,
      productDescription,
    });

    // Enqueue content generation
    await enqueueContentGeneration({
      jobId,
      userId,
      productName,
      productDescription,
      price,
      category,
    });

    logger.info(`Job ${jobId} created for user ${userId}`);

    res.json({
      status: 'success',
      jobId,
      message: 'Generation started',
    });
  } catch (error) {
    logger.error('Generation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create generation job',
    });
  }
});

router.get('/status/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const db = getDB();

    const result = await db.query(
      'SELECT id, status, generated_images, generated_content, error_message FROM jobs WHERE id = $1',
      [jobId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Job not found');
    }

    res.json({
      status: 'success',
      job: result.rows[0],
    });
  } catch (error) {
    logger.error('Status check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get job status',
    });
  }
});

export default router;
