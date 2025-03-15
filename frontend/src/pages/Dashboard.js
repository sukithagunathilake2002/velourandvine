import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null; // ✅ Prevent rendering if user is not logged in

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md">
      <h2 className="text-2xl font-bold">Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
    </div>
  );
};

export default Dashboard;
