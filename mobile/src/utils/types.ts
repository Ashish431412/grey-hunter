/**
 * User interface representing a registered platform user
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'researcher' | 'admin';
  createdAt: string;
}

/**
 * Task interface for project tracking
 */
export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Project interface
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: 'active' | 'archived' | 'completed';
  createdAt: string;
  updatedAt: string;
}

/**
 * Tool representation for the ethical hacking tool catalog
 */
export interface Tool {
  id: string;
  name: string;
  category: 'recon' | 'exploitation' | 'post-exploitation' | 'analysis';
  description: string;
  commandTemplate: string;
  isAvailableOffline: boolean;
}

/**
 * Sync payload for offline data synchronization
 */
export interface SyncPayload<T> {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;
  data: T;
  timestamp: number;
}

/**
 * Audit log entry
 */
export interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  details: Record<string, unknown>;
  timestamp: string;
  ipAddress?: string;
}
