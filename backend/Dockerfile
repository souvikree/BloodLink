# Use a lightweight Node image
FROM node:18-alpine

# Create app directory and set non-root user
WORKDIR /app

# Copy package files and install dependencies first (cache layer)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy rest of the code
COPY . .

# Optional: make port configurable via ENV
ENV PORT=5001

# Use non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the application
CMD ["node", "index.js"]
