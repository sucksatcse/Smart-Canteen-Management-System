-- ==============================================================================
-- MySQL Conversion of Smart Canteen Management System Schema
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS smart_canteen;
USE smart_canteen;

-- ==============================================================================
-- 1. Core Tables
-- ==============================================================================

-- Users Table (Handles authentication for Admin, Staff, and Customer)
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PhoneNo VARCHAR(20) NULL,
    Role VARCHAR(20) NOT NULL CHECK (Role IN ('admin', 'staff', 'customer')),
    PasswordHash VARCHAR(255) NOT NULL,
    AvatarPath VARCHAR(255) NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Personal Access Tokens Table (Required for Laravel Sanctum API authentication)
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX personal_access_tokens_tokenable_type_tokenable_id_index (tokenable_type, tokenable_id)
);

-- Canteens Table
CREATE TABLE IF NOT EXISTS Canteens (
    CanteenID INT AUTO_INCREMENT PRIMARY KEY,
    CanteenName VARCHAR(100) NOT NULL,
    Location VARCHAR(255) NULL,
    ContactEmail VARCHAR(100) NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- StaffDetails Table (Payroll attributes for workers/admins)
CREATE TABLE IF NOT EXISTS StaffDetails (
    StaffID INT PRIMARY KEY,
    CanteenID INT NOT NULL,
    HourlyRate DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    WorkingHours DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (StaffID) REFERENCES Users(UserID) ON DELETE RESTRICT,
    FOREIGN KEY (CanteenID) REFERENCES Canteens(CanteenID) ON DELETE RESTRICT
);

-- Menu Table (Food Items)
CREATE TABLE IF NOT EXISTS Menu (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    CanteenID INT NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL CHECK (Price >= 0),
    StockQuantity INT NOT NULL DEFAULT 0 CHECK (StockQuantity >= 0),
    IsAvailable BOOLEAN NOT NULL DEFAULT TRUE,
    ImageURL VARCHAR(255) NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CanteenID) REFERENCES Canteens(CanteenID) ON DELETE RESTRICT
);

-- Orders Table
CREATE TABLE IF NOT EXISTS Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT NOT NULL,
    CanteenID INT NOT NULL,
    AssignedStaffID INT NULL,
    TotalAmount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    Status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (Status IN ('pending', 'preparing', 'completed', 'cancelled')),
    TableNumber VARCHAR(10) NULL,
    SpecialNotes TEXT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CustomerID) REFERENCES Users(UserID) ON DELETE RESTRICT,
    FOREIGN KEY (CanteenID) REFERENCES Canteens(CanteenID) ON DELETE RESTRICT,
    FOREIGN KEY (AssignedStaffID) REFERENCES Users(UserID) ON DELETE RESTRICT
) AUTO_INCREMENT=1000;

-- OrderItems Table (Linking Table for Many-to-Many logic)
CREATE TABLE IF NOT EXISTS OrderItems (
    OrderItemID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT NOT NULL,
    ItemID INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1 CHECK (Quantity > 0),
    UnitPrice DECIMAL(10, 2) NOT NULL CHECK (UnitPrice >= 0),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
    FOREIGN KEY (ItemID) REFERENCES Menu(ItemID) ON DELETE RESTRICT
);

-- Payments Table
CREATE TABLE IF NOT EXISTS Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL CHECK (Amount >= 0),
    PaymentMethod VARCHAR(50) NOT NULL,
    PaymentTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(20) NOT NULL DEFAULT 'completed',
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IX_Orders_CustomerID ON Orders(CustomerID);
CREATE INDEX IX_Orders_CanteenID ON Orders(CanteenID);
CREATE INDEX IX_Menu_CanteenID ON Menu(CanteenID);
CREATE INDEX IX_OrderItems_OrderID ON OrderItems(OrderID);


-- ==============================================================================
-- 2. Additional Assignment Tables
-- ==============================================================================

-- Create Posts Table (For the JWT Assignment Requirements)
CREATE TABLE IF NOT EXISTS posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users (UserID) ON DELETE CASCADE
);


-- ==============================================================================
-- 3. Views
-- ==============================================================================
CREATE OR REPLACE VIEW AvailableMenuItems AS
    SELECT
        m.ItemID,
        m.Name,
        m.Category,
        m.Price,
        m.StockQuantity,
        m.IsAvailable,
        m.ImageURL,
        c.CanteenID,
        c.CanteenName,
        c.Location AS CanteenLocation,
        CASE
            WHEN m.StockQuantity = 0 THEN 'Out of Stock'
            WHEN m.StockQuantity < 10 THEN 'Low Stock'
            ELSE 'In Stock'
        END AS StockStatus
    FROM Menu m
    INNER JOIN Canteens c ON m.CanteenID = c.CanteenID
    WHERE m.IsAvailable = 1
      AND c.CanteenID IN (
          SELECT CanteenID
          FROM Menu
          WHERE IsAvailable = 1
          GROUP BY CanteenID
          HAVING COUNT(*) >= 1
      );


-- ==============================================================================
-- 4. Triggers
-- ==============================================================================
DELIMITER //

DROP TRIGGER IF EXISTS trg_AutoDisableOutOfStock//
CREATE TRIGGER trg_AutoDisableOutOfStock
BEFORE UPDATE ON Menu
FOR EACH ROW
BEGIN
    IF NEW.StockQuantity < 0 THEN
        SET NEW.StockQuantity = 0;
    END IF;

    IF NEW.StockQuantity = 0 THEN
        SET NEW.IsAvailable = 0;
    ELSEIF NEW.StockQuantity > 0 THEN
        SET NEW.IsAvailable = 1;
    END IF;
END//

DROP TRIGGER IF EXISTS trg_DeductStock//
CREATE TRIGGER trg_DeductStock
BEFORE INSERT ON OrderItems
FOR EACH ROW
BEGIN
    DECLARE current_stock INT;
    
    SELECT StockQuantity INTO current_stock 
    FROM Menu 
    WHERE ItemID = NEW.ItemID;
    
    IF current_stock < NEW.Quantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Insufficient stock for one or more items in the order.';
    ELSE
        UPDATE Menu
        SET StockQuantity = StockQuantity - NEW.Quantity
        WHERE ItemID = NEW.ItemID;
    END IF;
END//

DROP TRIGGER IF EXISTS trg_RestockOnCancel//
CREATE TRIGGER trg_RestockOnCancel
AFTER UPDATE ON Orders
FOR EACH ROW
BEGIN
    IF NEW.Status = 'cancelled' AND OLD.Status != 'cancelled' THEN
        -- When an order is cancelled, return the quantities back to Menu stock.
        UPDATE Menu m
        INNER JOIN OrderItems oi ON m.ItemID = oi.ItemID
        SET m.StockQuantity = m.StockQuantity + oi.Quantity
        WHERE oi.OrderID = NEW.OrderID;
    END IF;
END//


-- ==============================================================================
-- 5. Stored Procedures
-- ==============================================================================
DROP PROCEDURE IF EXISTS GetMenuItems//
CREATE PROCEDURE GetMenuItems(IN p_Category VARCHAR(50))
BEGIN
    -- Aggregate summary
    SELECT
        COUNT(*) AS TotalAvailableItems,
        ROUND(AVG(Price), 2) AS AveragePrice,
        SUM(StockQuantity) AS TotalStockUnits,
        MIN(Price) AS CheapestItem,
        MAX(Price) AS MostExpensiveItem
    FROM AvailableMenuItems
    WHERE (p_Category IS NULL OR Category = p_Category);

    -- Menu items
    SELECT
        ItemID,
        Name,
        Category,
        Price,
        StockQuantity,
        IsAvailable,
        ImageURL,
        CanteenName,
        CanteenLocation,
        StockStatus
    FROM AvailableMenuItems
    WHERE (p_Category IS NULL OR Category = p_Category)
    ORDER BY Category, Price;
END//

DROP PROCEDURE IF EXISTS sp_ProcessPayment//
CREATE PROCEDURE sp_ProcessPayment(
    IN p_OrderID INT,
    IN p_PaymentMethod VARCHAR(50),
    IN p_AmountPaid DECIMAL(10,2)
)
BEGIN
    DECLARE exit handler for sqlexception
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- 1. Insert Payment Record
    INSERT INTO Payments (OrderID, Amount, PaymentMethod, PaymentTime)
    VALUES (p_OrderID, p_AmountPaid, p_PaymentMethod, CURRENT_TIMESTAMP);

    -- 2. Update Order Status
    UPDATE Orders
    SET Status = 'completed'
    WHERE OrderID = p_OrderID;

    COMMIT;
END//

DELIMITER ;


-- ==============================================================================
-- 6. Sample Queries
-- ==============================================================================
/*
-- 1. Joint query
SELECT m.ItemID, m.Name AS FoodItem, m.Price, m.Category, m.StockQuantity, c.CanteenName, c.Location
FROM Menu m
INNER JOIN Canteens c ON m.CanteenID = c.CanteenID
ORDER BY m.Category, m.Price;

-- 2. SUBQUERY
SELECT Name, Price, Category
FROM Menu
WHERE Price > (SELECT AVG(Price) FROM Menu WHERE IsAvailable = 1)
ORDER BY Price DESC;

-- 3. AGGREGATE
SELECT Category, COUNT(*) AS ItemCount, ROUND(AVG(Price), 2) AS AvgPrice, SUM(StockQuantity) AS TotalStock, MIN(Price) AS MinPrice, MAX(Price) AS MaxPrice
FROM Menu
GROUP BY Category
ORDER BY Category;

-- 4. VIEW execution
SELECT * FROM AvailableMenuItems ORDER BY Category, Price;

-- 5. Stored Procedure (all items)
CALL GetMenuItems(NULL);

-- 6. Stored Procedure (filtered)
CALL GetMenuItems('meals');
*/
