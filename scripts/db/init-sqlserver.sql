-- SQL Server Initialization Script
-- This script runs automatically when the SQL Server container starts for the first time

-- Create database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'breakfast_delivery')
BEGIN
    CREATE DATABASE breakfast_delivery;
END
GO

-- Use the database
USE breakfast_delivery;
GO

-- Set database collation and options
ALTER DATABASE breakfast_delivery
SET RECOVERY SIMPLE;
GO

-- Print confirmation
PRINT 'SQL Server database initialized successfully';
GO
