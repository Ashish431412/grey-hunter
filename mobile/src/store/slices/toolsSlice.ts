import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tool } from '@utils/types';

interface ToolsState {
  catalog: Tool[];
  activeExecution: { toolId: string; status: 'running' | 'completed' | 'failed' } | null;
  results: Record<string, any>;
  filters: { category: string | null; offlineOnly: boolean };
}

const initialState: ToolsState = {
  catalog: [],
  activeExecution: null,
  results: {},
  filters: { category: null, offlineOnly: false },
};

const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    setCatalog: (state, action: PayloadAction<Tool[]>) => {
      state.catalog = action.payload;
    },
    setActiveExecution: (state, action: PayloadAction<ToolsState['activeExecution']>) => {
      state.activeExecution = action.payload;
    },
    addResult: (state, action: PayloadAction<{ id: string; data: any }>) => {
      state.results[action.payload.id] = action.payload.data;
    },
    setFilters: (state, action: PayloadAction<Partial<ToolsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const { setCatalog, setActiveExecution, addResult, setFilters } = toolsSlice.actions;
export default toolsSlice.reducer;
