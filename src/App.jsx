import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ProtectedRoute } from "./components/protectedRoute"
import Login from "./pages/login";
import Forgot from "./pages/forgot";
import Search from "./pages/search";
import ViewRecord from "./pages/ViewRecord";
import ViewProfile from "./pages/ViewProfile";
import AddRecord from "./pages/AddRecord";
import AddRecordTest from "./pages/AddRecordTest"; //to be removed\
import AddRecordFinal from "./pages/AddRecordFinal";
import ArchiveRecord from "./pages/ArchiveRecord";
import Payroll from "./pages/Payroll";
import PayrollFinal from "./pages/PayrollFinal";
import NotFound from "./pages/not-found";
import DTR from "./pages/DTR"
import EmployeeProfile from "./pages/EmployeeProfile"
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
                    <Route path="/ViewRecord/:searchQuery" element={
                        <ProtectedRoute user={user}>
                            <ViewRecord />
                        </ProtectedRoute>
                    } />
                    <Route path="/ViewRecord" element={
                        <ProtectedRoute user={user}>
                            <ViewRecord />
                        </ProtectedRoute>
                    } />

                    <Route path="/ViewProfile/:employeeID" element={
                        <ProtectedRoute user={user}>
                            <ViewProfile />
                        </ProtectedRoute>
                    }/>

                    <Route path="/AddRecord" element={
                        <ProtectedRoute user={user}>
                            <AddRecord  />
                        </ProtectedRoute>
                    } />
                    <Route path="/AddRecordTest" element={// to be removed
                        <ProtectedRoute user={user}>
                            <AddRecordTest />
                        </ProtectedRoute>
                    } />
                    <Route path="/AddRecordFinal" element={// FINAL VERSION
                        <ProtectedRoute user={user}>
                            <AddRecordFinal />
                        </ProtectedRoute>
                    } />
                    <Route path="/Payroll" element={
                        <ProtectedRoute user={user}>
                            <Payroll />
                        </ProtectedRoute>
                    } />
                    <Route path="/PayrollFinal" element={ //to be final version
                        <ProtectedRoute user={user}>
                            <PayrollFinal />
                        </ProtectedRoute>
                    } />
                    <Route path="/ArchiveRecord" element={
                        <ProtectedRoute user={user}>
                            <ArchiveRecord />
                        </ProtectedRoute>
                    } />
                    <Route path="/EmployeeProfile" element={
                        <ProtectedRoute user={user}>
                            <EmployeeProfile />
                        </ProtectedRoute>
                    } />
                    <Route path="/EmployeeProfile/:userEmployeeID" element={
                        <ProtectedRoute user={user}>
                            <EmployeeProfile />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />}/>
                    <Route path="/DTR" element={<DTR />}/>
                </Routes>
            </Router>
        </div>
    )
}
 
export default App;