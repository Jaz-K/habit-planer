// import { socket } from "../socket";

// import { useEffect, useState } from "react";
export default function HabitModal({ onClose, setHabits, habits }) {
    // useEffect(() => {}, []);
    async function createHabit(event) {
        console.log("event in modal", event.target.habit_name.value);
        event.preventDefault();
        const response = await fetch("/api/create-habit", {
            method: "POST",
            body: JSON.stringify({
                habit_name: event.target.habit_name.value,
                days_per_week: event.target.tracked_day.value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const datas = await response.json();
        console.log("response create habit", datas);
        setHabits([...habits, datas]);
        onClose();
    }
    return (
        <section className="modal">
            <button onClick={onClose} className="modalCloseButton">
                ✖
            </button>
            <h2>Create a new Modal</h2>
            <form onSubmit={createHabit}>
                <div className="form-input">
                    <input
                        type="text"
                        name="habit_name"
                        id="habit_name"
                        required
                        minLength="3"
                        maxLength="20"
                    />
                    <label htmlFor="habit_name">Habit Name</label>
                </div>

                <div className="form-input">
                    <input
                        type="number"
                        id="tracked_day"
                        min="1"
                        max="7"
                        value="7"
                        disabled
                    ></input>
                    <label htmlFor="tracked_days"></label>
                </div>

                <button>Create</button>
            </form>
        </section>
    );
}
