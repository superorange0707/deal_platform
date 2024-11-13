-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    "fullName" VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create deals table
CREATE TABLE deals (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('property', 'insurance', 'car')),
    description TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    images JSONB DEFAULT '[]'::jsonb,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    compliance_status VARCHAR(20) DEFAULT 'pending' CHECK (compliance_status IN ('pending', 'approved', 'rejected')),
    compliance_notes TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_type ON deals(type);



DROP TABLE IF EXISTS deals;

CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    compliance_status VARCHAR(50) DEFAULT 'pending',
    insurance_type VARCHAR(255),
    coverage DECIMAL(10,2),
    location VARCHAR(255),
    property_type VARCHAR(255),
    make VARCHAR(255),
    model VARCHAR(255),
    year INTEGER,
    images JSON DEFAULT '[]',
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE deals
ADD COLUMN ai_feedback TEXT;

ALTER TABLE deals
DROP COLUMN compliance_status;