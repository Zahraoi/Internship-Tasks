import { useState, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrencyValue } from '../utils/currency';

const COLORS = ['#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#10b981'];

const Reports = ({ transactions, selectedMonth, darkMode }) => {
  const [clickedMonth, setClickedMonth] = useState(null);

  // Monthly spending data for bar chart
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTotals = months.map(() => 0);
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const monthIndex = new Date(t.date).getMonth();
        monthlyTotals[monthIndex] += t.amount;
      });
    
    return months.map((month, index) => ({ 
      month, 
      amount: monthlyTotals[index],
      fullMonth: `${String(index + 1).padStart(2, '0')}`
    }));
  }, [transactions]);

  // Pie chart data for clicked month
  const selectedMonthData = useMemo(() => {
    const targetMonth = clickedMonth || selectedMonth;
    const [year, month] = targetMonth.split('-');
    
    const categories = {};
    transactions
      .filter(t => {
        if (t.type !== 'expense') return false;
        const txDate = new Date(t.date);
        return txDate.getFullYear() === parseInt(year) && 
               txDate.getMonth() === parseInt(month) - 1;
      })
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions, clickedMonth, selectedMonth]);

  const textColor = darkMode ? '#E5E7EB' : '#374151';
  const gridColor = darkMode ? '#374151' : '#E5E7EB';

  const handleBarClick = (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const monthIndex = data.activePayload[0].payload.fullMonth;
      const currentYear = new Date().getFullYear();
      const monthValue = `${currentYear}-${monthIndex}`;
      setClickedMonth(clickedMonth === monthValue ? null : monthValue);
    }
  };

  const displayMonth = clickedMonth 
    ? new Date(clickedMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })
    : new Date(selectedMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Bar Chart - Monthly Trends */}
      <div className={`p-5 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Monthly Spending Trends (Click on a month to see breakdown)
        </h3>
        {monthlyData.some(d => d.amount > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} onClick={handleBarClick}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: textColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
              />
              <YAxis 
                tick={{ fill: textColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
                tickFormatter={(value) => `Rs. ${formatCurrencyValue(value)}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1F2937' : '#FFF',
                  border: 'none',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: textColor }}
                formatter={(value) => `Rs. ${formatCurrencyValue(value)}`}
              />
              <Bar 
                dataKey="amount" 
                fill="#14b8a6" 
                radius={[4, 4, 0, 0]}
                name="Spending"
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No expense data
          </p>
        )}
        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {clickedMonth ? 'Click on chart to deselect' : 'Click on a bar to see that month\'s breakdown'}
        </p>
      </div>

      {/* Pie Chart - Selected Month Breakdown */}
      <div className={`p-5 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {displayMonth} - Expense Breakdown
        </h3>
        {selectedMonthData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={selectedMonthData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: textColor }}
              >
                {selectedMonthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1F2937' : '#FFF',
                  border: 'none',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: textColor }}
                formatter={(value) => `Rs. ${formatCurrencyValue(value)}`}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ color: textColor, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No expenses for this month
          </p>
        )}
      </div>
    </div>
  );
};

export default Reports;
