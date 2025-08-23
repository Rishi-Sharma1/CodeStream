import { useState } from 'react';
import { MessageCircle, Folder } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import FileExplorer from './FileExplorer';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('files');
  const { toggleChat, chatMessages } = useEditor();

  const handleChatClick = () => {
    setActiveTab('chat');
    toggleChat();
  };

  const unreadCount = chatMessages.filter(msg => !msg.read).length;

  return (
    <aside className="w-80 bg-github-surface border-r border-github-border flex flex-col" data-testid="sidebar-main">
      {/* Tab Headers */}
      <div className="border-b border-github-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-r border-github-border transition-colors ${
              activeTab === 'files'
                ? 'bg-github-bg text-github-text'
                : 'text-github-text-secondary hover:text-github-text hover:bg-github-bg'
            }`}
            data-testid="tab-files"
          >
            <Folder size={16} className="mr-2 inline" />
            Files
          </button>
          <button
            onClick={handleChatClick}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'chat'
                ? 'bg-github-bg text-github-text'
                : 'text-github-text-secondary hover:text-github-text hover:bg-github-bg'
            }`}
            data-testid="tab-chat"
          >
            <MessageCircle size={16} className="mr-2 inline" />
            Chat
            {unreadCount > 0 && (
              <span className="ml-1 bg-github-danger text-white text-xs rounded-full px-1.5 py-0.5">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'files' && <FileExplorer />}
    </aside>
  );
}
