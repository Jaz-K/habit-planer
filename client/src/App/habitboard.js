import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function HabitBoard() {
    const [habits, setHabits] = useState([]);
    useEffect(() => {
        async function getHabits() {
            console.log("UserEffect HABBITBOARD is running");
            const response = await fetch("/api/user/habit");
            const datas = await response.json();
            setHabits(datas);
        }
        getHabits();
    }, []);
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
            <button>Create Habit</button>
        </div>
    );
}
