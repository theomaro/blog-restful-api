--
--
DROP SCHEMA IF EXISTS blog;

CREATE SCHEMA blog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE blog;

-- https://ui-avatars.com/api/?name=John+Doe?background=0D8ABC&color=fff
CREATE TABLE IF NOT EXISTS user (
    id VARCHAR(50) NOT NULL UNIQUE PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    current_role ENUM('admin', 'editor', 'author', 'reader') NOT NULL DEFAULT 'reader',
    full_name VARCHAR(100) NULL,
    sex ENUM('female', 'male') NULL DEFAULT NULL,
    birth_date DATE NULL DEFAULT NULL,
    phone VARCHAR(15) NULL UNIQUE DEFAULT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    avatar_url VARCHAR(255) NULL DEFAULT NULL,
    biography TINYTEXT NULL DEFAULT NULL,
    country VARCHAR(45) NULL DEFAULT NULL,
    current_status ENUM('active', 'deleted', 'banned') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP (),
    modified_at DATETIME NULL DEFAULT NULL,
    last_login_at DATETIME NULL DEFAULT NULL
);

--
CREATE TABLE post (
    id VARCHAR(50) NOT NULL UNIQUE PRIMARY KEY,
    title VARCHAR(75) NOT NULL UNIQUE,
    meta_title VARCHAR(100) NULL UNIQUE DEFAULT NULL,
    summary TINYTEXT NOT NULL,
    body TEXT NULL DEFAULT NULL,
    banner_url VARCHAR(255) NULL DEFAULT NULL,
    slug_url VARCHAR(100) NOT NULL UNIQUE,
    current_status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    created_by VARCHAR(255) NOT NULL,
    created_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP (),
    published_on DATETIME NULL DEFAULT NULL,
    modified_on DATETIME NULL DEFAULT NULL,
    CONSTRAINT fk_post_creator FOREIGN KEY (created_by) REFERENCES user(id)
);

CREATE TABLE comment (
    id VARCHAR(50) NOT NULL UNIQUE PRIMARY KEY,
    body TEXT NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    posted_on VARCHAR(50) NOT NULL,
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP (),
    modified_at DATETIME NULL DEFAULT NULL,
    published_at DATETIME NULL DEFAULT NULL,
    current_status ENUM('pending', 'approved', 'disapproved') NOT NULL DEFAULT 'pending',
    parent_id VARCHAR(50) NULL DEFAULT NULL,
    CONSTRAINT fk_comment_user FOREIGN KEY (created_by) REFERENCES user (id),
    CONSTRAINT fk_comment_post FOREIGN KEY (posted_on) REFERENCES post (id),
    CONSTRAINT fk_comment_parent FOREIGN KEY (parent_id) REFERENCES comment (id)
);