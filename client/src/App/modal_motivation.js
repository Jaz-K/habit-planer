export default function MotivationalModal({ closeCheerModal }) {
    console.log("close cheer modal", closeCheerModal);
    return (
        <section className="modal modalMotivation">
            <button onClick={closeCheerModal} className="modalCloseButton">
                ✖
            </button>
            <h2>You got it!</h2>
            <h3>Keep it up!</h3>
            <img src="/illu_cheer_2.svg" alt="" />
            <button onClick={closeCheerModal}>Close</button>
        </section>
    );
}
