import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Habit from "./habit";
import Dashboard from "./dashboard";
// import { socket } from "../socket";

export default function () {
    const DEFAULT_AVATAR = "/default_avatar.svg";
    const [user, setUser] = useState(0);
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        async function getUser() {
            const response = await fetch("/api/user/me");
            const parseJSON = await response.json();
            setUser(parseJSON);
            // console.log("setUser", parseJSON);
        }
        getUser();

        async function getHabits() {
            // console.log("UserEffect HABBITBOARD is running");
            const response = await fetch("/api/user/habits");
            const datas = await response.json();
            setHabits(datas);
            // console.log("app habit datas", datas);
        }
        getHabits();
    }, []);
    return (
        <>
            <BrowserRouter>
                <a href="/logout" className="logout">
                    Logout
                </a>
                <Link to="/">Dashboard</Link>
                <h1>Welcome {user.nick_name}</h1>
                <h1>Track your habit and feel good to achieve something</h1>

                <Routes>
                    <Route
                        path="/"
                        element={
                            <Dashboard
                                user={user}
                                avatar={DEFAULT_AVATAR}
                                habits={habits}
                            />
                        }
                    />

                    <Route path="/habit/:id" element={<Habit />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
