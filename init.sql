CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('agent','apporteur','admin')) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','active','disabled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compte admin initial
INSERT INTO users (name, username, password_hash, role, status)
VALUES (
    'Admin',
    'admin@admin.admin',
    crypt('admin', gen_salt('bf')),
    'admin',
    'active'
);
