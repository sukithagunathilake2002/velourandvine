import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/UserProfile.css"; // ✅ Import the scoped CSS

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
          });
        }
      } catch (err) {
        setError("Failed to fetch user details");
        console.error("Error fetching user:", err.response?.data?.message || err);
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put("http://localhost:5000/api/user/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile updated successfully!");
      setUser({ ...user, ...formData });
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

    // ✅ Delete Profile Function
    const handleDeleteProfile = async () => {
      const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");
      
      if (!confirmDelete) return;
  
      try {
        await axios.delete("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        alert("Profile deleted successfully!");
        
        // ✅ Clear local storage and redirect to register page
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/register");
      } catch (err) {
        setError("Failed to delete profile. Please try again.");
        console.error("Delete error:", err);
      }
    };

      // ✅ Logout Function
    const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    alert("You have been logged out.");
    navigate("/login");
  };

  return (
    <div className="user-profile"> {/* ✅ Scoped styles */}
      <div className="profile-container">
        <h2>User Profile</h2>
        {error && <p className="error-message">{error}</p>}

        {user ? (
          <>
            <div>
              <label>Name:</label>
              {isEditing ? (
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              ) : (
                <p>{user.name}</p>
              )}
            </div>
            <div>
              <label>Email:</label>
              <p>{user.email}</p>
            </div>
            <div>
              <label>Phone:</label>
              {isEditing ? (
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
              ) : (
                <p>{user.phone}</p>
              )}
            </div>

            {isEditing ? (
              <>
                <button onClick={handleUpdate} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
              <button className="delete-btn" onClick={handleDeleteProfile}>Delete Profile</button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
