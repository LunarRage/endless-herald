# 1. Base Image Selection
FROM node:20-slim

# 2. Working Directory Creation
WORKDIR /src

# 3. Dependency Installation
COPY package*.json ./
COPY . .
RUN npm install --only=production

# 4. Application Building
RUN npm run build

# Create a directory for logs (if your app logs to file)
RUN mkdir -p ./app/logs

# 5. Environment Variable Configuration
ENV NODE_ENV=production

# 6. Application Execution
CMD ["node", "dist/index.js"]