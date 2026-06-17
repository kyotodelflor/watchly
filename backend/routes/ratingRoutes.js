const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/:userId/:mediaType/:movieId", (req, res) => {
    const { userId, mediaType, movieId } = req.params;

    db.get(
        `
        SELECT *
        FROM ratings
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
                rating: row ? row.rating : 0,
                item: row || null,
            });
        }
    );
});

router.post("/", (req, res) => {
    const { user_id, movie_id, media_type, rating } = req.body;

    if (!user_id || !movie_id || !media_type || !rating) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    db.run(
        `
        INSERT INTO ratings (user_id, movie_id, media_type, rating, rated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, movie_id, media_type)
        DO UPDATE SET
            rating = excluded.rating,
            rated_at = CURRENT_TIMESTAMP
        `,
        [user_id, movie_id, media_type, rating],
        function (error) {
            if (error) {
                return res.status(500).json({
                    message: "Database error",
                    error: error.message,
                });
            }

            res.json({
                message: "Rating saved",
                rating,
            });
        }
    );
});

router.get("/user/:userId", (req, res) => {
    const { userId } = req.params;

    db.all(
        `
        SELECT *
        FROM ratings
        WHERE user_id = ?
        ORDER BY rated_at DESC
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

module.exports = router;