import { useEffect, useState } from "react";
export default function Quote() {
    const [quote, setQuote] = useState("");
    useEffect(() => {
        ///TEST MOTIVATIONAL INSPIRATIONAL QUOTES
        async function qupotes() {
            const response = await fetch("https://type.fit/api/quotes");
            const quote = await response.json();
            // console.log("Quote Api", quote[240].text);
            const randomNum = Math.floor(Math.random() * 1643 + 1);
            setQuote(quote[randomNum].text);
        }
        qupotes();
    }, []);
    return (
        <div className="quote">
            <p>~ {quote} ~</p>
        </div>
    );
}
