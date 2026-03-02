import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Issues from './pages/Issues';
import Login from './pages/Login';

const ProtectedLayout = () => {
  const { isDark } = useDarkMode();
  
  return (
    <div className={isDark ? 'dark' : ''}>
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/books" element={<Books />} />
              <Route path="/members" element={<Members />} />
              <Route path="/issues" element={<Issues />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
      />
      <Route 
        path="/*" 
        element={isAuthenticated ? <ProtectedLayout /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </DarkModeProvider>
    </BrowserRouter>
  );
}

export default App;
