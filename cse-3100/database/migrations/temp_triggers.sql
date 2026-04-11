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

DELIMITER ;
