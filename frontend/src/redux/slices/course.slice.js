import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const handleApiError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  return errorMessage;
};

export const getAllCourses = createAsyncThunk(
  'courses/getAllCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/courses');
      return response.data.courses;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getLessonsByCourseId = createAsyncThunk(
  'courses/getLessonsByCourseId',
  async (courseId, { rejectWithValue }) => {
    try {
      if (!courseId) throw new Error('Course ID is required');
      const response = await axiosInstance.get(`/courses/${courseId}`);
      return response.data.course;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/courses', courseData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.course;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ courseId, courseData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/courses/${courseId}`, courseData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.course;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const removeCourse = createAsyncThunk(
  'courses/removeCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/courses/${courseId}`);
      return courseId;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const addLessonToCourseById = createAsyncThunk(
  'courses/addLessonToCourseById',
  async ({ courseId, lessonData }, { rejectWithValue }) => {
    try {
      if (!courseId || !lessonData) throw new Error('Course ID and lesson data are required');
      const response = await axiosInstance.post(
        `/courses/${courseId}/lesson`,
        lessonData,
        { headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' } }
      );
      return response.data.course;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateCourseLesson = createAsyncThunk(
  'courses/updateCourseLesson',
  async ({ courseId, lessonId, lessonData }, { rejectWithValue }) => {
    try {
      if (!courseId || !lessonId || !lessonData) throw new Error('Course ID, lesson ID, and lesson data are required');
      const response = await axiosInstance.put(
        `/courses/${courseId}/lesson/${lessonId}`,
        lessonData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.course;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteCourseLesson = createAsyncThunk(
  'courses/deleteCourseLesson',
  async ({ courseId, lessonId }, { rejectWithValue, dispatch }) => {
    try {
      if (!courseId || !lessonId) throw new Error('Course ID and lesson ID are required');
      const response = await axiosInstance.delete(`/courses/${courseId}/lesson/${lessonId}`);
      // Fetch fresh course data after deletion
      await dispatch(getLessonsByCourseId(courseId));
      return response.data.course;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    currentCourse: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCurrentCourse: (state) => {
      state.currentCourse = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getAllCourses
      .addCase(getAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(getAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getLessonsByCourseId
      .addCase(getLessonsByCourseId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLessonsByCourseId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(getLessonsByCourseId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createCourse
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
        state.error = null;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateCourse
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courses.findIndex((course) => course._id === action.payload._id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // removeCourse
      .addCase(removeCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter((course) => course._id !== action.payload);
        state.error = null;
      })
      .addCase(removeCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addLessonToCourseById
      .addCase(addLessonToCourseById.pending, (state) => {
        state.loading = true;
      })
      .addCase(addLessonToCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
        state.error = null;
      })
      .addCase(addLessonToCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateCourseLesson
      .addCase(updateCourseLesson.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCourseLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
        state.error = null;
      })
      .addCase(updateCourseLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteCourseLesson
      .addCase(deleteCourseLesson.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCourseLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
        state.error = null;
      })
      .addCase(deleteCourseLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
