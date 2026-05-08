# Shopify AI Product Generator - Frontend

React-based frontend for the Shopify AI Product Generator app.

## Features

- Image upload with drag-and-drop
- Product form with validation
- Real-time job status tracking
- Preview and edit generated content
- Shopify integration
- Responsive design with Tailwind CSS

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Update `REACT_APP_API_URL` to your backend URL.

### Development

```bash
npm start
```

App runs on http://localhost:3000

### Production Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── services/       # API services
├── store/          # Zustand stores
├── types/          # TypeScript types
├── utils/          # Utility functions
└── App.tsx         # Main app component
```

## Testing

```bash
npm test
```
