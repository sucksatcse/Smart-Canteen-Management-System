#!/bin/sh
set -e

# Generate .env file from runtime environment variables
cat > /var/www/html/.env <<EOF
APP_NAME=${APP_NAME:-Laravel}
APP_ENV=${APP_ENV:-production}
APP_KEY=${APP_KEY}
APP_DEBUG=${APP_DEBUG:-false}
FRONTEND_URL=${FRONTEND_URL}
LOG_LEVEL=${LOG_LEVEL:-error}
SESSION_LIFETIME=1440
DB_CONNECTION=${DB_CONNECTION:-mysql}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT:-3306}
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
EOF

# Run database migrations
php artisan migrate --force

# Start Apache
a2dismod mpm_event mpm_worker 2>/dev/null || true
a2enmod mpm_prefork 2>/dev/null || true
exec apache2-foreground
