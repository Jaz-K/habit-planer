import { Link } from "react-router-dom";

export default function ScoreBoard({ allScores, avatar }) {
    console.log("allScores", allScores);
    return (
        <div className="scoreboard">
            <h2>Highscores</h2>
            <ul>
                {allScores.map((score, idx) => (
                    <Link to={`/users/${score.user_id}`} key={score.user_id}>
                        <li className="scoreList">
                            <div className="scoreUser">
                                <img
                                    className="scoreImg circle"
                                    src={score.img_url ? score.img_url : avatar}
                                    alt={score.nick_name}
                                />
                                <p className="place">{idx + 1}. </p>
                                <p>{score.nick_name}</p>
                            </div>
                            <p>{score.score}</p>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}
