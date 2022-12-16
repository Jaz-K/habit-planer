import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function ScoreBoard() {
    const [allScores, setAllScores] = useState([]);

    useEffect(() => {
        socket.on("scoreboard", function getScores(scores) {
            console.log("SCORES", scores);
            setAllScores(scores);
        });
    }, []);

    return (
        <div>
            <h2>Highscores</h2>
            <ul>
                {allScores.map((score) => (
                    <li key={score.user_id}>
                        {score.nick_name} {score.score}
                    </li>
                ))}
            </ul>
        </div>
    );
}
