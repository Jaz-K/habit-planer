import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { differenceInDays } from "date-fns";
import { socket } from "../socket";

export default function Habit() {
    const days = new Array(28).fill("");

    const [habit, setHabit] = useState({});
    const [countScore, setCountScore] = useState(0);
    const [weekScore, setWeekScore] = useState(0);
    const [currentDay, setCurrentDay] = useState(0);

    console.log("currentDay", currentDay);
    const { id } = useParams();

    console.log("currentDay", currentDay);
    const dayDifference = differenceInDays(
        new Date(),
        new Date(habit.created_at)
    );
    console.log("dayDifference", dayDifference);
    useEffect(() => {
        async function getHabit() {
            console.log("dayDifference", dayDifference);
            const response = await fetch(`/api/user/habit/${id}`);
            const parseJSON = await response.json();
            setHabit(parseJSON);
            setCurrentDay(dayDifference);
        }
        getHabit();

        // function setDayDifference() {
        //     differenceInDays(new Date(), new Date(habit.created_at));
        // }
        // setDayDifference();
    }, []);
    console.log("weekscore", weekScore);
    console.log("countscore", countScore);
    function onClickHabit() {
        setCountScore((countScore) => countScore + 1);
        setWeekScore((weekScore) => weekScore + 1);

        socket.emit("countScore", 1);
        // if (weekScore === 7) {
        //     socket.emit("countScore", 10);
        //     setWeekScore(0);
        // }
        // if (countScore === 28) {
        //     socket.emit("countScore", 40);
        // }
    }

    function resetHabit() {
        console.log("You clicked the reset button");
    }

    // setCurrentDay("dayDifference", dayDifference);
    // console.log("dayDifference", dayDifference);

    return (
        <section>
            <h2> Habit Headline {habit.habit_name}</h2>
            <ul className="habitOverview">
                {days.map((day, idx) =>
                    idx == currentDay ? (
                        <li
                            key={idx}
                            // selected={currentDay == idx}
                            className="day active"
                            onClick={() => onClickHabit()}
                        >
                            {idx + 1}
                        </li>
                    ) : (
                        <li
                            key={idx}
                            // selected={currentDay === idx}
                            className="day"
                            onClick={() => onClickHabit(idx)}
                        >
                            {idx + 1}
                        </li>
                    )
                )}
            </ul>
            <button onClick={resetHabit}> RESET Habit</button>
        </section>
    );
}
