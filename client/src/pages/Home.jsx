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
  const { user } = useAuth();
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
    if (roomId) {
      // Load room data
      roomService.getRoom(roomId)
        .then(room => {
          setRoom(room);
          return fileService.getFiles(roomId);
        })
        .then(files => {
          setFiles(files);
        })
        .catch(console.error);

      // Connect to WebSocket
      connect(roomId);
      
      return () => {
        disconnect();
      };
    } else {
      // Generate new room
      const newRoom = roomService.generateRoom(user?.id);
      setRoom(newRoom);
      window.history.replaceState(null, '', `/room/${newRoom.id}`);
    }
  }, [roomId, setRoom, setFiles, connect, disconnect, user?.id]);

  useEffect(() => {
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
  }, [isConnected, setConnectionStatus]);

  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-github-bg text-github-text flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-github-primary mx-auto mb-4"></div>
          <p>Loading room...</p>
        </div>
      </div>
    );
  }

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
