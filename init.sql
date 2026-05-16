CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('agent','apporteur','admin')) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','active','disabled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prospects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    request TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    user_email VARCHAR(150),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compte admin initial
INSERT INTO users (name, email, password_hash, role, status)
VALUES (
    'Admin',
    'admin',
    crypt('admin', gen_salt('bf')),
    'admin',
    'active'
);
