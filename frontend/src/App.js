import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import LoginButton from "./components/LoginButton";
import authService from "./services/authService";
import socketService from "./services/socketService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check auth state and initialize socket
  useEffect(() => {
    const checkAuth = () => {
      const authState = authService.isAuthenticated();
      console.log("Auth state check:", authState);
      setIsAuthenticated(authState);
      
      if (authState) {
        // Initialize socket connection
        console.log("Initializing socket from App");
        socketService.initializeSocket();
      }
    };
    
    // Check auth on component mount
    checkAuth();
    
    // Listen for auth state changes
    window.addEventListener('storage', (event) => {
      if (event.key === 'token') {
        checkAuth();
      }
    });
    
    // Also check periodically to ensure we catch all changes
    const authCheckInterval = setInterval(checkAuth, 5000);
    
    // Clean up on component unmount
    return () => {
      clearInterval(authCheckInterval);
      window.removeEventListener('storage', checkAuth);
      socketService.disconnect();
    };
  }, []);
  
  return (
    <Router>
      <div className="flex min-h-screen bg-trippiko-bg">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
          <LoginButton />
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;