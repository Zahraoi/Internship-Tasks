import { useState, useEffect } from 'react';
import { bookService, memberService, issueService } from '../services/api';
import { useDarkMode } from '../context/DarkModeContext';

const Dashboard = () => {
  const { isDark } = useDarkMode();
  const [stats, setStats] = useState({ books: 0, members: 0, issues: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, membersRes, issuesRes] = await Promise.all([
          bookService.getAll(),
          memberService.getAll(),
          issueService.getAll()
        ]);
        setStats({
          books: booksRes.data.length,
          members: membersRes.data.length,
          issues: issuesRes.data.filter(i => i.status === 'issued').length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Books', value: stats.books, color: 'blue' },
    { title: 'Total Members', value: stats.members, color: 'green' },
    { title: 'Books Issued', value: stats.issues, color: 'orange' }
  ];

  return (
    <div className="p-6">
      <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-6 shadow-lg">
        <h2 className="text-2xl text-center font-bold">Welcome back, Admin!</h2>
        
      </div>
      
      <h2 className={`text-3xl text-center font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800' }`}>Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm text-center p-1.5  ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{card.title}</p>
                <p className={`text-3xl p-2 font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>{card.value}</p>
              </div>
              <span className="text-4xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
