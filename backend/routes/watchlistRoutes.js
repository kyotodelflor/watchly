const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/:userId", (req, res) => {
    const { userId } = req.params;

    db.all(
        `
        SELECT *
        FROM watchlist
        WHERE user_id = ?
        ORDER BY saved_at DESC
        `,
        [userId],
        (error, rows) => {
            if (error) {
                return res.status(500).json({
                    message: "Database error",
                    error: error.message,
                });
            }

            res.json(rows);
        }
    );
});

router.post("/", (req, res) => {
    const {
        user_id,
        movie_id,
        media_type,
        title,
        poster_path,
        backdrop_path,
        vote_average,
        release_date,
        first_air_date,
        overview,
    } = req.body;

    if (!user_id || !movie_id || !media_type) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    db.run(
        `
        INSERT OR IGNORE INTO watchlist (
            user_id,
            movie_id,
            media_type,
            title,
            poster_path,
            backdrop_path,
            vote_average,
            release_date,
            first_air_date,
            overview
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            user_id,
            movie_id,
            media_type,
            title,
            poster_path,
            backdrop_path,
            vote_average || 0,
            release_date,
            first_air_date,
            overview,
        ],
        function (error) {
            if (error) {
                return res.status(500).json({
                    message: "Database error",
                    error: error.message,
                });
            }

            res.status(201).json({
                message: "Added to watchlist",
                id: this.lastID,
            });
        }
    );
});

router.delete("/:userId/:mediaType/:movieId", (req, res) => {
    const { userId, mediaType, movieId } = req.params;

    db.run(
        `
        DELETE FROM watchlist
        WHERE user_id = ? AND media_type = ? AND movie_id = ?
        `,
        [userId, mediaType, movieId],
        function (error) {
            if (error) {
                return res.status(500).json({
                    message: "Database error",
                    error: error.message,
                });
            }

            res.json({
                message: "Removed from watchlist",
                deleted: this.changes,
            });
        }
    );
});

router.get("/:userId/:mediaType/:movieId/check", (req, res) => {
    const { userId, mediaType, movieId } = req.params;

    db.get(
        `
        SELECT *
        FROM watchlist
        WHERE user_id = ? AND media_type = ? AND movie_id = ?
        `,
        [userId, mediaType, movieId],
        (error, row) => {
            if (error) {
                return res.status(500).json({
                    message: "Database error",
                    error: error.message,
                });
            }

            res.json({
                saved: !!row,
                item: row || null,
            });
        }
    );
});

module.exports = router;