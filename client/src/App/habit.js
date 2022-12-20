import "react-circular-progressbar/dist/styles.css";
import {
    CircularProgressbar,
    buildStyles,
    CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";
import { socket } from "../socket";
import MotivationalModal from "./modal_motivation";

export default function Habit() {
    // console.log("deleteHabit", deleteHabit);
    const navigate = useNavigate();

    const [habit, setHabit] = useState([]);
    const [habitStatus, setHabitStatus] = useState([]);
    const [status, setStatus] = useState([]);

    const [countScore, setCountScore] = useState(0);
    const [weekScore, setWeekScore] = useState(0);

    const [currentDay, setCurrentDay] = useState(0);
    const [checkBox, setCheckBox] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    const { id } = useParams();

    let weekStreak;
    let monthStreak;

    useEffect(() => {
        async function getHabit() {
            const response = await fetch(`/api/user/habit/${id}`);
            const parseJSON = await response.json();

            if (!parseJSON) {
                navigate("/");
                return;
            } else {
                setHabit(parseJSON);
            }
        }
        getHabit();

        socket.on("newScore", function (data) {
            setCountScore(data.score);
        });
    }, [weekScore]);

    useEffect(() => {
        const dayDifference = differenceInDays(
            new Date(),
            new Date(habit.created_at)
        );
        setCurrentDay(dayDifference);
    }, [habit]);

    useEffect(() => {
        async function getHabitStatus() {
            const habitStatusCall = await fetch(`/api/gethabitstatus/${id}`);
            const status = await habitStatusCall.json();

            const active = [{ checked: "active" }];
            console.log(status.length, currentDay);
            if (status.length === 0 && currentDay === 0) {
                const arr = new Array(27).fill({});
                arr[0].checked = null;
                const days = arr;

                setHabitStatus(() => [...active, ...days]);
                setStatus([...status]);
                // console.log("1");
            } else if (status.length - currentDay === 0) {
                const arr = new Array(27 - status.length).fill({});
                arr[0].checked = null;
                const days = arr;

                setHabitStatus(() => [...status, ...active, ...days]);
                setStatus([...status]);
                // console.log("2");
            } else if (currentDay - status.length > 0) {
                const arr = new Array(currentDay - status.length).fill({});
                arr[0].checked = false;
                const daysBefore = arr;

                const arr2 = new Array(28 - currentDay - 1).fill({});
                arr2[0].checked = null;
                const days = arr2;

                setHabitStatus([...status, ...daysBefore, ...active, ...days]);
                setStatus([...status]);
                // console.log("3");
                /////////////////
                arr.forEach(async function () {
                    const response = await fetch(`/api/sethabitstatus/${id}`, {
                        method: "POST",
                        body: JSON.stringify({ checked: false }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    const parseJSON = await response.json();
                    console.log("parseJSON", parseJSON);
                    setStatus([...status, parseJSON]);
                });
                //////////////////
            } else if (currentDay - status.length < 0) {
                const arr = new Array(28 - status.length).fill({});
                arr[0].checked = null;
                const days = arr;

                setHabitStatus([...status, ...days]);
                setStatus([...status]);
            }
        }
        getHabitStatus();
    }, [currentDay]);
    console.log("habitStatus", habitStatus);

    useEffect(() => {
        async function falseDays() {
            const statusLength = status.length;
            const curDay = currentDay;

            if (statusLength === curDay) {
                return;
            }
            if (statusLength < curDay) {
                // BREAK STREAK
                weekStreak = 0;
                monthStreak = 0;

                const habitCount = await fetch(`/api/setHabitCount/${id}`, {
                    method: "POST",
                    body: JSON.stringify({
                        week_streak: weekStreak,
                        month_streak: monthStreak,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const datas = await habitCount.json();
                setHabit(datas);
            }
        }
        falseDays();
    }, [habitStatus]);

    async function onClickHabit(idx) {
        socket.emit("countScore", 1);
        setCheckBox("checked");
        setSelectedId(idx);

        if (habit.week_streak < 7 || habit.week_streak > 7) {
            weekStreak = habit.week_streak + 1;
            monthStreak = habit.month_streak + 1;
        }
        if (habit.week_streak === 7) {
            weekStreak = 0;
            monthStreak = habit.month_streak + 1;
            socket.emit("countScore", 10);
        }
        if (countScore === 28) {
            socket.emit("countScore", 40);
            // sho finish modal
        }

        const habitCount = await fetch(`/api/setHabitCount/${id}`, {
            method: "POST",
            body: JSON.stringify({
                week_streak: weekStreak,
                month_streak: monthStreak,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const datas = await habitCount.json();
        setHabit(datas);

        const response = await fetch(`/api/sethabitstatus/${id}`, {
            method: "POST",
            body: JSON.stringify({ checked: true }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const parseJSON = await response.json();
        console.log("JSON", parseJSON);
        setHabitStatus([...habitStatus]);
    }

    async function resetHabit() {
        const response = await fetch(`/api/reset-habit/${id}`, {
            method: "POST",
        });
        const reset = await response.json();
        console.log("reset", reset);
        setHabit(reset);
        setWeekScore(0);
    }

    // async function deleteHabit() {
    //     console.log("del clicked");
    //     const response = await fetch(`/api/delete-habit/${id}`, {
    //         method: "POST",
    //     });
    //     const remove = await response.json();
    //     console.log("remove", remove);

    //     navigate("/");
    // }
    console.log("status", habitStatus.Objectvalues === true);
    return (
        <>
            {weekStreak === 7 && <MotivationalModal />}
            <section>
                <h2>{habit.habit_name}</h2>
                <hr></hr>
                <p>Week-Streak: {habit.week_streak}/7</p>
                <p> Month-Streak: {habit.month_streak}/28</p>

                <div style={{ width: 30, height: 30 }}>
                    <CircularProgressbarWithChildren
                        value={10}
                        minValue={1}
                        maxValue={28}
                        styles={buildStyles({
                            pathColor: "#2a1a3b",
                            trailColor: "#eee",
                            strokeLinecap: "butt",
                        })}
                    >
                        {/* Foreground path */}
                        <CircularProgressbar
                            value={12}
                            styles={buildStyles({
                                pathColor: "#c16bc9",
                                trailColor: "transparent",
                                strokeLinecap: "butt",
                            })}
                        />
                    </CircularProgressbarWithChildren>
                </div>

                <ul className="habitOverview">
                    {habitStatus.map((day, idx) => {
                        let className;

                        if ((idx === day.checked) === true) {
                            className = `day checked`;
                        } else if (day.checked === "active") {
                            console.log(currentDay);
                            className = `day active ${checkBox}`;
                        } else if (day.checked === true) {
                            className = "day checked";
                        } else if (day.checked === false) {
                            className = "day missed";
                        } else {
                            className = "day";
                        }
                        return (
                            <li
                                key={idx}
                                className={className}
                                onClick={() => onClickHabit(idx)}
                                selected={selectedId === idx}
                            >
                                {idx + 1}
                            </li>
                        );
                    })}
                </ul>

                <button onClick={resetHabit}> RESET Habit</button>
                {/* <button onClick={() => deleteHabit(id)}> DELETE Habit</button> */}
            </section>
        </>
    );
}
