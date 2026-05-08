import Queue from 'bull';
import { generateProductImage, analyzeProductImage } from '../services/openai';
import { uploadImage } from '../services/cloudinary';
import { getDB } from '../db/database';
import { logger } from '../utils/logger';
import { ImageGenerationPayload } from '../services/jobQueue';

export const processImageGeneration = async (
  job: Queue.Job<ImageGenerationPayload>
): Promise<void> => {
  const { jobId, imageUrl, productDescription } = job.data;

  try {
    logger.info(`Processing image generation job ${jobId}`);

    // Update job status to processing
    await updateJobStatus(jobId, 'processing');

    // Analyze the input image
    logger.info(`Analyzing input image for job ${jobId}`);
    const analysis = await analyzeProductImage(imageUrl);

    // Generate studio-style image
    logger.info(`Generating studio-style image for job ${jobId}`);
    const generatedImageUrl = await generateProductImage(productDescription);

    // Upload generated image to Cloudinary
    const uploadedImageUrl = await uploadImage(generatedImageUrl, `shopify-app/generated/${jobId}`);

    // Store results in database
    await storeGeneratedImages(jobId, {
      inputAnalysis: analysis,
      generatedImage: uploadedImageUrl,
    });

    // Update job status to completed
    await updateJobStatus(jobId, 'completed');

    logger.info(`Image generation job ${jobId} completed successfully`);
  } catch (error) {
    logger.error(`Image generation job ${jobId} failed:`, error);
    await updateJobStatus(jobId, 'failed', (error as Error).message);
    throw error;
  }
};

const updateJobStatus = async (
  jobId: number,
  status: string,
  errorMessage?: string
): Promise<void> => {
  const db = getDB();
  await db.query(
    'UPDATE jobs SET status = $1, error_message = $2, updated_at = NOW() WHERE id = $3',
    [status, errorMessage || null, jobId]
  );
};

const storeGeneratedImages = async (jobId: number, data: any): Promise<void> => {
  const db = getDB();
  await db.query(
    'UPDATE jobs SET generated_images = $1, updated_at = NOW() WHERE id = $2',
    [JSON.stringify(data), jobId]
  );
};
