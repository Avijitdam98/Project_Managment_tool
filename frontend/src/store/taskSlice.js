import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async thunks
export const addTaskDependency = createAsyncThunk(
  'tasks/addDependency',
  async ({ taskId, dependencyData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/tasks/${taskId}/dependencies`, dependencyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add dependency');
    }
  }
);

export const removeTaskDependency = createAsyncThunk(
  'tasks/removeDependency',
  async ({ taskId, dependencyId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/tasks/${taskId}/dependencies/${dependencyId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove dependency');
    }
  }
);

export const fetchTaskDependencies = createAsyncThunk(
  'tasks/fetchDependencies',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/tasks/${taskId}/dependencies`);
      return { taskId, dependencies: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch dependencies');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: {},
    loading: false,
    error: null,
  },
  reducers: {
    updateTask: (state, action) => {
      const { taskId, updates } = action.payload;
      state.tasks[taskId] = { ...state.tasks[taskId], ...updates };
    },
    deleteTask: (state, action) => {
      delete state.tasks[action.payload];
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add dependency
      .addCase(addTaskDependency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskDependency.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks[action.payload._id] = action.payload;
      })
      .addCase(addTaskDependency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove dependency
      .addCase(removeTaskDependency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTaskDependency.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks[action.payload._id] = action.payload;
      })
      .addCase(removeTaskDependency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch dependencies
      .addCase(fetchTaskDependencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskDependencies.fulfilled, (state, action) => {
        state.loading = false;
        if (state.tasks[action.payload.taskId]) {
          state.tasks[action.payload.taskId].dependencies = action.payload.dependencies;
        }
      })
      .addCase(fetchTaskDependencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateTask, deleteTask, setTasks, setLoading, setError } = taskSlice.actions;
export default taskSlice.reducer;
