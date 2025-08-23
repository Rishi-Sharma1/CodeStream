import { Copy, UserPlus, LogOut } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Header() {
  const { currentRoom, users, connectionStatus } = useEditor();
  const { toast } = useToast();

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(currentRoom?.id || '');
      toast({
        title: "Room ID copied!",
        description: "Room ID has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy room ID to clipboard",
        variant: "destructive",
      });
    }
  };

  const inviteUsers = () => {
    toast({
      title: "Invite link ready!",
      description: `Share this URL: ${window.location.origin}/room/${currentRoom?.id}`,
    });
  };

  const leaveRoom = () => {
    window.location.href = '/';
  };

  return (
    <header 
      className="bg-github-surface border-b border-github-border px-4 py-3 flex items-center justify-between"
      data-testid="header-main"
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <i className="fas fa-code text-github-primary text-xl"></i>
          <h1 className="text-xl font-semibold text-github-text">CodeCollab</h1>
        </div>
        <div className="h-6 w-px bg-github-border"></div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-github-text-secondary">Room:</span>
          <span 
            className="bg-github-bg px-2 py-1 rounded text-sm font-mono text-github-text"
            data-testid="room-id"
          >
            {currentRoom?.id}
          </span>
          <button
            onClick={copyRoomId}
            className="text-github-text-secondary hover:text-github-text transition-colors p-1"
            title="Copy room ID"
            data-testid="button-copy-room-id"
          >
            <Copy size={12} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {users.slice(0, 3).map((user, index) => (
              <div
                key={user.id || index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-github-surface ${
                  index === 0 ? 'bg-github-primary' :
                  index === 1 ? 'bg-github-success' : 'bg-github-warning'
                }`}
                data-testid={`user-avatar-${index}`}
              >
                {user.username ? user.username.slice(0, 2).toUpperCase() : 'U'}
              </div>
            ))}
          </div>
          <span className="text-sm text-github-text-secondary" data-testid="users-count">
            {users.length} online
          </span>
        </div>
        
        <div className="h-6 w-px bg-github-border"></div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={inviteUsers}
            className="bg-github-primary hover:bg-blue-600 text-white"
            size="sm"
            data-testid="button-invite"
          >
            <UserPlus size={14} className="mr-1" />
            Invite
          </Button>
          <Button
            onClick={leaveRoom}
            variant="outline"
            size="sm"
            className="bg-github-surface hover:bg-gray-700 border-github-border text-github-text"
            data-testid="button-leave"
          >
            <LogOut size={14} className="mr-1" />
            Leave Room
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-github-text-secondary">
          <span className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              connectionStatus === 'connected' ? 'bg-github-success' : 'bg-github-danger'
            }`}></div>
            {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </header>
  );
}
