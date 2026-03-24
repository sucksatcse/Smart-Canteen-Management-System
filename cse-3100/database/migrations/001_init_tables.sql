-- Smart Canteen Management System - Initial Database Setup
-- Issue 1: Backend Environment Setup

CREATE DATABASE IF NOT EXISTS `smart_canteen`
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `smart_canteen`;

-- ─────────────────────────────────────────────
-- Drop tables in reverse FK dependency order
-- ─────────────────────────────────────────────
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `menu_items`;
DROP TABLE IF EXISTS `users`;

-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
CREATE TABLE `users` (
    `id`                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`              VARCHAR(255) NOT NULL,
    `email`             VARCHAR(255) NOT NULL UNIQUE,
    `email_verified_at` TIMESTAMP NULL,
    `password`          VARCHAR(255) NOT NULL,
    `role`              ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    `remember_token`    VARCHAR(100) NULL,
    `created_at`        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- MENU ITEMS
-- ─────────────────────────────────────────────
CREATE TABLE `menu_items` (
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`        VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `price`       DECIMAL(8, 2) NOT NULL,
    `category`    VARCHAR(100) NOT NULL DEFAULT 'general',
    `image_url`   VARCHAR(500) NULL,
    `available`   BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────
CREATE TABLE `orders` (
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`     BIGINT UNSIGNED NOT NULL,
    `status`      ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    `total_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `notes`       TEXT NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- ORDER ITEMS
-- ─────────────────────────────────────────────
CREATE TABLE `order_items` (
    `id`             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `order_id`       BIGINT UNSIGNED NOT NULL,
    `menu_item_id`   BIGINT UNSIGNED NOT NULL,
    `quantity`       INT UNSIGNED NOT NULL DEFAULT 1,
    `unit_price`     DECIMAL(8, 2) NOT NULL,
    `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`)     REFERENCES `orders`(`id`)     ON DELETE CASCADE,
    FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`id`) ON DELETE RESTRICT
);

-- ─────────────────────────────────────────────
-- PAYMENTS
-- ─────────────────────────────────────────────
CREATE TABLE `payments` (
    `id`             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `order_id`       BIGINT UNSIGNED NOT NULL UNIQUE,
    `amount`         DECIMAL(10, 2) NOT NULL,
    `method`         ENUM('cash', 'card', 'mobile') NOT NULL DEFAULT 'cash',
    `status`         ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    `transaction_id` VARCHAR(255) NULL,
    `paid_at`        TIMESTAMP NULL,
    `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
);
