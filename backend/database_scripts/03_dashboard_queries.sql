-- These are examples of the aggregation queries used by the dashboard endpoints.
-- You can run these manually in pgAdmin to verify the calculations.

-- 1. Total Income, Total Expenses, Net Balance
SELECT 
    COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS total_expenses,
    COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE -amount END), 0) AS net_balance
FROM financial_records
WHERE is_deleted = false;

-- 2. Category-wise breakdown (Expenses Only)
SELECT 
    category, 
    SUM(amount) as total_amount
FROM financial_records
WHERE type = 'EXPENSE' AND is_deleted = false
GROUP BY category
ORDER BY total_amount DESC;

-- 3. Monthly Trends (Income vs Expenses over the last 6 months)
SELECT 
    EXTRACT(YEAR FROM date) AS year,
    EXTRACT(MONTH FROM date) AS month,
    COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS income,
    COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS expense
FROM financial_records
WHERE is_deleted = false
  AND date >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)
ORDER BY year, month;

-- 4. Recent Transactions (Last 5 transactions)
SELECT id, amount, type, category, date, description
FROM financial_records
WHERE is_deleted = false
ORDER BY date DESC, created_at DESC
LIMIT 5;
