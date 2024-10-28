import { useDispatch } from "react-redux";
import "./App.css";
import Routers from "./Routes/Routers";
import { useEffect } from "react";
import { setUserRole } from "./components/State/Authentication/Action";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem("role");
  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "2";
    dispatch(setUserRole(storedRole));
  }, [dispatch]);
  return (
    <div>
      <Routers />
    </div>
  );
}

export default App;
