import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../services/axios';
import { toast } from 'react-toastify';

// Async thunks
export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/boards');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch boards');
    }
  }
);

export const fetchBoardDetails = createAsyncThunk(
  'boards/fetchBoardDetails',
  async (boardId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/boards/${boardId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch board details');
    }
  }
);

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (boardData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/boards', boardData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create board');
    }
  }
);

export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async ({ boardId, boardData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/boards/${boardId}`, boardData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update board');
    }
  }
);

export const deleteBoard = createAsyncThunk(
  'boards/deleteBoard',
  async (boardId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/boards/${boardId}`);
      return boardId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete board');
    }
  }
);

export const addColumn = createAsyncThunk(
  'boards/addColumn',
  async ({ boardId, columnData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/boards/${boardId}/columns`, columnData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add column');
    }
  }
);

export const addTask = createAsyncThunk(
  'boards/addTask',
  async ({ boardId, columnId, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/boards/${boardId}/columns/${columnId}/tasks`, taskData);
      return { boardId, columnId, task: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'boards/updateTask',
  async ({ boardId, columnId, taskId, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
        taskData
      );
      return { boardId, columnId, taskId, task: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const moveTask = createAsyncThunk(
  'boards/moveTask',
  async ({ boardId, taskId, sourceColumnIndex, destinationColumnIndex, position }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/boards/${boardId}/tasks/${taskId}/move`, {
        sourceColumnIndex,
        destinationColumnIndex,
        position
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to move task');
    }
  }
);

const initialState = {
  boards: [],
  filteredBoards: [],
  currentBoard: null,
  loading: false,
  error: null,
  searchQuery: '',
};

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      if (action.payload) {
        state.filteredBoards = state.boards.filter(board =>
          board.title.toLowerCase().includes(action.payload.toLowerCase()) ||
          board.description?.toLowerCase().includes(action.payload.toLowerCase())
        );
      } else {
        state.filteredBoards = state.boards;
      }
    },
    clearBoardState(state) {
      state.currentBoard = null;
      state.error = null;
    },
    updateCurrentBoard: (state, action) => {
      state.currentBoard = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch Boards
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
        state.filteredBoards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to fetch boards');
      })

    // Fetch Board Details
      .addCase(fetchBoardDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBoard = action.payload;
      })
      .addCase(fetchBoardDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to fetch board details');
      })

    // Create Board
      .addCase(createBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boards.unshift(action.payload);
        state.filteredBoards = state.boards;
        toast.success('Board created successfully');
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to create board');
      })

    // Update Board
      .addCase(updateBoard.fulfilled, (state, action) => {
        const index = state.boards.findIndex(board => board._id === action.payload._id);
        if (index !== -1) {
          state.boards[index] = action.payload;
          state.filteredBoards = state.boards;
        }
        if (state.currentBoard?._id === action.payload._id) {
          state.currentBoard = action.payload;
        }
        toast.success('Board updated successfully');
      })

    // Delete Board
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter(board => board._id !== action.payload);
        state.filteredBoards = state.filteredBoards.filter(board => board._id !== action.payload);
        if (state.currentBoard?._id === action.payload) {
          state.currentBoard = null;
        }
        toast.success('Board deleted successfully');
      })

    // Add Column
      .addCase(addColumn.fulfilled, (state, action) => {
        const board = state.boards.find(b => b._id === action.payload._id);
        if (board) {
          Object.assign(board, action.payload);
        }
        if (state.currentBoard?._id === action.payload._id) {
          state.currentBoard = action.payload;
        }
      })

    // Add Task
      .addCase(addTask.fulfilled, (state, action) => {
        if (state.currentBoard?._id === action.payload.boardId) {
          const column = state.currentBoard.columns.find(col => col._id === action.payload.columnId);
          if (column) {
            column.tasks.push(action.payload.task);
          }
        }
      })

    // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        if (state.currentBoard?._id === action.payload.boardId) {
          const column = state.currentBoard.columns.find(col => col._id === action.payload.columnId);
          if (column) {
            const taskIndex = column.tasks.findIndex(task => task._id === action.payload.taskId);
            if (taskIndex !== -1) {
              column.tasks[taskIndex] = action.payload.task;
            }
          }
        }
      })

    // Move Task
      .addCase(moveTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        state.loading = false;
        // The board will be refreshed via fetchBoardDetails
      })
      .addCase(moveTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSearchQuery, clearBoardState, updateCurrentBoard } = boardSlice.actions;

export default boardSlice.reducer;
