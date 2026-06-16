CREATE TABLE greetings (
    id            TEXT        PRIMARY KEY,
    recipient     TEXT        NOT NULL,
    language      TEXT        NOT NULL,
    message       TEXT        NOT NULL,
    visitor_number INTEGER    NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL
);

CREATE INDEX greetings_created_at_idx ON greetings (created_at DESC);
