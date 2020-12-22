CREATE TABLE habits (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,
  frequency INTEGER NOT NULL, 
    created TIMESTAMPTZ DEFAULT now() NOT NULL
    userid INTEGER
    REFERENCES users(id) ON DELETE CASCADE NOT NULL,
);