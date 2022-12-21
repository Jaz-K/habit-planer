import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import Register from "./register";
import Login from "./login";
import Footer from "../App/footer";

export default function Welcome() {
    return (
        <>
            <BrowserRouter>
                <header>
                    <div>
                        <img src="./habittracker_text.svg" alt="habit planer" />
                        <nav>
                            <Link to="/login">Login</Link>
                        </nav>
                    </div>
                </header>
                <section className="homepage">
                    <div>
                        <h1>Capture the little things</h1>
                        <p>
                            This app is fun and easy to use. It allows you to
                            track your habits, how often you do a habit, and how
                            many times you don&apos;t do it. After a while, you
                            will be able to see if there are any patterns in
                            your behavior that can help you improve.
                        </p>
                    </div>

                    <Routes>
                        <Route path="/" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </section>
                <section className="iBlock">
                    <div className="infoBlock">
                        <img src="/illu_check.svg" alt="habit tracker" />
                        <ul>
                            <li>
                                <h3>Keep track of your habits</h3>
                            </li>
                            <li>
                                <h3>Keeps you motivated</h3>
                            </li>
                            <li>
                                <h3>Helps break bad habits</h3>
                            </li>
                        </ul>
                    </div>
                </section>
                <Footer />
            </BrowserRouter>
        </>
    );
}
