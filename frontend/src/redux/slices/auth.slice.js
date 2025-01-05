import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Define initial state
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const isTokenExpired = (token) => {
  if (!token) return true;

  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const exp = decodedToken.exp * 1000;
  return Date.now() > exp;
};
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    const { token } = getState().auth;

    if (!token || isTokenExpired(token)) {
      return rejectWithValue('Authentication token expired');
    }

    try {
      const response = await axiosInstance.post('/auth/refresh', { token });
      const { newToken, user } = response.data;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(user));
      return { token: newToken, user };
    } catch (error) {
      return rejectWithValue('Failed to refresh token');
    }
  }
);

// Async Thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Register API Response:', response.data); // Log the response for debugging
      return response.data;
    } catch (error) {
      console.error('Register API Error:', error); // Log the entire error for better insight

      // Check if error response exists and contains data
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        // Fallback error message if no response data is available
        return rejectWithValue('Registration failed due to unknown error');
      }
    }
  }
);


export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/profile');

      if (response.data && response.data.user === null) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        dispatch(logout());
        return rejectWithValue('User has been deleted');
      }

      return response.data; 
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      dispatch(logout());
      return rejectWithValue(error.response?.data || 'Failed to fetch profile');
    }
  }
);




export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { dispatch, rejectWithValue }) => {
    try {
      console.log("Sending profile update request with data:", profileData);
      const response = await axiosInstance.put('/auth/profile/update', profileData);
      console.log("Profile update response:", response.data);
      
      // Update local storage with the new user data
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data; // Return the updated user data
    } catch (error) {
      console.error("Profile update failed:", error);
      return rejectWithValue(error.response?.data || 'Failed to update profile');
    }
  }
);


export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/auth/profile/change-password', passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to change password');
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        const { token, user } = action.payload;

        if (token && user) {
          state.token = token;
          state.user = user;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          console.log('User and token saved to localStorage');
        } else {
          console.error('Invalid payload from register API:', action.payload);
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        console.log("Updating profile...");
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        console.log("Profile update successful:", action.payload);
        state.loading = false;
        state.user = action.payload.user; // Update the user in the state
        localStorage.setItem('user', JSON.stringify(action.payload.user)); // Ensure local storage is updated
      })
      
      .addCase(updateProfile.rejected, (state, action) => {
        console.error("Profile update failed:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
