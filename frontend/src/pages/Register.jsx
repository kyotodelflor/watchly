import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { saveAuth } from "../utils/auth";
import "../styles/auth.css";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        surname: "",
        username: "",
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
            const res = await registerUser(form);

            if (!res.token) {
                alert(res.message || "Registration failed");
                return;
            }

            saveAuth(res);

            localStorage.setItem("watchly_user_profile", JSON.stringify(res.user));
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
                <h2>Register</h2>

                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="surname"
                    placeholder="Surname"
                    value={form.surname}
                    onChange={handleChange}
                />

                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />

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
                    {loading ? "Creating account..." : "Sign Up"}
                </button>

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </main>
    );
};

export default Register;

// import React, { useState } from "react";
// import { registerUser } from "../utils/auth";
// import { useNavigate, Link } from "react-router-dom";
// import "../styles/auth.css";

// const Register = () => {
//     const [form, setForm] = useState({
//         name: "",
//         email: "",
//         password: "",
//     });

//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = () => {
//         const res = registerUser(form);

//         if (!res.success) {
//             alert(res.message);
//             return;
//         }

//         navigate("/");
//     };

//     return (
//         <div className="auth">
//             <h2>Register</h2>

//             <input name="name" placeholder="Name" onChange={handleChange} />
//             <input name="email" placeholder="Email" onChange={handleChange} />
//             <input name="password" type="password" placeholder="Password" onChange={handleChange} />

//             <button onClick={handleSubmit}>Sign Up</button>
//         </div>
//     );
// };

// export default Register;