import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ProtectedRoute } from "./components/protectedRoute"
import Login from "./pages/login";
import Forgot from "./pages/forgot";
import Search from "./pages/search";
import AddRecord from "./pages/AddRecord";
import ViewRecord from "./pages/ViewRecord";
import { useEffect, useState } from "react";

const App = () => {
    const [user, setUser] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    useEffect (() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
                setUser(user);
                setIsFetching(false);
                return;
            }
            setUser(null);
            setIsFetching(false);
        });
        return () => unsubscribe();
    }, []);

    if(isFetching){
        return <h2>Loading...</h2>
    }

    return (
        <div className="app">
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/forgot" element={<Forgot />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/ViewRecord" element={<ViewRecord />} />
                    <Route path="/AddRecord" element={<AddRecord />} />
                </Routes>
            </Router>
        </div>
    )
}
 
export default App;