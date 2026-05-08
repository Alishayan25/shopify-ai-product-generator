FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY public ./public
COPY src ./src
COPY tsconfig.json ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Build
RUN npm run build

# Serve
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=0 /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
