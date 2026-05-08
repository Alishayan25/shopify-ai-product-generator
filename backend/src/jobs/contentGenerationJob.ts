import Queue from 'bull';
import { generateProductContent } from '../services/openai';
import { getDB } from '../db/database';
import { logger } from '../utils/logger';
import { ContentGenerationPayload } from '../services/jobQueue';

export const processContentGeneration = async (
  job: Queue.Job<ContentGenerationPayload>
): Promise<void> => {
  const { jobId, productName, productDescription, price, category } = job.data;

  try {
    logger.info(`Processing content generation job ${jobId}`);

    // Update job status to processing
    await updateJobStatus(jobId, 'processing');

    // Generate product content
    logger.info(`Generating product content for job ${jobId}`);
    const generatedContent = await generateProductContent(
      productName,
      productDescription,
      price,
      category
    );

    // Store results in database
    await storeGeneratedContent(jobId, generatedContent);

    // Update job status to completed
    await updateJobStatus(jobId, 'completed');

    logger.info(`Content generation job ${jobId} completed successfully`);
  } catch (error) {
    logger.error(`Content generation job ${jobId} failed:`, error);
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

const storeGeneratedContent = async (jobId: number, content: any): Promise<void> => {
  const db = getDB();
  await db.query(
    'UPDATE jobs SET generated_content = $1, updated_at = NOW() WHERE id = $2',
    [JSON.stringify(content), jobId]
  );
};
