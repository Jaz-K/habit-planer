import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import Habit from "./habit";
import Dashboard from "./dashboard";
import Settings from "./settings";
import OtherUser from "./otherUser";
import Footer from "./footer";
import { socket } from "../socket";

export default function () {
    // const navigate = useNavigate();

    const DEFAULT_AVATAR = "/default_avatar.svg";
    const [user, setUser] = useState(0);
    const [habits, setHabits] = useState([]);
    const [allScores, setAllScores] = useState([]);
    const [currentScore, setCurrentScore] = useState(0);
    const [shroud, setShroud] = useState(false);
    const [modal, setModal] = useState(false);

    // console.log("habits app", habits);

    useEffect(() => {
        async function getUser() {
            const response = await fetch("/api/user/me");
            const parseJSON = await response.json();
            setUser(parseJSON);
        }
        getUser();

        async function getHabits() {
            const response = await fetch("/api/user/habits");
            const datas = await response.json();
            setHabits(datas);
        }
        getHabits();

        socket.on("scoreboard", function getScores(scores) {
            const userWithScores = scores.filter((score) => score.score > 0);
            setAllScores(userWithScores);
        });

        socket.on("currentScore", function (data) {
            // console.log("data currentScore", data);
            setCurrentScore(data);
        });
    }, []);

    function onBioUpdate(bio) {
        setUser({ ...user, bio });
        console.log("bioupdate");
    }
    function onModalClose() {
        setModal(false);
        setShroud(false);
    }
    function onShroud() {
        setShroud(false);
        setModal(false);
    }
    async function deleteHabit(id) {
        console.log("id delete");
        console.log("del clicked");
        const response = await fetch(`/api/delete-habit/${id}`, {
            method: "POST",
        });
        const remove = await response.json();
        console.log("remove from habit board", remove);
        const newHabitsList = habits.filter((habit) => habit.id !== id);
        console.log(newHabitsList);
        setHabits(newHabitsList);
        // navigate("/");
    }

    return (
        <>
            <BrowserRouter>
                {shroud && <div className="shroud" onClick={onShroud}></div>}
                <header>
                    <div>
                        <h1>Welcome {user.nick_name}</h1>
                        <nav>
                            <Link to="/">Dashboard</Link>
                            <Link to="/settings">Settings</Link>
                            <a href="/logout" className="logout">
                                Logout
                            </a>
                        </nav>
                    </div>
                </header>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Dashboard
                                user={user}
                                avatar={DEFAULT_AVATAR}
                                habits={habits}
                                setHabits={setHabits}
                                onClose={onModalClose}
                                modal={modal}
                                setModal={setModal}
                                shroud={shroud}
                                setShroud={setShroud}
                                allScores={allScores}
                                setAllScores={setAllScores}
                                onBioUpdate={onBioUpdate}
                                currentScore={currentScore}
                                deleteHabit={deleteHabit}
                            />
                        }
                    />

                    <Route
                        path="/habit/:nick_name/:id"
                        element={<Habit deleteHabit={deleteHabit} />}
                    />
                    <Route
                        path="/settings"
                        element={
                            <Settings
                                user={user}
                                setUser={setUser}
                                setHabits={setHabits}
                            />
                        }
                    />
                    <Route
                        path="/users/:otherId"
                        element={
                            <OtherUser
                                avatar={DEFAULT_AVATAR}
                                onBioUpdate={onBioUpdate}
                                currentScore={currentScore}
                                habits={habits}
                            />
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
            <Footer />
        </>
    );
}
