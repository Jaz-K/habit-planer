import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
    const [error, setError] = useState("");

    async function onSubmit(event) {
        event.preventDefault();
        console.log("its submits");

        const response = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify({
                first_name: event.target.first_name.value,
                last_name: event.target.last_name.value,
                nick_name: event.target.nick_name.value,
                email: event.target.email.value,
                password: event.target.password.value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            window.location.href = "/";
            return;
        }

        try {
            const data = await response.json();
            setError(data.error);
        } catch (error) {
            console.log("Something is really broken");
        }
    }
    return (
        <>
            <form onSubmit={onSubmit} className="register formStyle">
                <div className="form-input">
                    <label htmlFor="fname">First Name</label>
                    <input type="text" name="first_name" id="fname" required />
                </div>
                <div className="form-input">
                    <label htmlFor="lname">Last Name</label>
                    <input type="text" name="last_name" id="lname" required />
                </div>
                {/* check db while typing if nickname is there or not, on change? sending request to do return true or false */}
                <div className="form-input">
                    <label htmlFor="nname">Nick Name</label>
                    <input type="text" name="nick_name" id="nname" required />
                </div>
                <div className="form-input">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        autoComplete="do-not-autofill"
                    />
                </div>
                <div className="form-input">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        autoComplete="do-not-autofill"
                    />
                </div>
                <button type="Submit" className="classic">
                    Register
                </button>
                <Link to="/login">Click here to Login</Link>
                {error && <p className="error">{error}</p>}
            </form>
        </>
    );
}
