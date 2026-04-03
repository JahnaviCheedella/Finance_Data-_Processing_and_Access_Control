-- Seed Data for Finance Data Processing System
-- Note: The passwords given in comments below must be hashed using bcrypt before insertion in real scenarios.
-- For this seed, we will use a dummy hash representing the password 'password123'
-- Hash for 'password123': $2b$10$EpI7t.LdJv951fN06Fh5xeb1oI/wS1S8FzGE8TclYf9.oQzRyJb8u

INSERT INTO users (id, username, email, password_hash, role, status) VALUES
('11111111-1111-1111-1111-111111111111', 'admin_user', 'admin@example.com', '$2b$10$EpI7t.LdJv951fN06Fh5xeb1oI/wS1S8FzGE8TclYf9.oQzRyJb8u', 'ADMIN', 'ACTIVE'),
('22222222-2222-2222-2222-222222222222', 'analyst_user', 'analyst@example.com', '$2b$10$EpI7t.LdJv951fN06Fh5xeb1oI/wS1S8FzGE8TclYf9.oQzRyJb8u', 'ANALYST', 'ACTIVE'),
('33333333-3333-3333-3333-333333333333', 'viewer_user', 'viewer@example.com', '$2b$10$EpI7t.LdJv951fN06Fh5xeb1oI/wS1S8FzGE8TclYf9.oQzRyJb8u', 'VIEWER', 'ACTIVE')
ON CONFLICT DO NOTHING;

INSERT INTO financial_records (id, user_id, amount, type, category, date, description) VALUES
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 5000.00, 'INCOME', 'Salary', '2023-09-01', 'September Salary'),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 1500.00, 'EXPENSE', 'Rent', '2023-09-02', 'Office Rent'),
(uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 200.00, 'EXPENSE', 'Utilities', '2023-09-05', 'Internet Bill'),
(uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 3000.00, 'INCOME', 'Consulting', '2023-09-10', 'Project A Payment'),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 50.00, 'EXPENSE', 'Meals', '2023-09-12', 'Lunch meeting')
ON CONFLICT DO NOTHING;
