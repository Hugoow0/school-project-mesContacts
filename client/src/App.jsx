import { Link } from "react-router";
import "./App.css";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <p>Welcome to MesContacts</p>
                <div>
                    <Link to="/auth/login" className="App-link">
                        Login
                    </Link>
                    {" | "}
                    <Link to="/auth/register" className="App-link">
                        Register
                    </Link>
                </div>
            </header>
        </div>
    );
}

export default App;
