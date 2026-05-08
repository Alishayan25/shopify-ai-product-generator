import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../utils/logger';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (imagePath: string, folder: string = 'shopify-app'): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    });

    logger.info(`Image uploaded: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    logger.error('Image upload error:', error);
    throw error;
  }
};

export const transformImage = (publicId: string, transformations: any[]): string => {
  return cloudinary.url(publicId, {
    transformation: transformations,
    secure: true,
  });
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(`Image deleted: ${publicId}`);
  } catch (error) {
    logger.error('Image deletion error:', error);
    throw error;
  }
};
