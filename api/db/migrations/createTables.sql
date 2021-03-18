DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS invitations;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    admin BOOLEAN DEFAULT 'f',
    reset_token TEXT DEFAULT NULL,
    reset_token_expires TIMESTAMP DEFAULT NULL
);

/* generate sample users */

CREATE TABLE invitations
(
    id SERIAL PRIMARY KEY,
    email VARCHAR(200) NOT NULL,
    invite_token TEXT DEFAULT NULL,
    invite_token_expires TIMESTAMP DEFAULT NULL,
    used BOOLEAN DEFAULT 'f'
);







