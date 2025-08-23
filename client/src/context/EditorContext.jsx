import { createContext, useContext, useReducer, useCallback } from 'react';

const EditorContext = createContext();

const initialState = {
  currentRoom: null,
  files: [],
  openFiles: [],
  activeFile: null,
  users: [],
  chatMessages: [],
  isChatOpen: false,
  connectionStatus: 'disconnected',
  showNewFileModal: false,
};

function editorReducer(state, action) {
  switch (action.type) {
    case 'SET_ROOM':
      return { ...state, currentRoom: action.payload };
    case 'SET_FILES':
      return { ...state, files: action.payload };
    case 'ADD_FILE':
      return { ...state, files: [...state.files, action.payload] };
    case 'UPDATE_FILE':
      return {
        ...state,
        files: state.files.map(file => 
          file.id === action.payload.id ? action.payload : file
        ),
      };
    case 'DELETE_FILE':
      return {
        ...state,
        files: state.files.filter(file => file.id !== action.payload),
        openFiles: state.openFiles.filter(file => file.id !== action.payload),
        activeFile: state.activeFile?.id === action.payload ? null : state.activeFile,
      };
    case 'OPEN_FILE':
      const existingFile = state.openFiles.find(f => f.id === action.payload.id);
      if (existingFile) {
        return { ...state, activeFile: action.payload };
      }
      return {
        ...state,
        openFiles: [...state.openFiles, action.payload],
        activeFile: action.payload,
      };
    case 'CLOSE_FILE':
      const newOpenFiles = state.openFiles.filter(file => file.id !== action.payload);
      return {
        ...state,
        openFiles: newOpenFiles,
        activeFile: state.activeFile?.id === action.payload 
          ? (newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null)
          : state.activeFile,
      };
    case 'SET_ACTIVE_FILE':
      return { ...state, activeFile: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_CHAT_MESSAGES':
      return { ...state, chatMessages: action.payload };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case 'TOGGLE_CHAT':
      return { ...state, isChatOpen: !state.isChatOpen };
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    case 'TOGGLE_NEW_FILE_MODAL':
      return { ...state, showNewFileModal: !state.showNewFileModal };
    default:
      return state;
  }
}

export function EditorProvider({ children }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const actions = {
    setRoom: useCallback((room) => dispatch({ type: 'SET_ROOM', payload: room }), []),
    setFiles: useCallback((files) => dispatch({ type: 'SET_FILES', payload: files }), []),
    addFile: useCallback((file) => dispatch({ type: 'ADD_FILE', payload: file }), []),
    updateFile: useCallback((file) => dispatch({ type: 'UPDATE_FILE', payload: file }), []),
    deleteFile: useCallback((fileId) => dispatch({ type: 'DELETE_FILE', payload: fileId }), []),
    openFile: useCallback((file) => dispatch({ type: 'OPEN_FILE', payload: file }), []),
    closeFile: useCallback((fileId) => dispatch({ type: 'CLOSE_FILE', payload: fileId }), []),
    setActiveFile: useCallback((file) => dispatch({ type: 'SET_ACTIVE_FILE', payload: file }), []),
    setUsers: useCallback((users) => dispatch({ type: 'SET_USERS', payload: users }), []),
    setChatMessages: useCallback((messages) => dispatch({ type: 'SET_CHAT_MESSAGES', payload: messages }), []),
    addChatMessage: useCallback((message) => dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message }), []),
    toggleChat: useCallback(() => dispatch({ type: 'TOGGLE_CHAT' }), []),
    setConnectionStatus: useCallback((status) => dispatch({ type: 'SET_CONNECTION_STATUS', payload: status }), []),
    toggleNewFileModal: useCallback(() => dispatch({ type: 'TOGGLE_NEW_FILE_MODAL' }), []),
  };

  return (
    <EditorContext.Provider value={{ ...state, ...actions }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
