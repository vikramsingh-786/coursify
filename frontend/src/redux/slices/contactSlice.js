import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance'; 

// Async action for contacting support
export const contactUs = createAsyncThunk(
  'contact/contactUs',
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/contact', contactData); 
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data); 
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    loading: false,
    success: false,
    message: '',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(contactUs.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(contactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(contactUs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload.message || 'Error contacting support';
      });
  },
});

export default contactSlice.reducer;
