const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "watchly.db");

const db = new sqlite3.Database(dbPath, (error) => {
    if (error) {
        console.error("SQLite connection error:", error.message);
    } else {
        console.log("SQLite connected");
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            surname TEXT DEFAULT '',
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            avatar TEXT DEFAULT '/default-avatar.png',
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS user_preferences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL UNIQUE,
            language TEXT DEFAULT 'en',
            country TEXT DEFAULT 'Kazakhstan',
            theme TEXT DEFAULT 'dark',
            preferred_content TEXT DEFAULT 'all',
            default_sort TEXT DEFAULT 'popularity.desc',
            notifications INTEGER DEFAULT 1,
            autoplay_trailers INTEGER DEFAULT 1,
            mature_content INTEGER DEFAULT 0,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS watchlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            movie_id INTEGER NOT NULL,
            media_type TEXT NOT NULL,
            title TEXT,
            poster_path TEXT,
            backdrop_path TEXT,
            vote_average REAL DEFAULT 0,
            release_date TEXT,
            first_air_date TEXT,
            overview TEXT,
            saved_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, movie_id, media_type),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS watch_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            movie_id INTEGER NOT NULL,
            media_type TEXT NOT NULL,
            title TEXT,
            poster_path TEXT,
            vote_average REAL DEFAULT 0,
            viewed_at TEXT DEFAULT CURRENT_TIMESTAMP,
            view_count INTEGER DEFAULT 1,
            UNIQUE(user_id, movie_id, media_type),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS ratings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            movie_id INTEGER NOT NULL,
            media_type TEXT NOT NULL,
            rating INTEGER NOT NULL,
            rated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, movie_id, media_type),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            movie_id INTEGER NOT NULL,
            media_type TEXT NOT NULL,
            rating INTEGER DEFAULT 0,
            review TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS review_likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            review_id INTEGER NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, review_id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (review_id) REFERENCES reviews(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS search_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            query TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS recommendation_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            movie_id INTEGER NOT NULL,
            media_type TEXT NOT NULL,
            title TEXT,
            reason TEXT,
            source TEXT DEFAULT 'Watchly AI',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT DEFAULT 'general',
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        priority TEXT DEFAULT 'medium',
        admin_reply TEXT DEFAULT '',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    `);
});

module.exports = db;