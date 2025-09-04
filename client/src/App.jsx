import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { EditorProvider } from "./context/EditorContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { useAuthInit } from "./hooks/useAuthInit.js";
import Home from "@/pages/Home.jsx";
import Landing from "@/pages/Landing.jsx";
import Profile from "@/pages/Profile.jsx";
import NotFound from "@/pages/not-found.jsx";
import Dashboard from "@/pages/Dashboard.jsx";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-github-bg text-github-text flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-github-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profile" component={Profile} />
      <Route path="/room/:roomId" component={Home} />
      <Route path="/dashboard" component={Dashboard}/>
      <Route component={NotFound} />
      
    </Switch>
  );
}

function AuthenticatedApp() {
  useAuthInit();
  
  return (
    <EditorProvider>
      <Router />
    </EditorProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <AuthenticatedApp />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
