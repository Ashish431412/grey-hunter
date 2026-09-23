import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, Task } from '@utils/types';

interface ProjectsState {
  projects: Project[];
  activeProject: Project | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  activeProject: null,
  tasks: [],
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setActiveProject: (state, action: PayloadAction<Project | null>) => {
      state.activeProject = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
  },
});

export const { setProjects, setActiveProject, setTasks, addTask, updateTask } = projectsSlice.actions;
export default projectsSlice.reducer;
