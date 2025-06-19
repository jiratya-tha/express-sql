-- Create the database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'express_demo')
BEGIN
    CREATE DATABASE express_demo;
END
GO

USE express_demo;
GO

-- Create a test table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'test')
BEGIN
    CREATE TABLE test (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(100),
        created_at DATETIME DEFAULT GETDATE()
    );
END
GO 