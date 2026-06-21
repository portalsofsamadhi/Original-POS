# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install PM2 globally
RUN npm install -g pm2

# Create logs directory
RUN mkdir -p logs

# Expose ports
EXPOSE 4173 3001

# Start the application using PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
