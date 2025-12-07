import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    async function submit(e) {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user.username);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    }
    if (localStorage.getItem("token")) {
        navigate("/dashboard");
        return null;
    }

    return (
        <div className="auth">
            <h2>Login</h2>
            <form onSubmit={submit}>
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
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>Don't have an account? <Link to= "/signup">Sign up</Link></p>
        </div>
    );
}
