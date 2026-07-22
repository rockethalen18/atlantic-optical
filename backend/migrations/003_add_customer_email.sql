-- Add customer_email to orders table (missing from 002 migration)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255) NULL AFTER customer_name;
