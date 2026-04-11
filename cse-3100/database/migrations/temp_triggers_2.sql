DELIMITER //

DROP TRIGGER IF EXISTS trg_RestockOnCancel//
CREATE TRIGGER trg_RestockOnCancel
AFTER UPDATE ON Orders
FOR EACH ROW
BEGIN
    IF NEW.Status = 'cancelled' AND OLD.Status != 'cancelled' THEN
        UPDATE Menu m
        INNER JOIN OrderItems oi ON m.ItemID = oi.ItemID
        SET m.StockQuantity = m.StockQuantity + oi.Quantity
        WHERE oi.OrderID = NEW.OrderID;
    END IF;
END//

DELIMITER ;
