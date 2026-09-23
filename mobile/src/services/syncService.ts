import api from './api';
import { SyncPayload } from '@utils/types';

class SyncService {
  async push(payloads: SyncPayload<any>[]) {
    const response = await api.post('/sync/push', { payloads });
    return response.data;
  }

  async pull(lastSyncTimestamp: number) {
    const response = await api.get(`/sync/pull?since=${lastSyncTimestamp}`);
    return response.data;
  }

  async getStatus() {
    const response = await api.get('/sync/status');
    return response.data;
  }
}

export default new SyncService();
