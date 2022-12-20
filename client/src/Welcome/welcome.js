import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import Register from "./register";
import Login from "./login";

export default function Welcome() {
    return (
        <>
            <BrowserRouter>
                <header>
                    <div>
                        <img src="" alt="habit planer" />
                        <nav>
                            <Link to="/login">Login</Link>
                        </nav>
                    </div>
                </header>
                <section className="homepage">
                    <div>
                        <h1>
                            Track your habit and feel good to achieve something
                        </h1>
                        <p>
                            This app is fun and easy to use. It allows you to
                            track your habits, how often you do a habit, and how
                            many times you don't do it. After a while, you will
                            be able to see if there are any patterns in your
                            behavior that can help you improve.
                        </p>
                    </div>

                    <Routes>
                        <Route path="/" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </section>
                <section>
                    <div className="infoBlock">
                        <ul>
                            <li>
                                <img src="./default_icon.png" alt="" />
                                <h3>Keep track of your habits</h3>
                                <p>
                                    Cheddar queso gouda. Bavarian bergkase
                                    cheese triangles hard cheese cow macaroni
                                </p>
                            </li>
                            <li>
                                <img src="./default_icon.png" alt="" />
                                <h3>Keeps you motivated</h3>
                                <p>
                                    Cheddar queso gouda. Bavarian bergkase
                                    cheese triangles hard cheese cow macaroni
                                </p>
                            </li>
                            <li>
                                <img src="./default_icon.png" alt="" />
                                <h3>Helps break bad habits</h3>
                                <p>
                                    Cheddar queso gouda. Bavarian bergkase
                                    cheese triangles hard cheese cow macaroni
                                </p>
                            </li>
                        </ul>
                    </div>
                </section>
            </BrowserRouter>
        </>
    );
}
