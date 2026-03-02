import { useState, useEffect } from 'react';
import { memberService } from '../services/api';
import { useDarkMode } from '../context/DarkModeContext';

const Members = () => {
  const { isDark } = useDarkMode();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [formData, setFormData] = useState({
    memberId: '',
    name: '',
    department: '',
    contact: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await memberService.getAll();
      setMembers(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);
    if (query) {
      const res = await memberService.search(query);
      setMembers(res.data);
    } else {
      fetchMembers();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMember) {
        await memberService.update(editMember._id, formData);
      } else {
        await memberService.create(formData);
      }
      setFormData({ memberId: '', name: '', department: '', contact: '' });
      setShowForm(false);
      setEditMember(null);
      fetchMembers();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving member');
    }
  };

  const handleEdit = (member) => {
    setEditMember(member);
    setFormData({
      memberId: member.memberId,
      name: member.name,
      department: member.department,
      contact: member.contact
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        await memberService.delete(id);
        fetchMembers();
      } catch (error) {
        alert('Error deleting member');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Members</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditMember(null); setFormData({ memberId: '', name: '', department: '', contact: '' }); }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {showForm ? 'Cancel' : 'Add Member'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md mb-6`}>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Member ID"
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              className={`p-2 border rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
              required
            />
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`p-2 border rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className={`p-2 border rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
              required
            />
            <input
              type="text"
              placeholder="Contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className={`p-2 border rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
              required
            />
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              {editMember ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}

      <input
        type="text"
        placeholder="Search by ID or Name..."
        value={search}
        onChange={handleSearch}
        className={`w-full p-3 border rounded-lg mb-6 ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'border-gray-300'}`}
      />

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-blue-600'}>
              <tr>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Member ID</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Name</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Department</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Contact</th>
                <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-white'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={member._id} className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-blue-50'} transition`}>
                  <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{member.memberId}</td>
                  <td className={`p-4 font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{member.name}</td>
                  <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{member.department}</td>
                  <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{member.contact}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(member)} 
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(member._id)} 
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
        {members.length === 0 && <p className={`p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No members found</p>}
      </div>
    </div>
  );
};

export default Members;
