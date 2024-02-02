import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ProtectedRoute } from "./components/protectedRoute"
import Login from "./pages/login";
import Forgot from "./pages/forgot";
import Search from "./pages/search";
import ViewRecord from "./pages/ViewRecord";
import NotFound from "./pages/not-found";
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
                    <Route path="*" element={<NotFound />}/>
                </Routes>
            </Router>
        </div>
    )
}
 
export default App;