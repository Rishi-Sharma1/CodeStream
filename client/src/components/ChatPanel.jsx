import { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock users for demonstration
const mockUsers = [
  { id: '1', username: 'John Doe', avatar: 'JD', color: 'bg-github-primary' },
  { id: '2', username: 'Alice Smith', avatar: 'AS', color: 'bg-github-success' },
  { id: '3', username: 'Mike Kim', avatar: 'MK', color: 'bg-github-warning' },
];

export default function ChatPanel() {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { chatMessages, addChatMessage, toggleChat, currentRoom } = useEditor();

  // Mock messages for demonstration
  useEffect(() => {
    if (chatMessages.length === 0) {
      const mockMessages = [
        {
          id: '1',
          userId: '1',
          message: 'Working on the authentication module. Will push the changes soon!',
          createdAt: new Date(Date.now() - 300000),
          user: mockUsers[0]
        },
        {
          id: '2',
          userId: '2',
          message: 'Perfect! I\'m reviewing the UI components. Looking good so far 👍',
          createdAt: new Date(Date.now() - 120000),
          user: mockUsers[1]
        },
        {
          id: '3',
          userId: '3',
          message: 'Should we add error handling for the socket connection?',
          createdAt: new Date(Date.now() - 60000),
          user: mockUsers[2]
        }
      ];
      mockMessages.forEach(msg => addChatMessage(msg));
    }
  }, [chatMessages.length, addChatMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      userId: '1', // Current user
      roomId: currentRoom?.id,
      message: message.trim(),
      createdAt: new Date(),
      user: mockUsers[0] // Current user
    };

    addChatMessage(newMessage);
    setMessage('');
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <aside className="w-80 bg-github-surface border-l border-github-border flex flex-col" data-testid="chat-panel">
      {/* Chat Header */}
      <div className="p-4 border-b border-github-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-github-text">Team Chat</h3>
          <button
            onClick={toggleChat}
            className="text-github-text-secondary hover:text-github-text"
            data-testid="button-close-chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
        {chatMessages.map((msg) => (
          <div key={msg.id} className="flex items-start space-x-3">
            <div className={`w-8 h-8 ${msg.user?.color || 'bg-github-accent'} rounded-full flex items-center justify-center text-sm flex-shrink-0 text-white`}>
              {msg.user?.avatar || msg.user?.username?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-github-text">
                  {msg.user?.username || 'Unknown User'}
                </span>
                <span className="text-xs text-github-text-secondary">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
              <p className="text-sm text-github-text-secondary mt-1">
                {msg.message}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {chatMessages.length === 0 && (
          <div className="text-center py-8 text-github-text-secondary">
            <p>No messages yet</p>
            <p className="text-xs mt-1">Be the first to start the conversation!</p>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-github-border">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-github-bg border-github-border text-github-text focus:ring-github-primary"
            data-testid="input-chat-message"
          />
          <Button
            type="submit"
            className="bg-github-primary hover:bg-blue-600 text-white"
            size="sm"
            data-testid="button-send-message"
          >
            <Send size={16} />
          </Button>
        </form>
      </div>
    </aside>
  );
}
