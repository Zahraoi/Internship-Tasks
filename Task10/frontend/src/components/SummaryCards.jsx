import { useTheme } from '../context/ThemeContext';
import { Wallet, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { formatCurrency, formatCurrencyValue } from '../utils/currency';

const SummaryCards = ({ transactions }) => {
  const { darkMode } = useTheme();

  const calculateTotals = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;
    const savings = income > 0 ? ((income - expenses) / income) * 100 : 0;

    return { balance, income, expenses, savings };
  };

  const { balance, income, expenses, savings } = calculateTotals();

  const cards = [
    {
      label: 'Balance',
      value: formatCurrency(balance),
      icon: Wallet,
      iconBg: 'bg-green-100 text-green-600',
      color: balance >= 0 ? 'text-green-500' : 'text-red-500',
      bg: darkMode ? 'bg-gray-800' : 'bg-white'
    },
    {
      label: 'Income',
      value: formatCurrency(income),
      icon: TrendingUp,
      iconBg: 'bg-green-100 text-green-600',
      color: 'text-green-500',
      bg: darkMode ? 'bg-gray-800' : 'bg-white'
    },
    {
      label: 'Expenses',
      value: formatCurrency(expenses),
      icon: TrendingDown,
      iconBg: 'bg-red-100 text-red-600',
      color: 'text-red-500',
      bg: darkMode ? 'bg-gray-800' : 'bg-white'
    },
    {
      label: 'Savings',
      value: `${savings.toFixed(1)}%`,
      icon: Target,
      iconBg: 'bg-teal-100 text-teal-600',
      color: 'text-teal-500',
      bg: darkMode ? 'bg-gray-800' : 'bg-white'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bg} rounded-xl p-5 shadow-md`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {card.label}
            </span>
            <div className={`p-2 rounded-lg ${card.iconBg}`}>
              <card.icon size={18} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${card.color}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
