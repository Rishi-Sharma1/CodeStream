import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <h1>Welcome to CodeStream!</h1>
      <section style={{ marginBottom: '2rem' }}>
        <h2>User Info</h2>
        <p><strong>Name:</strong> {user?.username || 'Guest'}</p>
        <p><strong>Email:</strong> {user?.email || 'Not logged in'}</p>
      </section>
      <section style={{ marginBottom: '2rem' }}>
        <h2>Site Details</h2>
        <ul>
          <li>Collaborative code editing</li>
          <li>Real-time chat</li>
          <li>File management</li>
          <li>Secure sessions</li>
        </ul>
      </section>
      <section>
        <h2>Create a Room</h2>
        <button
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
          onClick={() => {
            // You can open a modal or navigate to a room creation page here
            alert('Room creation coming soon!');
          }}
        >
          + Create Room
        </button>
      </section>
    </div>
  );
};

export default Dashboard;
