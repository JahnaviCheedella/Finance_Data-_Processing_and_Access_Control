import { db } from '../config/db.js';

class UserRepository {
  async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  }

  async create(user) {
    const { username, email, passwordHash, role } = user;
    const { rows } = await db.query(
      `INSERT INTO users (username, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, status, created_at`,
      [username, email, passwordHash, role || 'VIEWER']
    );
    return rows[0];
  }

  async saveRefreshToken(userId, refreshToken) {
    await db.query(
      'UPDATE users SET refresh_token = $1 WHERE id = $2',
      [refreshToken, userId]
    );
  }

  async removeRefreshToken(userId) {
    await db.query(
      'UPDATE users SET refresh_token = NULL WHERE id = $1',
      [userId]
    );
  }

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  }
}

export const userRepository = new UserRepository();
