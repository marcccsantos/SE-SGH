import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import Login from "./pages/login";
import Forgot from "./pages/forgot";

const App = () => {
    return (
        <div className="app">
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/forgot" element={<Forgot />} />
                </Routes>
            </Router>
        </div>
    )
}
 
export default App;