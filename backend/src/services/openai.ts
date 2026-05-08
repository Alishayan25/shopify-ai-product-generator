import OpenAI from 'openai';
import { logger } from '../utils/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeProductImage = async (imageUrl: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_VISION_MODEL || 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
            {
              type: 'text',
              text: `Analyze this product image and provide a detailed description. Include:
1. Product type/name
2. Material and texture
3. Color(s)
4. Size/dimensions (estimated)
5. Style/aesthetic
6. Condition (if visible)
7. Best use cases
8. Key features visible

Provide output as structured JSON.`,
            },
          ],
        },
      ],
    });

    const content = response.choices[0].message.content;
    return content || '';
  } catch (error) {
    logger.error('Image analysis error:', error);
    throw error;
  }
};

export const generateProductImage = async (productDescription: string): Promise<string> => {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Professional studio product photography of ${productDescription}. 
               High quality, white background, professional lighting, 
               commercial product shot, sharp focus, clean aesthetic, 
               perfect for e-commerce, 4k resolution`,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
    });

    return response.data[0].url || '';
  } catch (error) {
    logger.error('Image generation error:', error);
    throw error;
  }
};

export const generateProductContent = async (
  productName: string,
  productDescription: string,
  price: number,
  category: string
): Promise<any> => {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional e-commerce copywriter specializing in product descriptions and SEO optimization.',
        },
        {
          role: 'user',
          content: `Create comprehensive product copy for:
Product: ${productName}
Description: ${productDescription}
Price: $${price}
Category: ${category}

Generate a JSON object with:
1. seoTitle: SEO-optimized title (max 60 characters)
2. shortDescription: 100-150 character description
3. fullDescription: 300-500 word detailed description
4. benefits: Array of 5 key benefits as bullet points
5. metaDescription: Meta description (max 160 characters)
6. keywords: Array of 10 relevant search keywords
7. tags: Array of 5-10 product tags for categorization
8. callToAction: Compelling CTA text

Make it compelling, SEO-optimized, and conversion-focused.`,
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty response from OpenAI');
    
    return JSON.parse(content);
  } catch (error) {
    logger.error('Content generation error:', error);
    throw error;
  }
};
