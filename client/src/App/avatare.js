import { useState, useEffect } from "react";

export default function Avatare({
    closeAvatarModal,
    avatar,
    setUser,
    img_url,
}) {
    const [avatare, setAvatare] = useState([]);
    const [newAvatar, setNewAvatar] = useState("");
    const [clickedAvatar, setclickedAvatar] = useState("");

    useEffect(() => {
        async function getAvatare() {
            const response = await fetch("/api/avatare");
            const parseJSON = await response.json();
            setAvatare(parseJSON);
        }
        getAvatare();
    }, []);

    function chooseAvatar(idx) {
        const index = idx + 1;
        setNewAvatar("/avatar_" + index + ".png");
        setclickedAvatar("activeAvatar");
    }

    async function submitAvatar() {
        const response = await fetch("/api/new_avatare", {
            method: "POST",
            body: JSON.stringify({ img_url: newAvatar }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const parseJSON = await response.json();
        setUser(parseJSON);
        console.log(parseJSON);
        closeAvatarModal();
    }

    return (
        <section className="modal avatare">
            <button onClick={closeAvatarModal} className="modalCloseButton">
                ✖
            </button>
            <h2>Choose your avatar</h2>
            <img
                src={newAvatar ? newAvatar : img_url ? img_url : avatar}
                alt="habit tracker avatar"
                className="avatarPreview"
            />
            <ul>
                {avatare.map((avatar, idx) => {
                    let className;

                    if (idx === avatar.id) {
                        className = "activeAvatar";
                    }
                    return (
                        <li key={avatar.id} onClick={() => chooseAvatar(idx)}>
                            <img
                                src={avatar.img_url}
                                className={`avatareList ${className}`}
                            />
                        </li>
                    );
                })}
            </ul>
            <button onClick={submitAvatar}>Submit</button>
        </section>
    );
}
