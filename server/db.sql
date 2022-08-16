CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    isActivated BOOLEAN DEFAULT FALSE,
    activationLink VARCHAR(255)
);

CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    refreshToken VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);