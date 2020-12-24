CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, 
  created TIMESTAMPTZ DEFAULT now() NOT NULL
);