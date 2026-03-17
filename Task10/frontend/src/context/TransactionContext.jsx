import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const TransactionContext = createContext();

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveToHistory = useCallback((newTransactions) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newTransactions]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setTransactions(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setTransactions(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const fetchTransactions = async (filters = {}) => {
    setLoading(true);
    let result = [];
    try {
      // Filter out empty values
      const cleanFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '' && filters[key] !== undefined && filters[key] !== null) {
          cleanFilters[key] = filters[key];
        }
      });
      const params = new URLSearchParams(cleanFilters).toString();
      const { data } = await axios.get(`/api/transactions?${params}`);
      result = data;
      setTransactions(data);
      if (history[historyIndex].length === 0) {
        saveToHistory(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
    setLoading(false);
    return result;
  };

  const addTransaction = async (transaction) => {
    try {
      const { data } = await axios.post('/api/transactions', transaction);
      const newTransactions = [data, ...transactions];
      setTransactions(newTransactions);
      saveToHistory(newTransactions);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add' };
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const { data } = await axios.put(`/api/transactions/${id}`, updates);
      const newTransactions = transactions.map(t => t._id === id ? data : t);
      setTransactions(newTransactions);
      saveToHistory(newTransactions);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update' };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      const newTransactions = transactions.filter(t => t._id !== id);
      setTransactions(newTransactions);
      saveToHistory(newTransactions);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete' };
    }
  };

  const fetchBudgets = async (month) => {
    try {
      const { data } = await axios.get(`/api/budgets?month=${month}`);
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchBudgetSummary = async (month) => {
    try {
      const { data } = await axios.get(`/api/budgets/summary?month=${month}`);
      return data;
    } catch (error) {
      console.error('Error fetching budget summary:', error);
      return [];
    }
  };

  const setBudget = async (category, monthlyLimit, month) => {
    try {
      const { data } = await axios.post('/api/budgets', { category, monthlyLimit, month });
      const newBudgets = budgets.filter(b => b.category !== category || b.month !== month);
      setBudgets([...newBudgets, data]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to set budget' };
    }
  };

  const deleteBudget = async (id) => {
    try {
      await axios.delete(`/api/budgets/${id}`);
      const newBudgets = budgets.filter(b => b._id !== id);
      setBudgets(newBudgets);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete budget' };
    }
  };

  const exportCSV = async () => {
    try {
      const response = await axios.get('/api/transactions/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      budgets,
      loading,
      historyIndex,
      historyLength: history.length,
      fetchTransactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      fetchBudgets,
      fetchBudgetSummary,
      setBudget,
      deleteBudget,
      exportCSV,
      undo,
      redo
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
