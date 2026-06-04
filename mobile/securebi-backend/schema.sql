-- PostgreSQL Schema for SecureBI Backend

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY,
  tracking_no VARCHAR(255) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES users(id),
  created_by UUID NOT NULL REFERENCES users(id),
  courier_id UUID REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  item_name VARCHAR(255),
  description TEXT,
  category VARCHAR(255),
  estimated_weight VARCHAR(50),
  recipient_name VARCHAR(255),
  recipient_phone VARCHAR(20),
  delivery_address TEXT,
  city VARCHAR(255),
  postal_code VARCHAR(20),
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proof of Delivery table
CREATE TABLE IF NOT EXISTS pods (
  id UUID PRIMARY KEY,
  delivery_id UUID NOT NULL REFERENCES deliveries(id),
  recipient_id UUID NOT NULL REFERENCES users(id),
  verified BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_deliveries_customer_id ON deliveries(customer_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_courier_id ON deliveries(courier_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_tracking_no ON deliveries(tracking_no);
CREATE INDEX IF NOT EXISTS idx_pods_delivery_id ON pods(delivery_id);
