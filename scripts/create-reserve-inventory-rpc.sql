-- Atomic inventory reservation function
-- This prevents race conditions when two users try to reserve the same item

CREATE OR REPLACE FUNCTION reserve_inventory_item(
  p_box_id INTEGER,
  p_sanity_product_slug VARCHAR(255)
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_inventory_id INTEGER;
BEGIN
  -- Find and lock an available inventory item in a single atomic operation
  -- FOR UPDATE SKIP LOCKED ensures we don't wait on locked rows and skip to next available
  SELECT id INTO v_inventory_id
  FROM inventory_items
  WHERE sanity_product_slug = p_sanity_product_slug
    AND state = 'available'
    AND (quarantine_until IS NULL OR quarantine_until < CURRENT_DATE)
  ORDER BY id
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  -- If no available item found, return NULL
  IF v_inventory_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Mark the item as active
  UPDATE inventory_items
  SET state = 'active',
      updated_at = NOW()
  WHERE id = v_inventory_id;

  -- Add to box_items
  INSERT INTO box_items (box_id, inventory_item_id, added_at)
  VALUES (p_box_id, v_inventory_id, NOW());

  RETURN v_inventory_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION reserve_inventory_item(INTEGER, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION reserve_inventory_item(INTEGER, VARCHAR) TO service_role;
