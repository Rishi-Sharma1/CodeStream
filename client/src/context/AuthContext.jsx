import { createContext, useContext, useReducer, useCallback } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        isLoading: false
      };
    case 'CLEAR_USER':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false,
        isLoading: false
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const actions = {
    setUser: useCallback((user) => dispatch({ type: 'SET_USER', payload: user }), []),
    clearUser: useCallback(() => dispatch({ type: 'CLEAR_USER' }), []),
    setLoading: useCallback((loading) => dispatch({ type: 'SET_LOADING', payload: loading }), []),
  };

  return (
    <AuthContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}