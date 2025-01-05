import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

const getAuthToken = () => localStorage.getItem("token");

const initialState = {
  key: "",
  subscription_id: "",
  isPaymentVerified: false,
  allPayments: {},
  finalMonths: {},
  monthlySalesRecord: [],
  error: null,
};

const handleError = (error, loadingId) => {
  const errorMessage = error?.message || "An error occurred";
  toast.error(errorMessage, { id: loadingId });
  throw error;
};

// Get Razorpay key ID
export const getRazorPayId = createAsyncThunk("/payments/keyId", async () => {
  const token = getAuthToken();
  try {
    const response = await axiosInstance.get("/payments/razorpay-key", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
});

// Purchase course bundle
export const purchaseCourseBundle = createAsyncThunk(
  "/payments/subscribe",
  async () => {
    const token = getAuthToken();
    try {
      const response = await axiosInstance.post("/payments/subscribe", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Subscription initialized");
      return response.data;
    } catch (error) {
      toast.error(error?.message || "Failed to purchase course bundle");
      throw error;
    }
  }
);

// Verify payment
export const verifyUserPayment = createAsyncThunk(
  "/payments/verify",
  async (data, { rejectWithValue }) => {
    const token = getAuthToken();
    const loadingId = toast.loading("Verifying payment...");

    try {
      const response = await axiosInstance.post("/payments/verify", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.dismiss(loadingId);

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error(error?.message || "Payment verification failed");
      return rejectWithValue(error?.message || "Payment verification failed");
    }
  }
);
export const getPaymentRecord = createAsyncThunk(
  "/payments/record",
  async () => {
    const token = getAuthToken();
    const loadingId = toast.loading("Fetching payment records...");
    try {
      const response = await axiosInstance.get("/payments?count=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.dismiss(loadingId);
      toast.success("Payment records loaded");
      return response.data;
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error(error?.message || "Failed to fetch payment records");
      throw error;
    }
  }
);

export const cancelCourseBundle = createAsyncThunk(
  "/payments/cancel",
  async (_, { rejectWithValue }) => {
    const token = getAuthToken(); // Retrieve token
    const loadingId = toast.loading("Cancelling subscription...");
    try {
      const response = await axiosInstance.post("/payments/unsubscribe", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.dismiss(loadingId);

      return response.data; 
    } catch (error) {
      toast.dismiss(loadingId); 
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while cancelling subscription";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const razorpaySlice = createSlice({
  name: "razorpay",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get RazorPay ID
    builder.addCase(getRazorPayId.fulfilled, (state, action) => {
      state.key = action.payload?.key;
    });

    // Purchase Course Bundle
    builder.addCase(purchaseCourseBundle.fulfilled, (state, action) => {
      state.subscription_id = action.payload?.subscription_id;
    });

    builder.addCase(verifyUserPayment.fulfilled, (state, action) => {
      state.isPaymentVerified = action.payload?.success;
    });

    builder.addCase(getPaymentRecord.fulfilled, (state, action) => {
      const { allPayments, finalMonths, monthlySalesRecord } = action.payload;
      state.allPayments = allPayments;
      state.finalMonths = finalMonths;
      state.monthlySalesRecord = monthlySalesRecord;
    });
    builder.addCase(getPaymentRecord.rejected, (state, action) => {
      state.error = action.error.message;
    });

    builder.addCase(cancelCourseBundle.fulfilled, (state) => {
      state.subscription_id = "";
    });

    // Handle rejected async thunks
    builder.addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state, action) => {
        state.error = action.error?.message || "An error occurred";
      }
    );
  },
});

export default razorpaySlice.reducer;
