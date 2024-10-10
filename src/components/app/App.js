import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../app_header/Header";

const App = () => {
    return (
        <Router>
            <div className="app">
                <Header/>
                <main>
                    <Routes>
                        
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App;