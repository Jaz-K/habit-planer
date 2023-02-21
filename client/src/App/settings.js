import { useState } from "react";
// import { useNavigate } from "react-router-dom";

export default function Settings({ user }) {
    console.log("user", user);
    const SAFETYQUESTION = `${user.nick_name}, thanks for being here!`;
    const [match, setMatch] = useState(false);
    const [error, setError] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorNick, setErrorNick] = useState("");

    async function editNick(event) {
        event.preventDefault();

        const response = await fetch("/api/edit-nickname", {
            method: "POST",
            body: JSON.stringify({
                nick_name: event.target.nick_name.value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log("nick response", data);
        setErrorNick(data.error);
    }
    async function editProfile(event) {
        event.preventDefault();
        console.log("edit profile");

        const response = await fetch("/api/edit-user", {
            method: "POST",
            body: JSON.stringify({
                first_name: event.target.first_name.value,
                last_name: event.target.last_name.value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log("edit profile", data);
    }
    async function editEmail(event) {
        event.preventDefault();

        const response = await fetch("/api/edit-email", {
            method: "POST",
            body: JSON.stringify({
                email: event.target.email.value,
                emailRepeat: event.target.emailRepeat.value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log("edit password", data);
        setErrorEmail(data.emailError);
        event.target.email.value = "";
        event.target.emailRepeat.value = "";
    }
    async function newPassword(event) {
        try {
            event.preventDefault();
            console.log("PW change", event.target);
            const response = await fetch("/api/edit-password", {
                method: "POST",
                body: JSON.stringify({
                    password: event.target.password.value,
                    passwordRepeat: event.target.passwordRepeat.value,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            console.log("edit password", data);
            setError(data.error);
        } catch (error) {
            console.log(error);
        }
    }
    async function deleteAccount(event) {
        console.log("it clicks");
        event.preventDefault();
        const response = await fetch("/api/remove-profile", {
            method: "POST",
        });
        console.log(response);
        window.location.href = "/";
    }

    function checkDelete(event) {
        console.log("check delete", event.target.value);
        if (event.target.value === SAFETYQUESTION) {
            setMatch(true);
        } else {
            setMatch(false);
        }
    }
    return (
        <section className="settings">
            <form onSubmit={editNick}>
                <h2>Change your nickname</h2>
                <div className="form-input">
                    <input
                        type="text"
                        name="nick_name"
                        id="nname"
                        defaultValue={user.nick_name}
                        required
                    />
                    <label htmlFor="nname">Nick Name</label>
                </div>
                <button>Edit</button>
                {errorNick && (
                    <span className="error">Nickname already exists</span>
                )}
            </form>

            <form onSubmit={editProfile}>
                <h2>Change your name</h2>
                <div className="form-input">
                    <input
                        type="text"
                        name="first_name"
                        id="fname"
                        defaultValue={user.first_name}
                        required
                    />
                    <label htmlFor="fname">First Name</label>
                </div>
                <div className="form-input">
                    <input
                        type="text"
                        name="last_name"
                        id="lname"
                        defaultValue={user.last_name}
                        required
                    />
                    <label htmlFor="lname">Last Name</label>
                </div>
                <button>Edit</button>
            </form>

            <form onSubmit={editEmail}>
                <h2>Change your Email</h2>
                <div className="form-input">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        defaultValue={user.email}
                        required
                        autoComplete="do-not-autofill"
                    />
                    <label htmlFor="email">Email</label>
                </div>
                <div className="form-input">
                    <input
                        type="email"
                        name="emailRepeat"
                        id="emailRepeat"
                        required
                        autoComplete="do-not-autofill"
                    />
                    <label htmlFor="emailRepeat">Repeat your email</label>
                </div>
                {errorEmail && <p className="error">{errorEmail} </p>}
                <button>Edit</button>
            </form>

            <form onSubmit={newPassword}>
                <h2>Change your Password</h2>
                <div className="form-input">
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        autoComplete="do-not-autofill"
                    />
                    <label htmlFor="password">Password</label>
                </div>
                <div className="form-input">
                    <input
                        type="password"
                        name="passwordRepeat"
                        id="passwordRepeat"
                        required
                        autoComplete="do-not-autofill"
                    />
                    <label htmlFor="passwordRepeat">Repeat your password</label>
                </div>
                {error && <p className="error">{error} </p>}
                <button>Edit</button>
            </form>

            <form onSubmit={deleteAccount}>
                <h2>Delete account</h2>

                <h4>If you want to delete your account please enter:</h4>
                <h5 className="error"> {SAFETYQUESTION}</h5>
                <div className="form-input">
                    <input
                        type="text"
                        onChange={checkDelete}
                        id="removeAccount"
                        required
                    />
                    <label htmlFor="removeAccount">Enter the sentence!</label>
                </div>

                <button disabled={!match}>DELETE ACCOUNT</button>
            </form>
            <img src="illu_walkoutside.svg" alt="habit tracker" />
        </section>
    );
}
