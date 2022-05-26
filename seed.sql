-- from the terminal run:
-- psql < seed.sql

DROP DATABASE IF EXISTS blogly;

CREATE DATABASE blogly;

\c blogly

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  image_url TEXT NOT NULL
);

INSERT INTO users (first_name, last_name, image_url) VALUES ('Tim', 'Blue', 'Default'), ('Bob', 'Black', 'Default'), ('Sue', 'Green', 'Default');

