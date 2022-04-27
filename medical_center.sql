-- Part One: Medical Center
-- Design the schema for a medical center.

-- A medical center employs several doctors
-- A doctors can see many patients
-- A patient can be seen by many doctors
-- During a visit, a patient may be diagnosed to have one or more diseases.

-- from the terminal run:
-- psql < medical_center.sql

DROP DATABASE IF EXISTS medical_center;

CREATE DATABASE medical_center;

\c medical_center

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    p_first_name TEXT NOT NULL,
    p_last_name TEXT NOT NULL,
    date_of_birth DATE
);

CREATE TABLE diseases (
    id SERIAL PRIMARY KEY,
    disease TEXT NOT NULL
);

CREATE TABLE centers (
    id SERIAL PRIMARY KEY,
    dr_first_name TEXT NOT NULL,
    dr_last_name TEXT NOT NULL,
    patient INTEGER REFERENCES patients,
    disease INTEGER REFERENCES diseases
);

