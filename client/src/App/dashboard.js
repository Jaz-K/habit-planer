import ScoreBoard from "./scoreboard";
import HabitBoard from "./habitboard";
import Profile from "./profile";
import Quote from "./quote";
import HabitModal from "./createHabitModal";

export default function Dashboard({
    user,
    setUser,
    avatar,
    habits,
    setHabits,
    onClose,
    modal,
    setModal,
    shroud,
    setShroud,
    allScores,
    setAllScores,
    onBioUpdate,
    currentScore,
    deleteHabit,
    closeAvatarModal,
    chooseAvatar,
    avatarModal,
}) {
    return (
        <>
            <section className="dashboard">
                {modal && (
                    <HabitModal
                        onClose={onClose}
                        setHabits={setHabits}
                        habits={habits}
                    />
                )}
                <Profile
                    {...user}
                    avatar={avatar}
                    onBioUpdate={onBioUpdate}
                    currentScore={currentScore}
                    habits={habits}
                    onClose={onClose}
                    setModal={setModal}
                    modal={modal}
                    setUser={setUser}
                    setShroud={setShroud}
                    closeAvatarModal={closeAvatarModal}
                    chooseAvatar={chooseAvatar}
                    avatarModal={avatarModal}
                />
                <HabitBoard
                    habits={habits}
                    onClose={onClose}
                    modal={modal}
                    setModal={setModal}
                    shroud={shroud}
                    setShroud={setShroud}
                    user={user}
                    setHabits={setHabits}
                    deleteHabit={deleteHabit}
                />
                <ScoreBoard
                    allScores={allScores}
                    setAllScores={setAllScores}
                    avatar={avatar}
                />
                <Quote />
            </section>
        </>
    );
}
