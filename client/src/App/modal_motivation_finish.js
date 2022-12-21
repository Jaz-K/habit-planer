export default function MotivationalModalFinish({
    // cheerModal,
    closeCheerModal,
}) {
    return (
        <section className="modal modalMotivation">
            <button onClick={closeCheerModal} className="modalCloseButton">
                ✖
            </button>
            <h2>Yaaay 28 days done!</h2>
            <h3>Start your next habit.</h3>
            <img
                src="/illu_cheer.svg"
                alt="habit tracker full streak"
                // className="modalMotivation"
            />
            <button onClick={closeCheerModal}>Close</button>
        </section>
    );
}
