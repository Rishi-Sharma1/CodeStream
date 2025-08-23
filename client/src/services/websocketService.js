import { useState, useEffect, useCallback } from 'react';

export function useWebSocket() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback((roomId) => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Join room
      ws.send(JSON.stringify({
        type: 'join-room',
        roomId,
        userId: 'user-' + Math.random().toString(36).substring(2, 9)
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('WebSocket message received:', message);
        
        // Handle different message types
        switch (message.type) {
          case 'code-change':
            // Handle real-time code changes
            break;
          case 'cursor-position':
            // Handle cursor position updates
            break;
          case 'user-joined':
          case 'user-left':
            // Handle user presence updates
            break;
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    setSocket(ws);
  }, []);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  return {
    connect,
    disconnect,
    sendMessage,
    isConnected
  };
}
