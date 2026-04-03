import { recordRepository } from '../repositories/record.repository.js';

class RecordService {
  async createRecord(userId, recordData) {
    return await recordRepository.create(userId, recordData);
  }

  async getRecords(query) {
    return await recordRepository.findAll(query);
  }

  async getRecordById(id) {
    const record = await recordRepository.findById(id);
    if (!record) {
      const error = new Error('Record not found');
      error.statusCode = 404;
      throw error;
    }
    return record;
  }

  async updateRecord(id, recordData) {
    // Check existence first
    await this.getRecordById(id);
    
    return await recordRepository.update(id, recordData);
  }

  async deleteRecord(id) {
    const result = await recordRepository.softDelete(id);
    if (!result) {
      const error = new Error('Record not found');
      error.statusCode = 404;
      throw error;
    }
    return result;
  }
}

export const recordService = new RecordService();
