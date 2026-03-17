import { useState, useEffect, forwardRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTransaction } from '../context/TransactionContext';
import { AlertTriangle, Plus, X, Trash2, Pencil } from 'lucide-react';
import { formatCurrencyValue } from '../utils/currency';

const Goals = forwardRef(({ budgetSummary, selectedMonth, darkMode, onBudgetChange }, ref) => {
  const { setBudget, deleteBudget } = useTransaction();
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: 'food', amount: '', month: selectedMonth });
  const [editingBudget, setEditingBudget] = useState(null);

  // Update form month when selectedMonth changes
  useEffect(() => {
    setNewBudget(prev => ({ ...prev, month: selectedMonth }));
  }, [selectedMonth]);

  // Refresh budgets when month changes
  useEffect(() => {
    if (onBudgetChange) {
      onBudgetChange(selectedMonth);
    }
  }, [selectedMonth]);

  const categories = ['food', 'transport', 'entertainment', 'shopping', 'bills', 'health', 'other'];

  const getMonthOptions = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7);
      const label = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      months.push({ value, label });
    }
    return months;
  };

  const refreshBudgets = () => {
    if (onBudgetChange) {
      onBudgetChange(selectedMonth);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (newBudget.amount && parseFloat(newBudget.amount) > 0) {
      await setBudget(newBudget.category, parseFloat(newBudget.amount), newBudget.month);
      setNewBudget({ category: 'food', amount: '', month: selectedMonth });
      setShowBudgetForm(false);
      refreshBudgets();
    }
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setNewBudget({ category: budget.category, amount: budget.budget.toString(), month: budget.month });
    setShowBudgetForm(true);
  };

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    if (editingBudget && newBudget.amount && parseFloat(newBudget.amount) > 0) {
      await deleteBudget(editingBudget._id);
      await setBudget(newBudget.category, parseFloat(newBudget.amount), newBudget.month);
      setNewBudget({ category: 'food', amount: '', month: selectedMonth });
      setEditingBudget(null);
      setShowBudgetForm(false);
      refreshBudgets();
    }
  };

  const handleDeleteBudget = async (id) => {
    await deleteBudget(id);
    refreshBudgets();
  };

  const handleCancel = () => {
    setShowBudgetForm(false);
    setNewBudget({ category: 'food', amount: '', month: selectedMonth });
    setEditingBudget(null);
  };

  return (
    <div ref={ref} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Budget Management
        </h3>
        <button
          onClick={() => setShowBudgetForm(!showBudgetForm)}
          className={`flex items-center gap-1 text-sm ${darkMode ? 'text-teal-400' : 'text-teal-500'} hover:text-teal-600`}
        >
          {showBudgetForm ? <X size={16} /> : <Plus size={16} />}
          {showBudgetForm ? 'Cancel' : 'Add Budget'}
        </button>
      </div>

      {showBudgetForm && (
        <form onSubmit={editingBudget ? handleUpdateBudget : handleSetBudget} className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
          <div className="flex gap-2 flex-wrap">
            <select
              value={newBudget.month}
              onChange={(e) => setNewBudget({ ...newBudget, month: e.target.value })}
              className={`p-2 rounded border text-sm ${
                darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
              }`}
            >
              {getMonthOptions().map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <select
              value={newBudget.category}
              onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              disabled={editingBudget}
              className={`p-2 rounded border text-sm flex-1 min-w-[120px] ${
                darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
              } ${editingBudget ? 'opacity-50' : ''}`}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={newBudget.amount}
              onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
              className={`p-2 rounded border text-sm w-24 ${
                darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
              }`}
            />
            <button type="submit" className="px-3 py-1 bg-teal-500 text-white rounded text-sm hover:bg-teal-600">
              {editingBudget ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {budgetSummary.length === 0 && !showBudgetForm ? (
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-4`}>
            No budgets set. Click "Add Budget" to create one.
          </p>
        ) : (
          budgetSummary.map((item, index) => {
            const percentage = Math.min((item.spent / item.budget) * 100, 100);
            const isOverBudget = item.spent >= item.budget;
            const isWarning = item.spent >= item.budget * 0.8 && !isOverBudget;
            
            return (
              <div key={index} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium capitalize ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditBudget(item)}
                      className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(item._id)}
                      className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-200 text-red-500'}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between mb-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Rs. {formatCurrencyValue(item.spent)} / {formatCurrencyValue(item.budget)}
                  </span>
                  <span className={`text-sm font-medium ${
                    isOverBudget ? 'text-red-500' : isWarning ? 'text-yellow-500' : 'text-teal-500'
                  }`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <div
                    className={`h-2 rounded-full ${
                      isOverBudget ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {isWarning && (
                  <p className="text-xs text-yellow-500 mt-1 flex items-center gap-1">
                    <AlertTriangle size={12} /> Approaching limit
                  </p>
                )}
                {isOverBudget && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertTriangle size={12} /> Over budget!
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

export default Goals;
