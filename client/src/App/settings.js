import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

export default function Settings({ user, setUser, setHabits }) {
    const SAFETYQUESTION = `${user.nick_name} want to leave us!`;
    const [match, setMatch] = useState(false);
    const [error, setError] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    // const [errorNick, setErrorNick] = useState("");

    // const [nickMatch, setNickMatch] = useState(false);

    // const [query, setQuery] = useState("");

    // const navigate = useNavigate();

    // useEffect(() => {
    //     (async () => {
    //         const response = await fetch(`/api/check-nickname?q=${query}`);
    //         const nickCheck = await response.json();
    //         if (!nickCheck.error) {
    //             setNickMatch(false);
    //         } else {
    //             setNickMatch(true);
    //         }
    //     })();
    // }, [query]);
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
        setError(data.error);
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
    // function checkNickname(event) {
    //     console.log("nick check", event.target.value);
    //     setQuery(event.target.value);
    // }

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
            <h2>Change your nick</h2>
            <form onSubmit={editNick}>
                {/* check db while typing if nickname is there or not, on change? sending request to do return true or false */}
                <div className="form-input">
                    <input
                        type="text"
                        name="nick_name"
                        id="nname"
                        defaultValue={user.nick_name}
                        required
                        // onChange={checkNickname}
                    />
                    <label htmlFor="nname">Nick Name</label>
                </div>
                <button /* disabled={!nickMatch} */>Edit</button>
                {error && (
                    <span className="error">Nickname already exists</span>
                )}
            </form>
            <h2>Change your settings</h2>
            <form onSubmit={editProfile}>
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
            <h2>Change your Email</h2>
            <form onSubmit={editEmail}>
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
            <h2>Change your Password</h2>
            <form onSubmit={newPassword}>
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
                    <label htmlFor="password">Repeat your password</label>
                </div>
                {error && <p className="error">{error} </p>}
                <button>Edit</button>
            </form>
            <h2>Delete account</h2>
            <h4>If you want to delete your account please enter:</h4>
            <p>{SAFETYQUESTION}</p>
            <input type="text" onChange={checkDelete} />
            <form onSubmit={deleteAccount}>
                <button disabled={!match}>DELETE ACCOUNT</button>
            </form>
        </section>
    );
}
