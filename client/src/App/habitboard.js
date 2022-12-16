import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HabitBoard({ habits }) {
    // console.log("habits", habits);
    // const [habits, setHabits] = useState([]);
    useEffect(() => {}, []);

    async function createHabit() {
        console.log("Create habit clicks");
        // const response = await fetch("/api/user/create-habit");
        // const datas = await response.json();
        // setHabits(datas);
    }

    return (
        <div>
            <h2>Habit Board</h2>
            <ul>
                {habits.map((habit) => (
                    <Link key={habit.id} to={`/habit/${habit.id}`}>
                        <li>{habit.habit_name}</li>
                    </Link>
                ))}
            </ul>
            <button onClick={createHabit}>Create Habit</button>
        </div>
    );
}
