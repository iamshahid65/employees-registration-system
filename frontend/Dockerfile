# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
ARG REACT_APP_API_URL=http://localhost:5000
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Stage 2: Nginx (Azure Compatible)
FROM nginx:alpine

# Remove default config
RUN rm -f /etc/nginx/conf.d/default.conf

# Create writable directories for Azure (non-root user)
RUN mkdir -p /tmp /var/cache/nginx /var/log/nginx && \
    chmod 777 /tmp /var/cache/nginx /var/log/nginx

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 (Azure App Service expects this)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1

# Start nginx (must stay in foreground for Azure)
CMD ["nginx", "-g", "daemon off;"]