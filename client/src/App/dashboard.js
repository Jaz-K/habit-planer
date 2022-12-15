import { ScoreBoard } from "./scoreboard";
import { HabitBoard } from "./habitboard";
import { Profile } from "./profile";

export function Dashboard(user) {
    console.log("User", user);
    return (
        <section className="dashboard">
            <Profile {...user} />
            <HabitBoard />
            <ScoreBoard />
        </section>
    );
}
