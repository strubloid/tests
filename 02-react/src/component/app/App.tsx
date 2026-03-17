import { useState } from "react";
import "./App.css";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <section id="center">
                <div>
                    <h1>Get started</h1>
                </div>
            </section>

            <div className="ticks"></div>

            <section id="next-steps"></section>

            <div className="ticks"></div>
            <section id="spacer"></section>
        </>
    );
}

export default App;
