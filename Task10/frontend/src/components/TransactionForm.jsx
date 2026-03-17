import { useState } from 'react';

const TransactionForm = ({ onSubmit, onCancel, darkMode, initialData = null }) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'expense',
    amount: initialData?.amount || '',
    category: initialData?.category || 'food',
    description: initialData?.description || '',
    date: initialData?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date)
    });
  };

  const categories = ['food', 'transport', 'entertainment', 'shopping', 'bills', 'health', 'other'];
  if (formData.type === 'income') {
    categories.unshift('income');
  }

  return (
    <form onSubmit={handleSubmit} className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        
        <div>
          <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
            required
          />
        </div>
        
        <div>
          <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
          />
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {initialData ? 'Update' : 'Add Transaction'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
