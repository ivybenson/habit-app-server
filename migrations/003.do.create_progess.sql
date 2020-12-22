CREATE TABLE progress (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
   habitId INTEGER
        REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
    created TIMESTAMPTZ DEFAULT now() NOT NULL
);