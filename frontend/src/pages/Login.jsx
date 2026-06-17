import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { saveAuth } from "../utils/auth";
import "../styles/auth.css";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const res = await loginUser(form);

            if (!res.token) {
                alert(res.message || "Login failed");
                return;
            }

            saveAuth(res);

            localStorage.setItem(
                "watchly_user_profile",
                JSON.stringify(res.user)
            );

            window.dispatchEvent(new Event("userUpdated"));

            navigate("/");
        } catch (error) {
            alert("Server error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth">
            <form className="auth__card" onSubmit={handleSubmit}>
                <h2>Login</h2>

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Login"}
                </button>

                <p>
                    No account yet? <Link to="/register">Register</Link>
                </p>
            </form>
        </main>
    );
};

export default Login;
