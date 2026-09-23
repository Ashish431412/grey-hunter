import api from './api';
import { Tool } from '@utils/types';

class ToolService {
  async getCatalog(): Promise<Tool[]> {
    const response = await api.get('/tools');
    return response.data;
  }

  async executeCommand(toolId: string, params: Record<string, any>) {
    const response = await api.post(`/tools/${toolId}/execute`, params);
    return response.data;
  }

  async getHistory() {
    const response = await api.get('/tools/history');
    return response.data;
  }

  async getResult(resultId: string) {
    const response = await api.get(`/tools/results/${resultId}`);
    return response.data;
  }
}

export default new ToolService();
