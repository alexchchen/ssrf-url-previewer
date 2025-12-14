import Database from 'better-sqlite3';
import path from 'path';

// Create database in project root
const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Create users table with id (primary key for database), unique email, hashed password, and timestamp of when account is created
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create search history table with primary key, user id (foreign key referencing users table to reference user by unique id), url, and timestamp of when the search was made
db.exec(`
  CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    searched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

export default db;
