import { useState } from "react";
import "./App.css";
import People from "@src/component/people/People";

function App() {
    const [counter, setCounter] = useState(0);

    return (
        <>
            <div className="hero">
                <h1>Fetching data on API's</h1>
            </div>
            <div>
                <button onClick={() => setCounter(counter + 1)}>increment</button>
                <p>Counter: {counter}</p>
            </div>
            <People />
        </>
    );
}

export default App;
