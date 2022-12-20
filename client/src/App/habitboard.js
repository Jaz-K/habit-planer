import "react-circular-progressbar/dist/styles.css";
// import {
//     CircularProgressbar,
//     buildStyles,
//     CircularProgressbarWithChildren,
// } from "react-circular-progressbar";
// import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import HabitModal from "./createHabitModal";

export default function HabitBoard({
    habits,
    setModal,
    setShroud,
    user,
    // setHabits,
    deleteHabit,
}) {
    // const navigate = useNavigate();

    function createHabit() {
        console.log("Create habit clicks");
        setModal(true);
        setShroud(true);
    }
    console.log("habit", habits);
    return (
        <>
            <div className="habitboard">
                <div>
                    <h2>Habit Board</h2>
                    <ul>
                        {habits.map((habit) => (
                            <li key={habit.id}>
                                <Link
                                    to={`/habit/${user.nick_name}/${habit.id}`}
                                >
                                    {habit.habit_name}
                                </Link>

                                <button
                                    onClick={() => deleteHabit(habit.id)}
                                    className="habitBoardButton"
                                >
                                    ✖
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="newHabitArea">
                    <p className="createHabitCounter">{habits.length}/5</p>
                    <button onClick={createHabit} disabled={habits.length >= 5}>
                        Create Habit
                    </button>
                </div>
            </div>
        </>
    );
}
