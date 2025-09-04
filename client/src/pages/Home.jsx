import { useEffect } from 'react';
import { useParams } from 'wouter';
import { useEditor } from '../context/EditorContext';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../services/websocketService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainEditor from '../components/MainEditor';
import ChatPanel from '../components/ChatPanel';
import NewFileModal from '../components/NewFileModal';
import Toast from '../components/Toast';
import { roomService } from '../services/roomService';
import { fileService } from '../services/fileService';

export default function Home() {
  const { roomId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { 
    currentRoom, 
    setRoom, 
    setFiles, 
    isChatOpen, 
    showNewFileModal,
    setConnectionStatus 
  } = useEditor();
  
  const { connect, disconnect, isConnected } = useWebSocket();

  useEffect(() => {
    console.log('Home useEffect triggered:', { roomId, isAuthenticated, user: user?.id });
    
    if (roomId) {
      // Only try to load room data if user is authenticated
      if (isAuthenticated) {
        console.log('Loading room data for authenticated user:', roomId);
        // Load room data
        roomService.getRoom(roomId)
          .then(room => {
            console.log('Room loaded successfully:', room);
            setRoom(room);
            return fileService.getFiles(roomId);
          })
          .then(files => {
            console.log('Files loaded successfully:', files);
            setFiles(files);
          })
          .catch(error => {
            console.error('Error loading room or files:', error);
            // If room doesn't exist, redirect to home
            window.history.replaceState(null, '', '/');
            setRoom(null);
            setFiles([]);
          });

        // Connect to WebSocket
        connect(roomId);
        
        return () => {
          console.log('Cleaning up room connection');
          disconnect();
        };
      } else {
        console.log('User not authenticated, clearing room data');
        // User not authenticated, clear any existing room data
        setRoom(null);
        setFiles([]);
        disconnect(); // Disconnect WebSocket if not authenticated
      }
    } else if (isAuthenticated) {
      // User is authenticated but no room ID - stay on home page
      console.log('User authenticated, staying on home page');
      setRoom(null);
      setFiles([]);
    }
  }, [roomId, isAuthenticated, setRoom, setFiles, connect, disconnect, user?.id]);

  // Cleanup effect to clear room data when authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      setRoom(null);
      setFiles([]);
      disconnect();
      
      // If there's a room ID in the URL but user is not authenticated, redirect to home
      if (roomId) {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [isAuthenticated, setRoom, setFiles, disconnect, roomId]);

  // Handle URL changes to clear room data when going back to home
  useEffect(() => {
    if (!roomId && currentRoom) {
      console.log('URL changed to home, clearing room data');
      setRoom(null);
      setFiles([]);
      disconnect();
    }
  }, [roomId, currentRoom, setRoom, setFiles, disconnect]);

  useEffect(() => {
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
  }, [isConnected, setConnectionStatus]);

  // Show loading or redirect to landing if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-github-bg text-github-text flex items-center justify-center">
        <div className="text-center">
          <p>Please log in to access rooms</p>
        </div>
      </div>
    );
  }

  // Show home page when no room is selected
  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-github-bg text-github-text">
        <Header />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-60px)]">
          <div className="text-center max-w-2xl mx-auto px-6">
            <h1 className="text-4xl font-bold mb-6 text-github-text">
              Welcome to CodeCollab
            </h1>
            <p className="text-xl text-github-text-secondary mb-8">
              Start coding together with your team in real-time
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const newRoom = roomService.generateRoom(user?.id);
                  setRoom(newRoom);
                  window.history.pushState(null, '', `/room/${newRoom.id}`);
                }}
                className="bg-github-primary hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Create New Room
              </button>
              
              <button
                onClick={() => {
                  const roomId = prompt('Enter room ID to join:');
                  if (roomId && roomId.trim()) {
                    window.history.pushState(null, '', `/room/${roomId.trim()}`);
                  }
                }}
                className="bg-github-surface hover:bg-gray-700 text-github-text border border-github-border px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Join Existing Room
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show room interface when a room is selected
  return (
    <div className="h-screen overflow-hidden bg-github-bg text-github-text font-sans">
      <Header />
      
      <div className="flex h-[calc(100vh-60px)]">
        <Sidebar />
        <MainEditor />
        {isChatOpen && <ChatPanel />}
      </div>

      {showNewFileModal && <NewFileModal />}
      <Toast />
    </div>
  );
}
