const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

const createToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const parseJson = (value, fallback = []) => {
    try {
        return JSON.parse(value || JSON.stringify(fallback));
    } catch {
        return fallback;
    }
};

const cleanUser = (user) => ({
    id: user.id,
    name: user.name,
    surname: user.surname,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    country: user.country,
    language: user.language,
    theme: user.theme,
    watchlist: parseJson(user.watchlist),
    watchHistory: parseJson(user.watchHistory),
    ratings: parseJson(user.ratings),
});

router.post("/register", async (req, res) => {
    try {
        const { name, surname = "", username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "Fill all required fields" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, surname, username, email, password)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.run(sql, [name, surname, username, email.toLowerCase(), hashedPassword], function (error) {
            if (error) {
                if (error.message.includes("UNIQUE")) {
                    return res.status(400).json({
                        message: "Email or username already exists",
                    });
                }

                return res.status(500).json({
                    message: "Database error",
                    error: error.message,
                });
            }

            db.get("SELECT * FROM users WHERE id = ?", [this.lastID], (selectError, user) => {
                if (selectError) {
                    return res.status(500).json({
                        message: "Database error",
                        error: selectError.message,
                    });
                }

                const token = createToken(user.id);

                return res.status(201).json({
                    message: "Registration successful",
                    token,
                    user: cleanUser(user),
                });
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Enter email and password" });
    }

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email.toLowerCase()],
        async (error, user) => {
            if (error) {
                return res.status(500).json({
                    message: "Database error",
                    error: error.message,
                });
            }

            if (!user) {
                return res.status(400).json({
                    message: "Invalid email or password",
                });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (!isPasswordCorrect) {
                return res.status(400).json({
                    message: "Invalid email or password",
                });
            }

            const token = createToken(user.id);

            return res.json({
                message: "Login successful",
                token,
                user: cleanUser(user),
            });
        }
    );
});

module.exports = router;