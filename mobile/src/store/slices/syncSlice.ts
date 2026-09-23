import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SyncState {
  lastSyncAt: string | null;
  pendingChanges: number;
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
  conflicts: any[];
}

const initialState: SyncState = {
  lastSyncAt: null,
  pendingChanges: 0,
  syncStatus: 'idle',
  conflicts: [],
};

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setSyncStatus: (state, action: PayloadAction<SyncState['syncStatus']>) => {
      state.syncStatus = action.payload;
      if (action.payload === 'success') {
        state.lastSyncAt = new Date().toISOString();
        state.pendingChanges = 0;
      }
    },
    setPendingChanges: (state, action: PayloadAction<number>) => {
      state.pendingChanges = action.payload;
    },
    addConflict: (state, action: PayloadAction<any>) => {
      state.conflicts.push(action.payload);
    },
    clearConflicts: (state) => {
      state.conflicts = [];
    },
  },
});

export const { setSyncStatus, setPendingChanges, addConflict, clearConflicts } = syncSlice.actions;
export default syncSlice.reducer;
