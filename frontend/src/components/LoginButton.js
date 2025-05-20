import React from "react";
import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate('/login')} 
      className="absolute top-4 right-4 bg-red-500 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-red-600 transition-all shadow-lg"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      Login
    </button>
  );
};

export default LoginButton; 