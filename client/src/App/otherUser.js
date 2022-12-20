import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import Profile from "./profile";

export default function OtherUser({ currentScore, avatar, habits }) {
    const [otherUser, setOtherUser] = useState({});
    const navigate = useNavigate();
    const { otherId } = useParams();

    useEffect(() => {
        console.log("useEffect is running");
        async function getUser() {
            const response = await fetch(`/api/users/${otherId}`);
            const data = await response.json();
            // setOtherUser(data);

            console.log("otherusers", data);

            if (!data) {
                navigate("/");
                return;
            } else {
                setOtherUser(data);
            }
        }
        getUser();
    }, [otherId]);

    return (
        <section>
            <h2>Other user {otherUser.nick_name}</h2>
            <Profile
                {...otherUser}
                avatar={avatar}
                // onBioUpdate={onBioUpdate}
                currentScore={currentScore}
                habits={habits}
            />
        </section>
    );
}
