import { userRepository } from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';

class AuthService {
  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      const error = new Error('Email already in use');
      error.statusCode = 400;
      throw error;
    }

    const passwordHash = await hashPassword(userData.password);
    const user = await userRepository.create({
      ...userData,
      passwordHash
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user || user.status === 'INACTIVE') {
      const error = new Error('Invalid credentials or inactive account');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const tokens = generateTokens(user);
    
    // Save refresh token to DB
    await userRepository.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      tokens
    };
  }

  async refresh(refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await userRepository.findById(decoded.userId);
      
      if (!user || user.refresh_token !== refreshToken || user.status === 'INACTIVE') {
         throw new Error('Invalid refresh token');
      }

      const tokens = generateTokens(user);
      await userRepository.saveRefreshToken(user.id, tokens.refreshToken);
      
      return tokens;
    } catch (err) {
      const error = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }
  }

  async logout(userId) {
    await userRepository.removeRefreshToken(userId);
  }
}

export const authService = new AuthService();
