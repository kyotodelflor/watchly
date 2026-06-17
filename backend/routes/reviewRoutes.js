const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/", (req, res) => {
    const { user_id, movie_id, media_type, rating, review } = req.body;

    if (!user_id || !movie_id || !media_type || !review) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    db.run(
        `
        INSERT INTO reviews (user_id, movie_id, media_type, rating, review)
        VALUES (?, ?, ?, ?, ?)
        `,
        [user_id, movie_id, media_type, rating || 0, review],
        function (error) {
            if (error) {
                return res.status(500).json({
                    message: "Database error",
                    error: error.message,
                });
            }

            res.status(201).json({
                message: "Review saved",
                reviewId: this.lastID,
            });
        }
    );
});

router.get("/:type/:id", (req, res) => {
    const { type, id } = req.params;

    db.all(
        `
        SELECT 
            reviews.*,
            users.name,
            users.surname,
            users.username,
            users.avatar
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        WHERE reviews.movie_id = ? AND reviews.media_type = ?
        ORDER BY reviews.created_at DESC
        `,
        [id, type],
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