# ───────────────────────────────────────────────────────────
# Stage 1: Build the React Client
# ───────────────────────────────────────────────────────────
FROM node:22-alpine AS client-builder

WORKDIR /app
COPY client/package*.json ./
RUN npm install

# Pass necessary env args for Vite 
ARG FRONTEND_URL
ARG VITE_BACKEND_ENDPOINT
ENV VITE_BACKEND_ENDPOINT=$VITE_BACKEND_ENDPOINT

COPY client/ ./
RUN npm run build


# ───────────────────────────────────────────────────────────
# Stage 2: Build the Laravel Server (PHP + Apache)
# ───────────────────────────────────────────────────────────
FROM php:8.2-apache

# ENV Arguments for Laravel
ARG APP_NAME
ARG APP_ENV
ARG APP_KEY
ARG APP_DEBUG
ARG APP_URL
ARG FRONTEND_URL
ARG LOG_LEVEL
ARG DB_CONNECTION
ARG DB_HOST
ARG DB_PORT
ARG DB_DATABASE
ARG DB_USERNAME
ARG DB_PASSWORD

# Install system dependencies needed for Laravel
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable mod_rewrite
RUN a2enmod rewrite

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Configure Apache DocumentRoot to point to Laravel's public directory
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy Laravel backend code
COPY server/ /var/www/html/

# Install Laravel dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Copy React build from Stage 1 to Laravel public directory
COPY --from=client-builder /app/dist /var/www/html/public/

# Set environment variables for server
RUN touch .env && \
    echo "APP_NAME=${APP_NAME}" >> .env && \
    echo "SESSION_LIFETIME=1440" >> .env && \
    echo "APP_ENV=${APP_ENV}" >> .env && \
    echo "APP_KEY=${APP_KEY}" >> .env && \
    echo "APP_DEBUG=${APP_DEBUG}" >> .env && \
    echo "FRONTEND_URL=${FRONTEND_URL}" >> .env && \
    echo "LOG_LEVEL=${LOG_LEVEL}" >> .env && \
    echo "DB_CONNECTION=${DB_CONNECTION}" >> .env && \
    echo "DB_HOST=${DB_HOST}" >> .env && \
    echo "DB_DATABASE=${DB_DATABASE}" >> .env && \
    echo "DB_USERNAME=${DB_USERNAME}" >> .env && \
    echo "DB_PASSWORD=${DB_PASSWORD}" >> .env && \
    echo "DB_PORT=${DB_PORT}" >> .env

# Set permissions for Laravel
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 775 /var/www/html/storage \
    /var/www/html/bootstrap/cache || true \
    && chmod -R 775 /var/www/html/public || true

# Expose port 80 for Apache
EXPOSE 80

# Start Apache server (force remove conflicting MPMs at runtime just in case)
CMD sh -c "rm -f /etc/apache2/mods-enabled/mpm_event.load /etc/apache2/mods-enabled/mpm_worker.load && apache2-foreground"
