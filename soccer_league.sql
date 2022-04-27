-- Part Three: Soccer League
-- Design a schema for a simple sports league. Your schema should keep track of

-- All of the teams in the league
-- All of the goals scored by every player for each game
-- All of the players in the league and their corresponding teams
-- All of the referees who have been part of each game
-- All of the matches played between teams
-- All of the start and end dates for season that a league has
-- The standings/rankings of each team in the league (This doesn’t have to be its own table if the data can be captured somehow).

-- from the terminal run:
-- psql < soccer_league.sql

DROP DATABASE IF EXISTS soccer_league;

CREATE DATABASE soccer_league;

\c soccer_league

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    season_start DATE,
    season_end DATE,
    rank INTEGER
);

CREATE TABLE players(
    id SERIAL PRIMARY KEY,
    player TEXT NOT NULL,
    goals INTEGER,
    team INTEGER REFERENCES teams
);

CREATE TABLE referees (
    id SERIAL PRIMARY KEY,
    ref TEXT NOT NULL,
);

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    teams_playing INTEGER REFERENCES teams,
    winner INTEGER REFERENCES teams,
    game_ref INTEGER REFERENCES referees
);

CREATE TABLE league (
    id SERIAL PRIMARY KEY,
    team INTEGER REFERENCES teams,
    standings INTEGER REFERENCES teams
);

