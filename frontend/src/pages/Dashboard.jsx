import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const username = localStorage.getItem("username") || "user";
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
    }
    if(!localStorage.getItem("token")){
        navigate("/login");
        return null;
    }

    return (
        <div>
            <h2>Hi, {username}</h2>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
