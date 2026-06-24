# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the application
# We use build arguments for environment variables that need to be baked into the client-side code
ARG VITE_API_HOST
ARG VITE_BASE_PATH
ARG VITE_API_OZONE_HOST
ARG VITE_OAUTH_CLIENT_ID
ARG VITE_OAUTH_REDIRECT_URI
ARG VITE_OAUTH_SCOPE

ENV VITE_API_HOST=$VITE_API_HOST
ENV VITE_BASE_PATH=$VITE_BASE_PATH
ENV VITE_API_OZONE_HOST=$VITE_API_OZONE_HOST
ENV VITE_OAUTH_CLIENT_ID=$VITE_OAUTH_CLIENT_ID
ENV VITE_OAUTH_REDIRECT_URI=$VITE_OAUTH_REDIRECT_URI
ENV VITE_OAUTH_SCOPE=$VITE_OAUTH_SCOPE

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the build output to nginx public directory
# Note: the build output is in 'dist' directory
COPY --from=build /app/dist /usr/share/nginx/html/ui

# Add nginx configuration to handle React Router base path
RUN echo 'server { \
    listen 80; \
    location /ui { \
        alias /usr/share/nginx/html/ui; \
        try_files $uri $uri/ /ui/index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
