import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { isDark } = useDarkMode();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      if (res.data.success) {
        login();
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-lg w-96`}>
        <div className="text-center mb-8">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Library Management</h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Admin Login</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-800 border-gray-300'}`}
              placeholder="admin@library.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-800 border-gray-300'}`}
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-red-900/50 text-red-200 border border-red-700' : 'bg-red-100 text-red-700 border border-red-300'}`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={`mt-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Default: admin@library.com / admin123 - Demo only
        </div>
      </div>
    </div>
  );
};

export default Login;
