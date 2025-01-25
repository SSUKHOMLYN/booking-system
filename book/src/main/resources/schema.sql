CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    u_role VARCHAR(20) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE slots (
    slot_id SERIAL PRIMARY KEY,
    slot_time TIMESTAMP NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
