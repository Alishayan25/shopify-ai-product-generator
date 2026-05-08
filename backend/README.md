# Shopify AI Product Generator - Backend

Node.js/Express backend API for the Shopify AI Product Generator app.

## Features

- Shopify OAuth authentication
- OpenAI integration (GPT-4, DALL-E, Vision)
- Image upload and processing
- Async job queue (Bull + Redis)
- PostgreSQL database
- RESTful API endpoints

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- OpenAI API key
- Cloudinary account
- Shopify Partner account

### Installation

```bash
npm install
```

### Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Fill in your credentials.

### Development

```bash
npm run dev
```

Server runs on http://localhost:3001

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Upload
- `POST /api/upload/image` - Upload raw product image

### Generation
- `POST /api/generate/create` - Create generation job
- `GET /api/generate/status/:jobId` - Get job status

### Shopify
- `POST /api/shopify/products/create` - Create product in Shopify

## Database

Migrations run automatically on startup. To manually run:

```bash
npm run db:migrate
```

## Testing

```bash
npm test
npm run test:watch
```
