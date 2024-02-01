import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ProtectedRoute } from "./components/protectedRoute"
import Login from "./pages/login";
import Forgot from "./pages/forgot";
import Search from "./pages/search";
import ViewRecord from "./pages/ViewRecord";
<<<<<<< Updated upstream
import { useEffect, useState } from "react";
=======
import AddRecord from "./pages/AddRecord";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
                    <Route path="/search" element={
                        <ProtectedRoute user={user}>
                            <Search />
                        </ProtectedRoute>
                    } />
                    <Route path="/ViewRecord" element={
                        <ProtectedRoute user={user}>
                            <ViewRecord />
                        </ProtectedRoute>
                    } />
=======
                    <Route path="/search" element={<Search />} />
                    <Route path="/ViewRecord" element={<ViewRecord />} />
                    <Route path="/AddRecord" element={<AddRecord />} />
>>>>>>> Stashed changes
                </Routes>
            </Router>
        </div>
    )
}
 
export default App;