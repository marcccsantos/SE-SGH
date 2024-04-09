import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ProtectedRoute } from "./components/protectedRoute";
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
import DTR from "./pages/DTR";
import EmployeeProfile from "./pages/EmployeeProfile";
import EmployeePayRoll from "./pages/EmployeePayroll";
import Unauthorized from "./pages/Unauthorized";
import SearchProfile from "./pages/DefaultViewProfile";
import { useEffect, useState } from "react";
import Loading from "./components/loading";
import Test from "./pages/test";

const App = () => {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const storedUserRole = localStorage.getItem("userRole");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsFetching(false);
        return;
      }
      setUser(null);
      setIsFetching(false);
    });
    return () => unsubscribe();
  }, []);

  if (isFetching) {
    return <Loading />;
  }

  if (storedUserRole !== "admin") {
    localStorage.removeItem("userRole");
  }

  // Define routes based on user roles
  const adminRoutes = (
    <>
      {storedUserRole === "admin" ? (
        <>
          <Route
            path="/search"
            element={
              <ProtectedRoute user={user}>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ViewRecord/:searchQuery"
            element={
              <ProtectedRoute user={user}>
                <ViewRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ViewRecord"
            element={
              <ProtectedRoute user={user}>
                <ViewRecord />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ViewProfile"
            element={
              <ProtectedRoute user={user}>
                <SearchProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ViewProfile/:employeeID"
            element={
              <ProtectedRoute user={user}>
                <ViewProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/AddRecord"
            element={
              <ProtectedRoute user={user}>
                <AddRecordFinal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AddRecordTest"
            element={
              // to be removed
              <ProtectedRoute user={user}>
                <AddRecordTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AddRecordFinal"
            element={
              // FINAL VERSION
              <ProtectedRoute user={user}>
                <AddRecordFinal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Payroll"
            element={
              <ProtectedRoute user={user}>
                <PayrollFinal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PayrollFinal"
            element={
              //to be final version
              <ProtectedRoute user={user}>
                <PayrollFinal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ArchiveRecord"
            element={
              <ProtectedRoute user={user}>
                <ArchiveRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/DTR"
            element={
              <ProtectedRoute user={user}>
                <DTR />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test"
            element={
              <ProtectedRoute user={user}>
                <Test />
              </ProtectedRoute>
            }
          />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/Unauthorized" />} />
      )}
    </>
  );

  const employeeRoutes = (
    <>
      <Route
        path="/EmployeeProfile/:userEmployeeID"
        element={
          <ProtectedRoute user={user}>
            <EmployeeProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/EmployeePayroll/:userEmployeeID"
        element={
          <ProtectedRoute user={user}>
            <EmployeePayRoll />
          </ProtectedRoute>
        }
      />
    </>
  );

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot" element={<Forgot />} />
          {adminRoutes}
          {employeeRoutes}
          <Route path="*" element={<NotFound />} />
          <Route path="/Unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
