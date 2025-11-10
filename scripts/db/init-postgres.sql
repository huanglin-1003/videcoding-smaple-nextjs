-- PostgreSQL Initialization Script
-- This script runs automatically when the PostgreSQL container starts for the first time

-- Create database (already created by POSTGRES_DB env var, but included for reference)
-- CREATE DATABASE breakfast_delivery;

-- Connect to the database
\c breakfast_delivery;

-- Set timezone to UTC
SET timezone = 'UTC';

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE breakfast_delivery TO postgres;

-- Log initialization
SELECT 'PostgreSQL database initialized successfully' AS status;
