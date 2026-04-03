import { db } from '../config/db.js';

// Specific User service for ADMIN tasks
class UserService {
  async getAllUsers() {
    const { rows } = await db.query('SELECT id, username, email, role, status, created_at FROM users');
    return rows;
  }

  async updateUserRole(id, role) {
    const { rows } = await db.query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, role',
      [role, id]
    );
    if (!rows.length) throw { statusCode: 404, message: 'User not found' };
    return rows[0];
  }

  async updateUserStatus(id, status) {
    const { rows } = await db.query(
      'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, status',
      [status, id]
    );
    if (!rows.length) throw { statusCode: 404, message: 'User not found' };
    return rows[0];
  }
}

export const userService = new UserService();
