import { db } from '../config/db.js';

class RecordRepository {
  async create(userId, recordData) {
    const { amount, type, category, date, description } = recordData;
    const { rows } = await db.query(
      `INSERT INTO financial_records (user_id, amount, type, category, date, description)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, amount, type, category, date, description]
    );
    return rows[0];
  }

  async findById(recordId) {
    const { rows } = await db.query(
      'SELECT * FROM financial_records WHERE id = $1 AND is_deleted = false',
      [recordId]
    );
    return rows[0];
  }

  async update(recordId, recordData) {
    // Dynamic update query builder for partial updates
    const updates = [];
    const values = [];
    let queryIndex = 1;

    for (const [key, value] of Object.entries(recordData)) {
      if (value !== undefined) {
        updates.push(`${key} = $${queryIndex}`);
        values.push(value);
        queryIndex++;
      }
    }

    if (updates.length === 0) return this.findById(recordId);

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(recordId);

    const query = `
      UPDATE financial_records 
      SET ${updates.join(', ')} 
      WHERE id = $${queryIndex} AND is_deleted = false 
      RETURNING *`;

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async softDelete(recordId) {
    const { rows } = await db.query(
      `UPDATE financial_records 
       SET is_deleted = true, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 RETURNING id`,
      [recordId]
    );
    return rows[0];
  }

  async findAll({ userId, role, page, limit, type, category, startDate, endDate }) {
    const values = [];
    const conditions = ['is_deleted = false'];
    let queryIndex = 1;

    // Filters
    if (role === 'VIEWER') {
      // If VIEWER, maybe they can only see their own? Standard RBAC:
      // Usually viewers see all data or own data. Let's restrict to own data unless Admin/Analyst.
      // Requirements didn't specify exactly, but a safe assumption is to show all if dashboard is global.
      // Let's assume financial data is global for the system.
      // If strictly personal tracker:
      // conditions.push(`user_id = $${queryIndex++}`);
      // values.push(userId);
    }

    if (type) {
      conditions.push(`type = $${queryIndex++}`);
      values.push(type);
    }
    if (category) {
      conditions.push(`category = $${queryIndex++}`);
      values.push(category);
    }
    if (startDate) {
      conditions.push(`date >= $${queryIndex++}`);
      values.push(startDate);
    }
    if (endDate) {
      conditions.push(`date <= $${queryIndex++}`);
      values.push(endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Pagination
    const offset = (page - 1) * limit;
    
    // Get total count
    const countQuery = `SELECT COUNT(*) FROM financial_records ${whereClause}`;
    const { rows: countRows } = await db.query(countQuery, values);
    const totalCount = parseInt(countRows[0].count, 10);

    // Get paginated data
    values.push(limit, offset);
    const dataQuery = `
      SELECT * FROM financial_records 
      ${whereClause} 
      ORDER BY date DESC, created_at DESC 
      LIMIT $${queryIndex++} OFFSET $${queryIndex++}
    `;
    const { rows } = await db.query(dataQuery, values);

    return {
      data: rows,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }
}

export const recordRepository = new RecordRepository();
