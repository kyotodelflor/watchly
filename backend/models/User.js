const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        surname: {
            type: String,
            default: "",
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: "/default-avatar.png",
        },
        country: {
            type: String,
            default: "Kazakhstan",
        },
        language: {
            type: String,
            default: "en",
        },
        theme: {
            type: String,
            default: "dark",
        },
        watchlist: {
            type: Array,
            default: [],
        },
        watchHistory: {
            type: Array,
            default: [],
        },
        ratings: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);