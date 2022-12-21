import "react-circular-progressbar/dist/styles.css";
import {
    CircularProgressbar,
    buildStyles,
    // CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";
import { socket } from "../socket";
import MotivationalModal from "./modal_motivation";
import MotivationalModalFinish from "./modal_motivation_finish";

export default function Habit({
    setShroud,
    cheerModal,
    closeCheerModal,
    setCheerModal,
    habitStatus,
    setHabitStatus,
}) {
    const navigate = useNavigate();

    const [habit, setHabit] = useState([]);
    // const [habitStatus, setHabitStatus] = useState([]);
    const [status, setStatus] = useState([]);

    const [countScore, setCountScore] = useState(0);
    const [weekScore, setWeekScore] = useState(0);

    const [currentDay, setCurrentDay] = useState(0);
    const [checkBox, setCheckBox] = useState("active");
    const [selectedId, setSelectedId] = useState(null);

    const [process, setProcess] = useState(0);
    const { id } = useParams();

    useEffect(() => {
        console.log("first");
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
        console.log("second");
        const dayDifference = differenceInDays(
            new Date(),
            new Date(habit.created_at)
        );
        setCurrentDay(dayDifference);
    }, [habit]);

    useEffect(() => {
        console.log("third");
        async function getHabitStatus() {
            console.log("get habit status");
            const habitStatusCall = await fetch(`/api/gethabitstatus/${id}`);
            const status = await habitStatusCall.json();

            const active = { checked: "active" };

            if (status.length === 0 && currentDay === 0) {
                const arr = new Array(27).fill({});
                arr[0].checked = null;
                const days = arr;

                setHabitStatus(() => [active, ...days]);
                setStatus(active);
                setProcess(0);
                console.log("1");
            } else if (status.length - currentDay === 0) {
                const arr = new Array(27 - status.length).fill({});
                arr[0].checked = null;
                const days = arr;
                setHabitStatus(() => [...status, active, ...days]);
                setStatus([...status]);
                setProcess(status.length);
                console.log("2");
            } else if (currentDay - status.length > 0) {
                // console.log("curr day - length", currentDay - status.length);
                // console.log("curr day - length", currentDay);
                // console.log("curr day - length", status.length);

                const arr = new Array(currentDay - status.length).fill({});
                arr[0].checked = false;
                const daysBefore = arr;

                setProcess(process + daysBefore);

                const arr2 = new Array(28 - currentDay - 1).fill({});
                arr2[0].checked = null;
                const days = arr2;

                setHabitStatus([...status, ...daysBefore, active, ...days]);
                setStatus([...status]);
                console.log("3");

                /////////////////
                daysBefore.forEach(async function () {
                    console.log("for each", daysBefore);
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
        console.log("third end", status);

        const falseDays = habitStatus.filter(
            (x) => x.checked === false && x.checked !== null
        ).length;

        const trueDays = habitStatus.filter(
            (x) => x.checked === true && x.checked !== null
        ).length;

        setProcess(trueDays + falseDays);
    }, [currentDay]); //currentDay

    useEffect(() => {
        console.log("fourth");
        async function falseDays() {
            const statusLength = status.length;
            const curDay = currentDay;
            let weekStreak;
            let monthStreak;

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
    }, [habitStatus]); //habitStatus

    async function onClickHabit(idx) {
        socket.emit("countScore", 1);
        setCheckBox("checked");
        setSelectedId(idx);
        let weekStreak;
        let monthStreak;
        if (habit.week_streak < 7 || habit.week_streak > 7) {
            weekStreak = habit.week_streak + 1;
            monthStreak = habit.month_streak + 1;
        }
        // show week modall
        if (habit.week_streak === 7) {
            weekStreak = 0;
            monthStreak = habit.month_streak + 1;
            socket.emit("countScore", 10);
            setShroud(true);
            setCheerModal(true);
        }
        if (countScore === 28) {
            socket.emit("countScore", 40);
            setShroud(true);
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
        setWeekScore(weekStreak);

        const response = await fetch(`/api/sethabitstatus/${id}`, {
            method: "POST",
            body: JSON.stringify({ checked: true }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const parseJSON = await response.json();
        console.log("parse JSON", parseJSON);
        setHabitStatus([...habitStatus]);
        // setStatus([...status, parseJSON]);
        console.log("status", status);
        setProcess(process + 1);
    }

    async function resetHabit() {
        const response = await fetch(`/api/reset-habit/${id}`, {
            method: "POST",
        });
        const reset = await response.json();
        console.log("reset", reset);
        setHabitStatus([]);
        setHabit([]);
        setProcess(0);
        navigate("/");
    }
    // console.log("habitStatus", habitStatus);
    // console.log("status", status);

    // async function deleteHabit() {
    //     console.log("del clicked");
    //     const response = await fetch(`/api/delete-habit/${id}`, {
    //         method: "POST",
    //     });
    //     const remove = await response.json();
    //     console.log("remove", remove);

    //     navigate("/");
    // }
    console.log("week streak", process);
    return (
        <>
            {/* <MotivationalModalFinish /> */}
            {/* <MotivationalModal /> */}
            {cheerModal && (
                <MotivationalModal
                    cheerModal={cheerModal}
                    closeCheerModal={closeCheerModal}
                />
            )}
            {habit.week_streak === 28 && (
                <MotivationalModalFinish
                    cheerModal={cheerModal}
                    closeCheerModal={closeCheerModal}
                />
            )}
            <section className="habit">
                <div className="habitHead">
                    <h2>{habit.habit_name}</h2>

                    <div
                        className="progressCircle"
                        style={{ width: 50, height: 50 }}
                    >
                        <CircularProgressbar
                            value={process}
                            minValue={0}
                            maxValue={28}
                            styles={buildStyles({
                                pathColor: "#7e3559",
                                trailColor: "#ffc0788f",
                                strokeLinecap: "butt",
                            })}
                        />
                    </div>
                </div>

                <ul className="habitOverview">
                    {habitStatus.map((day, idx) => {
                        let className;
                        // let imgUrl;

                        // if ((idx === day.checked) === true) {
                        //     className = `day checked`;
                        // } else
                        if (day.checked === "active") {
                            className = `day ${checkBox}`;
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
                {/* <p>
                    Week-Streak: {habit.week_streak}/7 {weekScore}
                </p> */}
                {/* <p> Month-Streak: {habit.month_streak}/28</p> */}
                <button onClick={resetHabit}>RESET</button>
                {/* <button onClick={() => deleteHabit(id)}> DELETE Habit</button> */}
            </section>
        </>
    );
}
