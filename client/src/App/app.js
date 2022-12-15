import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Habit } from "./habit";
import { Dashboard } from "./dashboard";
// import { socket } from "../socket";

export default function () {
    const DEFAULT_AVATAR = "/default_avatar.svg";
    const [user, setUser] = useState(0);
    useEffect(() => {
        async function getUser() {
            const response = await fetch("/api/user/me");
            const parseJSON = await response.json();
            setUser(parseJSON);
            console.log("setUser", parseJSON);
        }
        getUser();
    }, []);
    return (
        <>
            <a href="/logout" className="logout">
                Logout
            </a>
            <h1>Welcome {user.nick_name}</h1>
            <h1>Track your habit and feel good to achieve something</h1>

            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Dashboard {...user} avatar={DEFAULT_AVATAR} />
                        }
                    />

                    <Route path="/habit/:id" element={<Habit />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
