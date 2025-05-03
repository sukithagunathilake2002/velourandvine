import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminMessageList() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/contact');
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this message?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/contact/${id}`);
      fetchMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const handleReply = async (id) => {
    const replyText = window.prompt("Enter your reply:");
  
    if (replyText && replyText.trim()) {
      try {
        await axios.put(`http://localhost:5000/api/contact/${id}`, {
          reply: replyText.trim()
        });
        fetchMessages(); // Refresh table
        window.alert("Your reply has been sent successfully! ✅"); // ✅ Success popup
      } catch (err) {
        alert("❌ Failed to send reply.");
      }
    }
  };
  

  useEffect(() => {
    fetchMessages();
  }, []);

  const filtered = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.phone.includes(search)
  );

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Admin Message Viewer</h2>

      <input
        type="text"
        placeholder="Search by name, email, or phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '8px', marginBottom: '1rem', width: '100%', maxWidth: '400px' }}
      />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Phone</th>
              <th style={th}>Message</th>
              <th style={th}>Reply Status</th>
              <th style={th}>Date</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>No messages found</td></tr>
            ) : (
              filtered.map((msg) => (
                <tr key={msg._id}>
                  <td style={td}>{msg.name}</td>
                  <td style={td}>{msg.email}</td>
                  <td style={td}>{msg.phone}</td>
                  <td style={td}>{msg.message}</td>
                  <td style={td}>
                    {msg.reply ? (
                      <span>{msg.reply}</span>
                    ) : (
                      <span style={{ color: 'orange' }}>Pending</span>
                    )}
                  </td>
                  <td style={td}>{new Date(msg.createdAt).toLocaleString()}</td>
                  <td style={td}>
                    <button
                      onClick={() => handleReply(msg._id)}
                      style={{ marginRight: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px' }}
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      style={{ backgroundColor: 'crimson', color: 'white', border: 'none', padding: '5px 10px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Table styling
const th = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'left'
};

const td = {
  border: '1px solid #ccc',
  padding: '10px',
  verticalAlign: 'top'
};

export default AdminMessageList;
