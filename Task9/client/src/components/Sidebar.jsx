import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';

const Sidebar = () => {
  const { isDark } = useDarkMode();
  const location = useLocation();

  const links = [
    { path: '/', label: 'Dashboard', icon: ' ➢ ' },
    { path: '/books', label: 'Books', icon: ' ➢ ' },
    { path: '/members', label: 'Members', icon: ' ➢ ' },
    { path: '/issues', label: 'Issue/Return', icon: ' ➢ ' }
  ];

  return (
    <aside className={`${isDark ? 'bg-gray-800' : 'bg-white'} w-64 min-h-screen shadow-lg`}>
      <div className="p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`block px-4 py-3 rounded-lg transition ${
                  location.pathname === link.path
                    ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
