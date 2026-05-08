import { Router, Request, Response } from 'express';
import { uploadImage } from '../services/cloudinary';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/errorHandler';
import multer from 'multer';
import path from 'path';

const router = Router();
const upload = multer({ dest: '/tmp' });

router.post('/image', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new AppError(400, 'No file uploaded');
    }

    logger.info(`Uploading image: ${req.file.originalname}`);
    const imageUrl = await uploadImage(req.file.path, 'shopify-app/uploads');

    res.json({
      status: 'success',
      imageUrl,
      filename: req.file.originalname,
    });
  } catch (error) {
    logger.error('Upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload image',
    });
  }
});

export default router;
