import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Profile from "./profile";

export default function OtherUser({ avatar, habits }) {
    const [otherUser, setOtherUser] = useState({});
    const [currentScore, setCurrentScore] = useState({});
    const navigate = useNavigate();
    const { otherId } = useParams();

    useEffect(() => {
        console.log("useEffect is running");
        async function getUser() {
            const response = await fetch(`/api/users/${otherId}`);
            const data = await response.json();

            if (!data) {
                navigate("/");
                return;
            } else {
                setOtherUser(data);
            }
        }
        getUser();

        async function getOtherUserScore() {
            const response = await fetch(`/api/users_score/${otherId}`);
            const data = await response.json();
            setCurrentScore(data);
        }
        getOtherUserScore();
    }, [otherId]);

    return (
        <section>
            <div className="otherUser">
                <Profile
                    {...otherUser}
                    avatar={avatar}
                    currentScore={currentScore}
                    habits={habits}
                />
                <div className="statisticOtherUser">
                    <img src="/statistic.svg" alt="habit statistic" />
                </div>
            </div>
        </section>
    );
}
