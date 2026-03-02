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
    { 
      title: 'Total Books', 
      value: stats.books, 
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      title: 'Total Members', 
      value: stats.members,
      icon: (
        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      title: 'Books Issued', 
      value: stats.issues,
      icon: (
        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    
    <div className="p-6">
      <h2 className={`text-3xl  font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800' }`}>Dashboard</h2>
      <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-6 shadow-lg">
        <h2 className="text-2xl  font-bold">Welcome back, Admin!</h2>
      </div>
      
      
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
              <div className="shrink-0">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
