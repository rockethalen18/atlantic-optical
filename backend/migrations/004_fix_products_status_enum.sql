-- Fix products.status ENUM to use active/inactive (matching admin panel)
-- Also update any existing products with non-active/inactive status values

-- Change ENUM to include active/inactive
ALTER TABLE products MODIFY COLUMN status ENUM('active','inactive','draft','published','archived','out_of_stock') DEFAULT 'active';

-- Update any products that were saved with incorrect status
-- Products saved via admin with status='active' may have been silently rejected
-- Set all non-active products to active (since they were all imported as active)
UPDATE products SET status = 'active' WHERE status IS NULL OR status = '' OR status = 'draft';
