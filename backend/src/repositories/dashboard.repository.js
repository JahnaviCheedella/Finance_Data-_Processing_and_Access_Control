import { db } from '../config/db.js';

class DashboardRepository {
  async getSummary() {
    const { rows } = await db.query(`
      SELECT 
          COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS total_income,
          COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS total_expenses,
          COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE -amount END), 0) AS net_balance
      FROM financial_records
      WHERE is_deleted = false
    `);
    
    // pg returns numeric as string to avoid precision loss, convert to float
    return {
      totalIncome: parseFloat(rows[0].total_income),
      totalExpenses: parseFloat(rows[0].total_expenses),
      netBalance: parseFloat(rows[0].net_balance)
    };
  }

  async getCategoryBreakdown() {
    const { rows } = await db.query(`
      SELECT category, SUM(amount) as total_amount, type
      FROM financial_records
      WHERE is_deleted = false
      GROUP BY category, type
      ORDER BY total_amount DESC
    `);
    
    return rows.map(r => ({
      ...r,
      total_amount: parseFloat(r.total_amount)
    }));
  }

  async getMonthlyTrends(months = 6) {
    const { rows } = await db.query(`
      SELECT 
          EXTRACT(YEAR FROM date) AS year,
          EXTRACT(MONTH FROM date) AS month,
          COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS income,
          COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS expense
      FROM financial_records
      WHERE is_deleted = false 
        AND date >= CURRENT_DATE - INTERVAL '${months} months'
      GROUP BY EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)
      ORDER BY year, month
    `);
    
    return rows.map(r => ({
      year: parseInt(r.year),
      month: parseInt(r.month),
      income: parseFloat(r.income),
      expense: parseFloat(r.expense)
    }));
  }

  async getRecentTransactions(limit = 5) {
    const { rows } = await db.query(`
      SELECT id, amount, type, category, date, description
      FROM financial_records
      WHERE is_deleted = false
      ORDER BY date DESC, created_at DESC
      LIMIT $1
    `, [limit]);
    
    return rows;
  }
}

export const dashboardRepository = new DashboardRepository();
