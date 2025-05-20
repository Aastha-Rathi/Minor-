import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await authService.login(form.username, form.password);
      // On success: redirect to travel plan
      navigate('/travel-plan');
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-trippiko-bg">
      <div className="bg-trippiko-card p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-heading mb-6 text-trippiko-accent">Login to Trippiko</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            name="username" 
            type="text" 
            placeholder="Username" 
            value={form.username} 
            onChange={handleChange} 
            className="p-2 rounded bg-trippiko-light" 
            required 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            value={form.password} 
            onChange={handleChange} 
            className="p-2 rounded bg-trippiko-light" 
            required 
          />
          <button 
            type="submit" 
            disabled={loading}
            className={`bg-trippiko-accent text-trippiko-dark font-bold py-2 rounded ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-trippiko-light">
          Don't have an account? <Link to="/signup" className="text-trippiko-accent underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;