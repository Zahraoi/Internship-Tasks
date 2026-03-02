import { useState, useEffect } from 'react';
import { bookService } from '../services/api';
import { useDarkMode } from '../context/DarkModeContext';

const Books = () => {
  const { isDark } = useDarkMode();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [formData, setFormData] = useState({
    bookId: '',
    title: '',
    author: '',
    category: '',
    quantity: 1
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await bookService.getAll();
      setBooks(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);
    if (query) {
      const res = await bookService.search(query);
      setBooks(res.data);
    } else {
      fetchBooks();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBook) {
        await bookService.update(editBook._id, formData);
      } else {
        await bookService.create(formData);
      }
      setFormData({ bookId: '', title: '', author: '', category: '', quantity: 1 });
      setShowForm(false);
      setEditBook(null);
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving book');
    }
  };

  const handleEdit = (book) => {
    setEditBook(book);
    setFormData({
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      category: book.category,
      quantity: book.quantity
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.delete(id);
        fetchBooks();
      } catch (error) {
        alert('Error deleting book');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Books</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditBook(null); setFormData({ bookId: '', title: '', author: '', category: '', quantity: 1 }); }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {showForm ? 'Cancel' : 'Add Book'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md mb-6`}>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Book ID"
              value={formData.bookId}
              onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
              className={`p-2 border rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
              required
            />
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`p-2 border rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className={`p-2 border rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`p-2 border rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              className={`p-2 border rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
              min="1"
              required
            />
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              {editBook ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}

      <input
        type="text"
        placeholder="Search by ID, Title, or Author..."
        value={search}
        onChange={handleSearch}
        className={`w-full p-3 border rounded-lg mb-6 ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'border-gray-300'}`}
      />

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-blue-600'}>
              <tr>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Book ID</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Title</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Author</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Category</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Qty</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Available</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Actions</th>
              </tr>
            </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book._id} className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-blue-50'} transition`}>
                <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{book.bookId}</td>
                <td className={`p-4 font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{book.title}</td>
                <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{book.author}</td>
                <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{book.category}</td>
                <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{book.quantity}</td>
                <td className={`p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${book.available > 0 ? (isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800') : (isDark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')}`}>
                    {book.available}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(book)} 
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(book._id)} 
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {books.length === 0 && <p className={`p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No books found</p>}
      </div>
    </div>
  );
};

export default Books;
