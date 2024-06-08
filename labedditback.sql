-- Active: 1713817210465@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    likes_count INTEGER DEFAULT (0) NOT NULL,
    dislikes_count INTEGER DEFAULT (0) NOT NULL,
    comments_count INTEGER DEFAULT (0) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

CREATE TABLE comments (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    likes_count INTEGER DEFAULT (0) NOT NULL,
    dislikes_count INTEGER DEFAULT (0) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) 
      ON DELETE CASCADE 
      ON UPDATE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(id) 
      ON DELETE CASCADE 
      ON UPDATE CASCADE
);

CREATE TABLE posts_likes_dislikes (
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE comments_likes_dislikes (
  user_id TEXT NOT NULL,
  comment_id TEXT NOT NULL,
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES comments (id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

DROP TABLE comments_likes_dislikes;

DROP TABLE posts_likes_dislikes;

DROP TABLE comments;

DROP TABLE posts;

DROP TABLE users;






