import { createRoot } from "react-dom/client";
import { connect } from "./socket";

import Welcome from "./Welcome/welcome";
import App from "./App/app";

const root = createRoot(document.querySelector("main"));
fetch("/api/user/me")
    .then((response) => response.json())
    .then((data) => {
        if (!data) {
            console.log("Data", data);
            root.render(<Welcome />);
        } else {
            connect();
            root.render(<App />);
        }
    });
