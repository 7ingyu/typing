CREATE TABLE users
(
 user_id  serial NOT NULL,
 username text NOT NULL,
 pswhash  text NOT NULL,
 email    text NOT NULL,
 CONSTRAINT PK_users PRIMARY KEY ( user_id )
);

CREATE UNIQUE INDEX email_idx ON users ( email );

CREATE TABLE scores
(
 score_id serial NOT NULL,
 user_id  integer NOT NULL,
 wpm      int NOT NULL,
 start    date NOT NULL,
 "end"      date NOT NULL,
 elapsed  time NOT NULL,
 CONSTRAINT PK_scores PRIMARY KEY ( score_id ),
 CONSTRAINT FK_user FOREIGN KEY ( user_id ) REFERENCES users ( user_id )
);

CREATE INDEX user_idx ON scores ( user_id );