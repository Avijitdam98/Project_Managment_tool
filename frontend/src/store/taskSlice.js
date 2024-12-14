import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    updateTask: (state, action) => {
      const updatedTask = action.payload;
      const index = state.tasks.findIndex(task => task._id === updatedTask._id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
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
});

export const { updateTask, setTasks, setLoading, setError } = taskSlice.actions;

export default taskSlice.reducer;
