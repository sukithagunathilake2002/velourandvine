import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
    }
  };

  const register = async (name, email, phone, password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const { data } = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        phone,
        password,
        confirmPassword,
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
    }
  };

  // ✅ Forgot Password Function
  const forgotPassword = async (email, newPassword, confirmPassword) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
        newPassword,
        confirmPassword,
      });

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Something went wrong." };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, forgotPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
