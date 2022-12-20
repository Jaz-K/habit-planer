import { useState } from "react";

export default function EditBio({ bio, onBioUpdate }) {
    const [editBio, setEditBio] = useState(false);

    function onEditButtonClick() {
        setEditBio(!editBio);
    }
    async function onSubmit(event) {
        const newBio = event.target.bio.value;
        event.preventDefault();

        const response = await fetch("/api/users/bio", {
            method: "POST",
            body: JSON.stringify({ bio: newBio }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        setEditBio(false);
        onBioUpdate(data.bio);
    }

    function renderForm() {
        return (
            <form onSubmit={onSubmit} className="bio">
                <textarea
                    name="bio"
                    defaultValue={bio}
                    className="scroller"
                ></textarea>
                <button className="classic">Save Goals</button>
            </form>
        );
    }

    const buttonStartBio = editBio ? "Cancel" : "Share your goals";
    const buttonEditBio = editBio ? "Cancel" : "Edit goals";

    return (
        <>
            {editBio ? renderForm() : <p className="bioText">{bio}</p>}
            {!bio && (
                <button className="classic" onClick={onEditButtonClick}>
                    {buttonStartBio}
                </button>
            )}
            {bio && (
                <button className="classic edit" onClick={onEditButtonClick}>
                    {buttonEditBio}
                </button>
            )}
        </>
    );
}
