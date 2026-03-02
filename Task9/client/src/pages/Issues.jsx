import { useState, useEffect } from 'react';
import { bookService, memberService, issueService } from '../services/api';
import { useDarkMode } from '../context/DarkModeContext';

const Issues = () => {
  const { isDark } = useDarkMode();
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '',
    memberId: '',
    dueDays: 14
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [issuesRes, booksRes, membersRes] = await Promise.all([
        issueService.getAll(),
        bookService.getAll(),
        memberService.getAll()
      ]);
      setIssues(issuesRes.data);
      setBooks(booksRes.data.filter(b => b.available > 0));
      setMembers(membersRes.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await issueService.issue(formData);
      setFormData({ bookId: '', memberId: '', dueDays: 14 });
      setShowIssueForm(false);
      fetchData();
      alert('Book issued successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Error issuing book');
    }
  };

  const handleReturn = async (id) => {
    try {
      const res = await issueService.return(id);
      const issue = res.data;
      if (issue.fine > 0) {
        alert(`Book returned! Fine: $${issue.fine}`);
      } else {
        alert('Book returned successfully!');
      }
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Error returning book');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Issue / Return</h2>
        <button
          onClick={() => setShowIssueForm(!showIssueForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {showIssueForm ? 'Cancel' : 'Issue Book'}
        </button>
      </div>

      {showIssueForm && (
        <form onSubmit={handleIssue} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md mb-6`}>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.bookId}
              onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
              className={`p-2 border rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
              required
            >
              <option value="">Select Book</option>
              {books.map(book => (
                <option key={book._id} value={book.bookId}>
                  {book.bookId} - {book.title} (Available: {book.available})
                </option>
              ))}
            </select>
            <select
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              className={`p-2 border rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
              required
            >
              <option value="">Select Member</option>
              {members.map(member => (
                <option key={member._id} value={member.memberId}>
                  {member.memberId} - {member.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Due Days"
              value={formData.dueDays}
              onChange={(e) => setFormData({ ...formData, dueDays: parseInt(e.target.value) })}
              className={`p-2 border rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
              min="1"
            />
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              Issue Book
            </button>
          </div>
        </form>
      )}

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-blue-600'}>
              <tr>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Book</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Member</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Issue Date</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Due Date</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Status</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Fine</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, index) => (
                <tr key={issue._id} className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-blue-50'} transition`}>
                  <td className={`p-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    <div className="font-medium">{issue.book?.title || 'N/A'}</div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{issue.book?.bookId}</div>
                  </td>
                  <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="font-medium">{issue.member?.name || 'N/A'}</div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{issue.member?.memberId}</div>
                  </td>
                  <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(issue.issueDate)}</td>
                  <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(issue.dueDate)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${issue.status === 'issued' ? (isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800') : (isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {issue.fine > 0 ? <span className="text-red-500 font-semibold">${issue.fine}</span> : '-'}
                  </td>
                  <td className="p-4">
                    {issue.status === 'issued' && (
                      <button
                        onClick={() => handleReturn(issue._id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {issues.length === 0 && <p className={`p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No records found</p>}
      </div>
    </div>
  );
};

export default Issues;
