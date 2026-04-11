FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG REACT_APP_API_URL=http://localhost:5000
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Copy server.js and build
COPY server.js ./
COPY --from=builder /app/build ./build

# Install express
RUN npm install express

EXPOSE 3000
CMD ["npm", "run", "start"]