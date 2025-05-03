import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log("User loaded from localStorage:", parsedUser); // ✅ Debug
      console.log("Token loaded from localStorage:", token); // ✅ Debug
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      console.log("Login response:", data); // ✅ Debug
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);
      console.log("User set in AuthContext:", data.user); // ✅ Confirm
      return { success: true, message: "Login successful" };
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
      return { success: false, message: error.response?.data?.message || "Login failed" };
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

      console.log("Register response:", data); // ✅ Debug
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);
      console.log("User set in AuthContext:", data.user); // ✅ Confirm
      return { success: true, message: "Registration successful" };
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    }
  };

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
    console.log("User logged out, state cleared"); // ✅ Debug
  };

  return (
    <AuthContext.Provider value={{ user, login, register, forgotPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };