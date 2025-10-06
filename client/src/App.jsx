import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { Button } from "@/components/ui/button";
import { SpinnerCustom } from "@/components/ui/spinner";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div className="flex flex-col justify-center text-center grid justify-items-center">
                <div>
                    <a href="https://vite.dev" target="_blank">
                        <img src={viteLogo} alt="Vite logo" />
                    </a>
                    <a href="https://react.dev" target="_blank">
                        <img src={reactLogo} alt="React logo" />
                    </a>
                </div>
                <h1>Vite + React</h1>
                <div>
                    <Button
                        variant="outline"
                        onClick={() => setCount((count) => count + 1)}
                    >
                        count is {count}
                    </Button>
                    <p>
                        Edit <code>src/App.jsx</code> and save to test HMR
                    </p>
                </div>
                <SpinnerCustom />
                <p>Click on the Vite and React logos to learn more</p>
            </div>
        </>
    );
}

export default App;
