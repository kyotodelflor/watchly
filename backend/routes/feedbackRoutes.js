const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/", (req, res) => {
    const { user_id, type, message, priority } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({ message: "Feedback message is required" });
    }

    db.run(
        `
        INSERT INTO feedback (user_id, type, message, priority)
        VALUES (?, ?, ?, ?)
        `,
        [
            user_id || null,
            type || "general",
            message.trim(),
            priority || "medium",
        ],
        function (error) {
            if (error) {
                return res.status(500).json({
                    message: "Database error",
                    error: error.message,
                });
            }

            res.status(201).json({
                message: "Feedback sent successfully",
                feedbackId: this.lastID,
            });
        }
    );
});

router.get("/user/:userId", (req, res) => {
    const { userId } = req.params;

    db.all(
        `
        SELECT *
        FROM feedback
        WHERE user_id = ?
        ORDER BY created_at DESC
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

router.get("/all", (req, res) => {
    db.all(
        `
        SELECT 
            feedback.*,
            users.name,
            users.surname,
            users.username,
            users.email,
            users.avatar
        FROM feedback
        LEFT JOIN users ON feedback.user_id = users.id
        ORDER BY feedback.created_at DESC
        `,
        [],
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

router.patch("/:id/status", (req, res) => {
    const { id } = req.params;
    const { status, admin_reply } = req.body;

    db.run(
        `
        UPDATE feedback
        SET status = ?, admin_reply = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [status || "new", admin_reply || "", id],
        function (error) {
            if (error) {
                return res.status(500).json({
                    message: "Database error",
                    error: error.message,
                });
            }

            res.json({
                message: "Feedback updated",
                updated: this.changes,
            });
        }
    );
});

module.exports = router;