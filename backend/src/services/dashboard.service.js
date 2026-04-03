import { dashboardRepository } from '../repositories/dashboard.repository.js';

class DashboardService {
  async getSummary() {
    return await dashboardRepository.getSummary();
  }

  async getCategoryBreakdown() {
    return await dashboardRepository.getCategoryBreakdown();
  }

  async getMonthlyTrends() {
    return await dashboardRepository.getMonthlyTrends(6);
  }

  async getRecentTransactions() {
    return await dashboardRepository.getRecentTransactions(5);
  }
}

export const dashboardService = new DashboardService();
