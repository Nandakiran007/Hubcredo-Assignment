import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_API_URL || "https://localhost:5000";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Signup failed");
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user.username);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="auth">
            <h2>Signup</h2>
            <form onSubmit={submit}>
                <label>Username</label>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Email</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Signup</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>Have an account? <Link to="/login">Login</Link> </p>
        </div>
    );
}
