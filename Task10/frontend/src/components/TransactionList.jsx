import { useState, useMemo, forwardRef } from 'react';
import { ArrowUpRight, ArrowDownLeft, Pencil, Trash2 } from 'lucide-react';
import TransactionForm from './TransactionForm';
import { formatCurrency } from '../utils/currency';

const TransactionList = forwardRef(({ transactions, onEdit, onDelete, onUpdate, editingId, darkMode }, ref) => {
  const [editData, setEditData] = useState(null);

  const groupedTransactions = useMemo(() => {
    const groups = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(t);
    });
    return groups;
  }, [transactions]);

  const handleEditClick = (transaction) => {
    setEditData({
      ...transaction,
      date: transaction.date.slice(0, 10)
    });
    onEdit(transaction);
  };

  const handleUpdate = (id, data) => {
    onUpdate(id, { ...data, date: new Date(data.date) });
    setEditData(null);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const formatAmount = (amount, type) => {
    const formatted = formatCurrency(amount);
    return type === 'income' 
      ? `+${formatted}` 
      : `-${formatted}`;
  };

  if (transactions.length === 0) {
    return (
      <div className={`p-6 rounded-xl shadow-md text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No transactions yet</p>
      </div>
    );
  }

  return (
    <div ref={ref} className={`p-5 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Recent Transactions
      </h2>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {Object.entries(groupedTransactions).map(([monthYear, monthTransactions]) => (
          <div key={monthYear}>
            <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>
              {monthYear}
            </h3>
            <div className="space-y-2">
              {monthTransactions.map((transaction) => (
                <div key={transaction._id}>
                  {editingId === transaction._id && editData ? (
                    <TransactionForm
                      initialData={editData}
                      onSubmit={(data) => handleUpdate(transaction._id, data)}
                      onCancel={() => { setEditData(null); onEdit(null); }}
                      darkMode={darkMode}
                    />
                  ) : (
                    <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                        </div>
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {transaction.description || formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                          {formatAmount(transaction.amount, transaction.type)}
                        </span>
                        
                        <button
                          onClick={() => handleEditClick(transaction)}
                          className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(transaction._id)}
                          className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default TransactionList;
