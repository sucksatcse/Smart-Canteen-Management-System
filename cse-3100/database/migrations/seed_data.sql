-- Smart Canteen Management System - Seed Data
-- Run after 001_init_tables.sql

USE `smart_canteen`;

-- ─────────────────────────────────────────────
-- USERS (password: "password" bcrypt hash)
-- ─────────────────────────────────────────────
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Admin User',    'admin@smartcanteen.com',    '$2y$12$hGFgIwBGE9.C9t1JZMGf4OVfCPKNe3bTzP2T3y0s/eKS3gX4R.8Vy', 'admin'),
('John Customer', 'customer@smartcanteen.com', '$2y$12$hGFgIwBGE9.C9t1JZMGf4OVfCPKNe3bTzP2T3y0s/eKS3gX4R.8Vy', 'customer');

-- ─────────────────────────────────────────────
-- MENU ITEMS
-- ─────────────────────────────────────────────
INSERT INTO `menu_items` (`name`, `description`, `price`, `category`, `available`) VALUES
('Chicken Rice Bowl',   'Grilled chicken with steamed rice and vegetables',   120.00, 'main',    TRUE),
('Beef Burger',         'Juicy beef patty with lettuce, tomato and cheese',   150.00, 'main',    TRUE),
('Vegetable Fried Rice','Stir-fried rice with seasonal vegetables',           90.00,  'main',    TRUE),
('French Fries',        'Crispy golden fries with dipping sauce',             60.00,  'snack',   TRUE),
('Spring Rolls',        'Crispy rolls filled with mixed vegetables',          50.00,  'snack',   TRUE),
('Mango Lassi',         'Chilled yogurt drink blended with fresh mango',      45.00,  'drinks',  TRUE),
('Fresh Orange Juice',  'Freshly squeezed orange juice',                      55.00,  'drinks',  TRUE),
('Mineral Water',       'Chilled mineral water (500ml)',                      20.00,  'drinks',  TRUE),
('Chocolate Cake Slice','Rich moist chocolate cake slice',                    70.00,  'dessert', TRUE),
('Fruit Salad',         'Seasonal fresh fruit mix with honey drizzle',        65.00,  'dessert', TRUE);
