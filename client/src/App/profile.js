import EditBio from "./editBio";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function Profile({
    first_name,
    last_name,
    img_url,
    nick_name,
    bio,
    avatar,
    onBioUpdate,
    currentScore,
    habits,
}) {
    useEffect(() => {
        //GET SCORES BY USER ID
    }, []);
    const { otherId } = useParams();
    return (
        <div className="profile">
            <div className="profileInfo">
                <img
                    src={img_url ? img_url : avatar}
                    alt={`${first_name} ${last_name}`}
                />
                <div>
                    <h4>{nick_name}</h4>
                    <p>
                        {first_name} {last_name}
                    </p>
                </div>
            </div>
            <div className="personalScore">
                <h4>My Goals</h4>
                {!bio && <p>Nothing here yet!</p>}
                {!otherId && <EditBio bio={bio} onBioUpdate={onBioUpdate} />}
                {/* <div>
                    <img src="./default_icon.png" alt="" />
                    <h4>{currentScore.score}</h4>
                    <h4>POINTS</h4>
                </div> */}
            </div>
            <div className="statistic">
                <ul>
                    <li>
                        <img src="./star.svg" alt="" />
                        <p className="statisticCounter">{currentScore.score}</p>
                        <p className="profileStatistic">Scored Points</p>
                    </li>
                    <li>
                        <img src="./track.svg" alt="" />
                        <p className="statisticCounter">
                            {currentScore.tracked_day}
                        </p>
                        <p className="profileStatistic">Tracked days</p>
                    </li>
                    <li>
                        <img src="./cup.svg" alt="" />
                        <p className="statisticCounter">
                            {currentScore.tracked_day}
                        </p>
                        <p className="profileStatistic">Finished habits</p>
                    </li>
                    <li>
                        <img src="./active_habits.svg" alt="" />
                        <p className="statisticCounter">{habits.length}</p>
                        <p className="profileStatistic">Active Habits</p>
                    </li>
                </ul>
            </div>
        </div>
    );
}
