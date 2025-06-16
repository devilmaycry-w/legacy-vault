import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to log in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181411] text-white flex items-center justify-center px-4">
      <div className="bg-[rgba(56,47,41,0.6)] backdrop-blur-lg border border-[rgba(83,70,60,0.7)] rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-[#e9883e]" />
            <h1 className="text-2xl font-bold font-serif">Legacy</h1>
          </div>
          <h2 className="text-xl font-semibold">Welcome Back</h2>
          <p className="text-[#b8a99d] text-sm mt-2">Sign in to access your family vault</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-[#b8a99d] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[rgba(56,47,41,0.5)] backdrop-blur-sm border-none rounded-xl px-4 py-3 text-white placeholder-[#b8a99d] focus:outline-none focus:ring-2 focus:ring-[#e9883e]"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#b8a99d] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[rgba(56,47,41,0.5)] backdrop-blur-sm border-none rounded-xl px-4 py-3 text-white placeholder-[#b8a99d] focus:outline-none focus:ring-2 focus:ring-[#e9883e]"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e9883e] text-[#181411] font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#382f29]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[rgba(56,47,41,0.6)] text-[#b8a99d]">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white/10 border border-white/20 text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 backdrop-blur-sm"
        >
          Sign in with Google
        </button>

        <p className="text-center text-[#b8a99d] text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#e9883e] hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;