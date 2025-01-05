import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";


export const fetchStats = createAsyncThunk(
  "stats/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching stats...");
      const statsResponse = await axiosInstance.get("/admin/stats/users");
      const coursesResponse = await axiosInstance.get("/courses");

      const courses = Array.isArray(coursesResponse.data)
        ? coursesResponse.data
        : coursesResponse.data.courses || [];

      const stats = {
        totalUsers: statsResponse.data.stats.allUsersCount,
        subscribedUsersCount: statsResponse.data.stats.subscribedUsersCount,
        totalCourses: courses.length,
        totalVideos: courses.reduce(
          (total, course) => total + (course.numberOfLessons || 0),
          0
        ),
        courses: courses,
        
      };

      console.log("Fetched stats:", stats);
      return stats;
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 401) {
        return rejectWithValue("Authentication token expired or invalid");
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "stats/deleteCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      console.log(`Deleting course with ID: ${courseId}`);
      await axiosInstance.delete(`/courses/${courseId}`);
      console.log("Course deleted successfully:", courseId);
      return courseId;
    } catch (error) {
      console.error("Error deleting course:", error);
      if (error.response?.status === 401) {
        return rejectWithValue("Authentication token expired or invalid");
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete course"
      );
    }
  }
);

// Simplified statsSlice
const statsSlice = createSlice({
  name: "stats",
  initialState: {
    data: {
      totalUsers: 0,
      totalCourses: 0,
      totalVideos: 0,
      courses: [],
      allUsersCount: 0,
      subscribedUsersCount:0,
    },
    loading: false,
    error: null,
    refreshing: false,
  },
  reducers: {
    clearError: (state) => {
      console.log("Clearing error state");
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching stats in progress...");
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        console.log("Stats fetched successfully:", action.payload);
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Error fetching stats:", action.payload);
      })
      .addCase(deleteCourse.pending, (state) => {
        state.refreshing = true;
        console.log("Deleting course in progress...");
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.refreshing = false;
        state.data.courses = state.data.courses.filter(
          (course) => course._id !== action.payload
        );
        state.data.totalCourses = state.data.courses.length;
        state.data.totalVideos = state.data.courses.reduce(
          (total, course) => total + (course.numberOfLessons || 0),
          0
        );
        state.error = null;
        console.log("Course deleted and updated stats:", state.data);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.refreshing = false;
        state.error = action.payload;
        console.error("Error deleting course:", action.payload);
      });
    
  },
});

export const { clearError } = statsSlice.actions;
export default statsSlice.reducer;
