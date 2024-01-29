import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import Login from "./pages/login";
import Forgot from "./pages/forgot";
import Search from "./pages/search";

const App = () => {
    return (
        <div className="app">
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/forgot" element={<Forgot />} />
                    <Route path="/search" element={<Search />} />
                </Routes>
            </Router>
        </div>
    )
}
 
export default App;