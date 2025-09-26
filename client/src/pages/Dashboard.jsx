import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { roomService } from '../services/roomService';
import { useLocation } from 'wouter';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [, navigate] = useLocation();

  return (
    <div style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
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
        <h2>Rooms</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
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
            onClick={async () => {
              try {
                const name = prompt('Enter a name for your room:', 'My Room');
                if (!name || !name.trim()) return;
                const created = await roomService.createRoom({ name: name.trim(), createdBy: user?.id || '' });
                if (!created?.id && created?._id) {
                  // Handle Mongo default _id
                  navigate(`/room/${created._id}`);
                } else {
                  navigate(`/room/${created.id}`);
                }
              } catch (e) {
                alert(e?.message || 'Failed to create room');
              }
            }}
          >
            + Create Room
          </button>
          <button
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              background: '#2d333b',
              color: '#adbac7',
              border: '1px solid #444c56',
              borderRadius: 4,
              cursor: 'pointer'
            }}
            onClick={() => {
              const id = prompt('Enter room ID to join:');
              if (id && id.trim()) navigate(`/room/${id.trim()}`);
            }}
          >
            ↪ Join Room
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
