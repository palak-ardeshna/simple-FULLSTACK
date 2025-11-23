import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

// Initial state
const initialState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Get all users (with optional filters object for any field)
// Example: dispatch(getAllUsers({ role: "user", email: "test@example.com" }))
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (filters = {}, thunkAPI) => {
    try {
      const response = await userService.getAllUsers(filters);
      return response;
    } catch (error) {
      const message = error.message || "Failed to fetch users";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get user by ID
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId, thunkAPI) => {
    try {
      const response = await userService.getUserById(userId);
      return response;
    } catch (error) {
      const message = error.message || "Failed to fetch user";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Delete user by ID (admin only)
export const deleteUserById = createAsyncThunk(
  "user/deleteUserById",
  async (userId, thunkAPI) => {
    try {
      const response = await userService.deleteUserById(userId);
      return { userId, ...response };
    } catch (error) {
      const message = error.message || "Failed to delete user";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearError: (state) => {
      state.isError = false;
      state.message = "";
    },
    clearUsers: (state) => {
      state.users = [];
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.data || [];
        state.message = action.payload.message || "Users fetched successfully";
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.users = [];
      })
      // Get User By ID
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedUser = action.payload.data || null;
        state.message = action.payload.message || "User fetched successfully";
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.selectedUser = null;
      })
      // Delete User By ID
      .addCase(deleteUserById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Remove deleted user from users array
        state.users = state.users.filter(
          (user) => user.id !== action.payload.userId,
        );
        state.message = action.payload.message || "User deleted successfully";
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearError, clearUsers } = userSlice.actions;
export default userSlice.reducer;
