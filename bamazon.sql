DROP SCHEMA IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE `products` (
  `itemid` INT NOT NULL AUTO_INCREMENT,
  `productname` VARCHAR(50) NULL,
  `departmentname` VARCHAR(25) NULL,  
  `price` DECIMAL(10,2) NULL,
  `stockquantity` INT NULL,
  PRIMARY KEY (`itemid`)
);

INSERT INTO products (productname,departmentname,price,stockquantity) 
VALUES ('Bananas','Produce',.07,10),
		('Carrots','Produce',.25,7),
		('Yogurt','Dairy',.55,12),
		('Coconut Milk','Dairy',3.43,13),
		('Veggie Dogs','Frozen',1.95,3),
		('Veggie Burgers','Frozen',4.25,9),
		('Bread','Bakery',1.88,5),
		('Tortillas','Bakery',2.19,15),
		('Pop Corn','Snacks',1.95,16),
		('Potato Chips','Snacks',2.50,48);

UPDATE `bamazondb`.`products` SET `stockquantity` = 5 WHERE `itemid` = 1;