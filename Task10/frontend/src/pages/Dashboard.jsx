import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTransaction } from '../context/TransactionContext';
import { useDebounce } from '../hooks/useDebounce';
import { Navigate } from 'react-router-dom';
import { Undo2, Redo2, Download, Plus, X, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Goals from '../components/Goals';
import Reports from '../components/Reports';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();
  const transactionsRef = useRef(null);
  const budgetRef = useRef(null);
  const { 
    transactions, 
    fetchTransactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    fetchBudgets,
    fetchBudgetSummary,
    exportCSV,
    undo,
    redo,
    historyIndex,
    historyLength
  } = useTransaction();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [budgetSummary, setBudgetSummary] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  
  const debouncedSearch = useDebounce(search, 300);

  const scrollToSection = (section) => {
    if (section === 'transactions' && transactionsRef.current) {
      transactionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'budget' && budgetRef.current) {
      budgetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getMonthOptions = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const value = `${year}-${month}`;
      const label = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      months.push({ value, label });
    }
    return months;
  };

  // Filter transactions for selected month (for SummaryCards)
  const selectedMonthTransactions = useMemo(() => {
    return allTransactions.filter(t => {
      // Handle both date string formats
      const txDate = new Date(t.date);
      const txMonth = txDate.getMonth() + 1;
      const txYear = txDate.getFullYear();
      const [selYear, selMonth] = selectedMonth.split('-');
      return txYear === parseInt(selYear) && txMonth === parseInt(selMonth);
    });
  }, [allTransactions, selectedMonth]);

  // Filter transactions for list - show all OR selected month
  const displayTransactions = useMemo(() => {
    return allTransactions.filter(t => {
      const txDate = new Date(t.date);
      const txMonth = txDate.getMonth() + 1;
      const txYear = txDate.getFullYear();
      const [selYear, selMonth] = selectedMonth.split('-');
      return txYear === parseInt(selYear) && txMonth === parseInt(selMonth);
    });
  }, [allTransactions, selectedMonth]);

  // Force refresh when month explicitly changes
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      const txData = await fetchTransactions({});
      setAllTransactions(txData || []);
      const budgetData = await fetchBudgetSummary(selectedMonth);
      setBudgetSummary(budgetData || []);
    };
    loadData();
  }, [selectedMonth, user]);

  // Fetch filtered transactions for the list
  useEffect(() => {
    if (!user) return;
    const filters = { 
      search: debouncedSearch, 
      category: categoryFilter
    };
    if (dateFilter.start) filters.startDate = dateFilter.start;
    if (dateFilter.end) filters.endDate = dateFilter.end;
    fetchTransactions(filters);
  }, [debouncedSearch, categoryFilter, dateFilter, user]);

  const handleAddTransaction = async (transaction) => {
    await addTransaction(transaction);
    setShowForm(false);
    // Refresh all data
    fetchTransactions({}).then(data => setAllTransactions(data || []));
    fetchBudgetSummary(selectedMonth).then(setBudgetSummary);
    // Refresh filtered list
    const filters = { search: debouncedSearch, category: categoryFilter };
    if (dateFilter.start) filters.startDate = dateFilter.start;
    if (dateFilter.end) filters.endDate = dateFilter.end;
    fetchTransactions(filters);
  };

  const handleUpdateTransaction = async (id, updates) => {
    await updateTransaction(id, updates);
    setEditingTransaction(null);
    // Refresh all data
    fetchTransactions({}).then(data => setAllTransactions(data || []));
    fetchBudgetSummary(selectedMonth).then(setBudgetSummary);
    // Refresh filtered list
    const filters = { search: debouncedSearch, category: categoryFilter };
    if (dateFilter.start) filters.startDate = dateFilter.start;
    if (dateFilter.end) filters.endDate = dateFilter.end;
    fetchTransactions(filters);
  };

  const handleDeleteTransaction = async (id) => {
    await deleteTransaction(id);
    // Refresh all data
    fetchTransactions({}).then(data => setAllTransactions(data || []));
    fetchBudgetSummary(selectedMonth).then(setBudgetSummary);
    // Refresh filtered list
    const filters = { search: debouncedSearch, category: categoryFilter };
    if (dateFilter.start) filters.startDate = dateFilter.start;
    if (dateFilter.end) filters.endDate = dateFilter.end;
    fetchTransactions(filters);
  };

  const handleBudgetChange = (month) => {
    const targetMonth = month || selectedMonth;
    fetchBudgetSummary(targetMonth).then(data => {
      setBudgetSummary(data || []);
    });
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
        onNavigate={scrollToSection}
      />
      
      <main className={`flex-1 p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {activeTab === 'reports' ? 'Reports' : 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={`p-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
              }`}
            >
              {getMonthOptions().map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className={`p-2 rounded ${historyIndex > 0 ? (darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-800') : 'opacity-50 cursor-not-allowed'}`}
                title="Undo"
              >
                <Undo2 size={20} />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= historyLength - 1}
                className={`p-2 rounded ${historyIndex < historyLength - 1 ? (darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-800') : 'opacity-50 cursor-not-allowed'}`}
                title="Redo"
              >
                <Redo2 size={20} />
              </button>
              <button
                onClick={exportCSV}
                className={`flex items-center gap-2 px-4 py-2 rounded ${darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white`}
              >
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'reports' ? (
          <Reports transactions={allTransactions} selectedMonth={selectedMonth} darkMode={darkMode} />
        ) : (
          <>
            <SummaryCards transactions={selectedMonthTransactions} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className={`p-4 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full pl-10 p-2.5 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`p-2.5 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <option value="all">All</option>
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="shopping">Shopping</option>
                  <option value="bills">Bills</option>
                  <option value="health">Health</option>
                  <option value="income">Income</option>
                  <option value="other">Other</option>
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateFilter.start}
                    onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                    className={`p-2.5 rounded-lg border text-sm ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                    title="Filter from date"
                  />
                  {dateFilter.start && (
                    <button
                      onClick={() => setDateFilter({ start: '', end: '' })}
                      className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                      title="Clear date"
                    >
                      <X size={16} />
                    </button>
                  )}
                  
                </div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  {showForm ? <X size={18} /> : <Plus size={18} />}
                  {showForm ? 'Cancel' : 'Add'}
                </button>
              </div>
              
              {showForm && (
                <TransactionForm
                  onSubmit={handleAddTransaction}
                  onCancel={() => setShowForm(false)}
                  darkMode={darkMode}
                />
              )}
            </div>
            
            <TransactionList
              ref={transactionsRef}
              transactions={displayTransactions}
              onEdit={setEditingTransaction}
              onDelete={handleDeleteTransaction}
              onUpdate={handleUpdateTransaction}
              editingId={editingTransaction?._id}
              darkMode={darkMode}
            />
          </div>
          
          <div className="space-y-6">
            <Goals 
              ref={budgetRef}
              budgetSummary={budgetSummary}
              selectedMonth={selectedMonth}
              darkMode={darkMode}
              onBudgetChange={handleBudgetChange}
            />
          </div>
          </div>
          </>
        )}
        
      </main>
    </div>
  );
};

export default Dashboard;
