// import { socket } from "../socket";

// import { useEffect, useState } from "react";
export default function MotivationalModal({ onClose, setHabits, habits }) {
    // useEffect(() => {}, []);
    // async function createHabit(event) {
    //     console.log("event in modal", event.target.habit_name.value);
    //     event.preventDefault();
    //     const response = await fetch("/api/create-habit", {
    //         method: "POST",
    //         body: JSON.stringify({
    //             habit_name: event.target.habit_name.value,
    //             days_per_week: event.target.tracked_day.value,
    //         }),
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     });
    //     const datas = await response.json();
    //     console.log("response create habit", datas);
    //     setHabits([...habits, datas]);
    //     onClose();
    // }
    return (
        <section className="modal">
            <button onClick={onClose} className="closeButton">
                ✖
            </button>
            <h2>You got it!</h2>
            <h2>go on</h2>
        </section>
    );
}
