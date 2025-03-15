import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateUserProfilePage = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Fetch user details when the component mounts
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.user) {
          setUser(data.user);
          setFormData({
            name: data.user.name || "",
            phone: data.user.phone || "",
            email: data.user.email || "",
            password: "",
          });
        }
      } catch (err) {
        setError("Failed to fetch user details");
        console.error("Error fetching user:", err.response?.data?.message || err);
      }
    };

    fetchUser();
  }, [token, navigate]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put("http://localhost:5000/api/user/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Update Your Profile</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user ? (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>New Password (leave blank to keep current password):</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UpdateUserProfilePage;
