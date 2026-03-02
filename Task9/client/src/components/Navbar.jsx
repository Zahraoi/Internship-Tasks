import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`${isDark ? 'bg-gray-800' : 'bg-blue-600'} text-white px-6 py-4 flex justify-between items-center shadow-md`}>
     
      <h1 className="text-xl font-bold">Library Management System</h1>
      <div className="flex gap-3">
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          {isDark ? ' Light Mode' : ' Dark Mode'}
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
