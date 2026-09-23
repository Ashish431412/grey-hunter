import api from './api';
import { Project, Task } from '@utils/types';

class ProjectService {
  async getProjects(): Promise<Project[]> {
    const response = await api.get('/projects');
    return response.data;
  }

  async getProject(id: string): Promise<Project> {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    const response = await api.post('/projects', data);
    return response.data;
  }

  async getTasks(projectId: string): Promise<Task[]> {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return response.data;
  }

  async updateTask(taskId: string, data: Partial<Task>): Promise<Task> {
    const response = await api.put(`/tasks/${taskId}`, data);
    return response.data;
  }
}

export default new ProjectService();
