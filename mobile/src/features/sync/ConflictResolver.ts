export type ConflictType = 'UPDATE_UPDATE' | 'DELETE_UPDATE' | 'CREATE_CREATE';

export interface Change {
  id: string;
  timestamp: number;
  data: any;
}

export interface Conflict {
  type: ConflictType;
  local: Change;
  remote: Change;
}

export type ResolveStrategy = 'local' | 'remote' | 'merge';

export class ConflictResolver {
  static detectConflicts(localChanges: Change[], remoteChanges: Change[]): Conflict[] {
    const conflicts: Conflict[] = [];
    localChanges.forEach((local) => {
      const remote = remoteChanges.find((r) => r.id === local.id);
      if (remote) {
        conflicts.push({ type: 'UPDATE_UPDATE', local, remote });
      }
    });
    return conflicts;
  }

  static resolveConflict(conflict: Conflict, strategy: ResolveStrategy): Change {
    if (strategy === 'local') return conflict.local;
    if (strategy === 'remote') return conflict.remote;
    
    // Merge: Last Write Wins at field level
    if (strategy === 'merge') {
      const mergedData = { ...conflict.remote.data };
      if (conflict.local.timestamp > conflict.remote.timestamp) {
        Object.assign(mergedData, conflict.local.data);
      }
      return {
        id: conflict.local.id,
        timestamp: Math.max(conflict.local.timestamp, conflict.remote.timestamp),
        data: mergedData,
      };
    }
    return conflict.remote;
  }
}
