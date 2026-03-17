import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Home, CreditCard, TrendingUp, FileText, Settings, LogOut, Sun, Moon } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout, onNavigate }) => {
  const { darkMode, toggleTheme } = useTheme();
  const [highlightedTab, setHighlightedTab] = useState(null);
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'budget', label: 'Budget', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    if (highlightedTab !== null) {
      const timer = setTimeout(() => {
        setHighlightedTab(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [highlightedTab]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setHighlightedTab(tabId);
    if (onNavigate && (tabId === 'transactions' || tabId === 'budget')) {
      onNavigate(tabId);
    }
  };

  return (
    <aside className={`w-64 min-h-screen ${darkMode ? 'bg-gray-800' : 'bg-gray-900'} flex flex-col`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-teal-400">
          FinanceApp
        </h1>
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const isHighlighted = highlightedTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-300
                ${isActive 
                  ? 'bg-teal-500 text-white' 
                  : isHighlighted 
                    ? 'bg-teal-600 text-white scale-105' 
                    : darkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-300 hover:bg-gray-700'
                }
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
