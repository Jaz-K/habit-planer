import ScoreBoard from "./scoreboard";
import HabitBoard from "./habitboard";
import Profile from "./profile";

export default function Dashboard({ user, avatar, habits }) {
    // const { created_at } = habits;
    // console.log("created_at", avatar);
    // console.log("habits dashboard", habits);
    // console.log("User", user);
    return (
        <section className="dashboard">
            <Profile {...user} avatar={avatar} />
            <HabitBoard habits={habits} />
            <ScoreBoard />
        </section>
    );
}
