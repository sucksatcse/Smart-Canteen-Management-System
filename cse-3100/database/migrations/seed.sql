-- ==============================================================================
-- Seeds for Smart Canteen Management System
-- ==============================================================================
USE smart_canteen;

START TRANSACTION;

-- Seed Users
-- Password for all is default 'password' hashed
INSERT IGNORE INTO Users (UserID, Name, Email, PhoneNo, Role, PasswordHash) VALUES
(1, 'Admin User', 'admin@smartcanteen.com', '+1234567890', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(2, 'Chef John', 'staff@smartcanteen.com', '+1234567891', 'staff', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(3, 'Customer Mike', 'customer@email.com', '+1234567892', 'customer', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(4, 'Sarah Williams', 'sarah@smartcanteen.com', NULL, 'staff', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(5, 'Michael Brown', 'michael@smartcanteen.com', NULL, 'staff', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(6, 'Emily Davis', 'emily@smartcanteen.com', NULL, 'staff', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Seed Canteen
INSERT IGNORE INTO Canteens (CanteenID, CanteenName, Location, ContactEmail)
VALUES (1, 'Main Campus Canteen', 'Block A, Ground Floor', 'canteen@smartcanteen.com');

-- Seed Staff Details
INSERT IGNORE INTO StaffDetails (StaffID, CanteenID, HourlyRate, WorkingHours) VALUES
(1, 1, 50.00, 40.00),
(2, 1, 20.00, 40.00),
(4, 1, 18.00, 35.00),
(5, 1, 22.00, 38.00),
(6, 1, 19.00, 40.00);

-- Seed Menu
INSERT IGNORE INTO Menu (ItemID, CanteenID, Name, Category, Price, StockQuantity, IsAvailable, ImageURL) VALUES
(1, 1, 'French Fries', 'snacks', 4.99, 50, 1, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877'),
(2, 1, 'Chicken Wings', 'snacks', 8.99, 30, 1, 'https://images.unsplash.com/photo-1608039755401-742074f0548d'),
(3, 1, 'Onion Rings', 'snacks', 5.99, 40, 1, 'https://images.unsplash.com/photo-1639024471283-03518883512d'),
(4, 1, 'Classic Burger', 'meals', 12.99, 25, 1, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'),
(5, 1, 'Margherita Pizza', 'meals', 14.99, 20, 1, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002'),
(6, 1, 'Grilled Chicken', 'meals', 16.99, 15, 1, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6'),
(7, 1, 'Pasta Carbonara', 'meals', 13.99, 0, 0, 'https://images.unsplash.com/photo-1612874742237-6526221588e3'),
(8, 1, 'Coca Cola', 'drinks', 2.99, 100, 1, 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e'),
(9, 1, 'Orange Juice', 'drinks', 4.99, 35, 1, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba'),
(10, 1, 'Iced Coffee', 'drinks', 5.99, 45, 1, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7');

-- Seed Orders
INSERT IGNORE INTO Orders (OrderID, CustomerID, CanteenID, AssignedStaffID, TotalAmount, Status, TableNumber, SpecialNotes) VALUES
(1001, 3, 1, 2, 31.96, 'pending', '5', 'Extra ketchup please'),
(1002, 3, 1, 2, 19.98, 'preparing', '3', NULL),
(1003, 3, 1, 2, 44.94, 'completed', '7', NULL),
(1004, 3, 1, 2, 14.98, 'completed', '2', NULL);

-- Seed OrderItems
INSERT IGNORE INTO OrderItems (OrderID, ItemID, Quantity, UnitPrice) VALUES
(1001, 4, 2, 12.99),
(1001, 8, 2, 2.99),
(1002, 5, 1, 14.99),
(1002, 9, 1, 4.99),
(1003, 2, 3, 8.99),
(1003, 10, 3, 5.99),
(1004, 1, 2, 4.99),
(1004, 9, 2, 4.99);

-- Seed Payments
INSERT IGNORE INTO Payments (OrderID, Amount, PaymentMethod, Status) VALUES
(1001, 31.96, 'card', 'completed'),
(1002, 19.98, 'cash', 'completed'),
(1003, 44.94, 'online', 'completed'),
(1004, 14.98, 'card', 'completed');

-- Seed Posts for the JWT Assignment
INSERT IGNORE INTO posts (user_id, title, content) VALUES 
(1, 'Welcome to Smart Canteen', 'This is the first post announcing our new automated canteen system.');

COMMIT;
