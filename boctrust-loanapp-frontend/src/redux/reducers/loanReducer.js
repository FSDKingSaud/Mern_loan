import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/axios";

// Thunk to fetch Loans from the API
export const fetchMyLoans = createAsyncThunk(
  "loan/fetchMyLoans",
  async (customerId) => {
    const response = await apiClient.get(`/loans/my/${customerId}`);

    return response.data;
  }
);

// Thunk to fetch Loans from the API
export const fetchLoans = createAsyncThunk("loan/fetchLoans", async () => {
  const { data: allLoans } = await apiClient.get(`/loans`);

  const loanFullPayload = await Promise.all(
    allLoans.map(async (loan) => {
      const { data: loanBalance } = await apiClient.get(
        `/bankone/loanAccountBalance/${loan?.customer?.banking?.accountDetails?.CustomerID}`
      );

      return { ...loan, balance: loanBalance };
    })
  );

  return loanFullPayload;
});

// Thunk to fetch All Loans from the API
export const fetchAllLoans = createAsyncThunk(
  "loan/fetchAllLoans",
  async () => {
    const response = await apiClient.get(`/loans/all`);

    return response.data;
  }
);

// Thunk to fetch Pending Loans from the API
export const fetchPendingLoans = createAsyncThunk(
  "loan/fetchPendingLoans",
  async () => {
    const response = await apiClient.get(`/loans/pending`);

    return response.data;
  }
);

// Thunk to fetch Unbooked Loans from the API
export const fetchUnbookedLoans = createAsyncThunk(
  "loan/fetchUnbookedLoans",
  async () => {
    const response = await apiClient.get(`/loans/unbooked`);

    return response.data;
  }
);

// Thunk to fetch loan from the API
export const fetchBookedLoans = createAsyncThunk(
  "loan/fetchBookedLoans",
  async () => {
    const res = await apiClient.get(`/loans/booked`);

    return res.data;
  }
);
// Thunk to fetch loan from the API
export const fetchCompletedLoan = createAsyncThunk(
  "loan/fetchCompletedLoan",
  async () => {
    const res = await apiClient.get(`/loans/disbursed`);

    return res.data;
  }
);

export const fetchCompletedRemitaLoan = createAsyncThunk(
  "loan/fetchCompletedRemitaLoan",
  async () => {
    const res = await apiClient.get(`/remita/completed-loans`);

    return res.data;
  }
);

// Thunk to fetch overdue due from the API
export const fetchOverdueLoans = createAsyncThunk(
  "loan/fetchOverdueLoans",
  async ({ searchTerm, dateFilter }) => {
    let pathurl = `/loans/overdue`;
    if (searchTerm) {
      pathurl = pathurl + `?search=${searchTerm}`;
      if (dateFilter) {
        pathurl = pathurl + `&dateFilter=${dateFilter}`;
      }
    }
    if (dateFilter) {
      pathurl = pathurl + `?dateFilter=${dateFilter}`;
    }

    const res = await apiClient.get(pathurl);

    return res.data;
  }
);

// Thunk to fetch loan from the API
export const fetchCustomerLoans = createAsyncThunk(
  "loan/fetchCustomerLoans",
  async (customerId) => {
    const response = await apiClient.get(`/bankone/getLoansById/${customerId}`);

    return response.data.Message;
  }
);

export const fetchRemitaCollections = createAsyncThunk(
  "loan/fetchRemitaCollections",
  async (loanId) => {
    const { data } = await apiClient.get(
      `/remita/collection-notification?loanId=${loanId}`
    );

    return data;
  }
);

// Thunk to get loan repayent schedule
export const fetchLoanRepaymentSchedule = createAsyncThunk(
  "loan/fetchLoanRepaymentSchedule",
  async (loanAccountNumber) => {
    const response = await apiClient.get(
      `/bankone/getLoanRepaymentSchedule/${loanAccountNumber}`
    );

    return response.data;
  }
);

export const fetchCustomerLoanRepaymentSchedule = createAsyncThunk(
  "loan/fetchCustomerLoanRepaymentSchedule",
  async (customerId) => {
    const response = await apiClient.get(
      `/bankone/getLoanRepaymentSchedule/all/${customerId}`
    );

    return response.data;
  }
);

// Thunk to get loan repayent schedule
export const fetchLoanAccountBal = createAsyncThunk(
  "loan/fetchLoanAccountBal",
  async (customerId) => {
    const response = await apiClient.get(
      `/bankone/loanAccountBalance/${customerId}`
    );

    return response.data.Message;
  }
);

export const rejectLoan = createAsyncThunk(
  "loan/rejectLoan",
  async (loanId) => {
    const response = await apiClient.put(`/loans/status/${loanId}`, {
      loanstatus: "declined",
    });

    return response.data;
  }
);

export const fetchTerminatedOrDeclinedLoans = createAsyncThunk(
  "loan/fetchTerminatedLoans",
  async () => {
    const response = await apiClient.get(
      `/loans/declined-terminated`
    );

    return response.data;
  }
);

// customer slice
const loanSlice = createSlice({
  name: "customers",
  initialState: {
    allLoans: null,
    allLoansStatus: "idle",
    pendingLoans: null,
    unbookedLoans: null,
    bookedLoans: null,
    completedLoans: null,
    declinedOrTerminatedLoans: null,
    completedRemitaLoans: null,
    overdueLoans: null,
    selectedCustomerLoan: null,
    activeLoanRepaymentSchedule: [],
    customerLoanRepaymentSchedule: null,
    remitaCollection: null,
    loansAccountBalance: null,
    loanFirstInfo: null,
    status: "idle",
    error: null,
  },
  reducers: {
    updateLoanStateValues: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allLoans = action.payload;
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchMyLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allLoans = action.payload;
      })
      .addCase(fetchMyLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchAllLoans.pending, (state) => {
        state.allLoansStatus = "loading";
      })
      .addCase(fetchAllLoans.fulfilled, (state, action) => {
        state.allLoansStatus = "succeeded";
        state.allLoans = action.payload;
      })
      .addCase(fetchAllLoans.rejected, (state, action) => {
        state.allLoansStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPendingLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPendingLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pendingLoans = action.payload;
      })
      .addCase(fetchPendingLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUnbookedLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUnbookedLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.unbookedLoans = action.payload;
      })
      .addCase(fetchUnbookedLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchBookedLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBookedLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookedLoans = action.payload;
      })
      .addCase(fetchBookedLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchCompletedLoan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompletedLoan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.completedLoans = action.payload;
      })
      .addCase(fetchCompletedLoan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchCompletedRemitaLoan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompletedRemitaLoan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.completedRemitaLoans = action.payload;
      })
      .addCase(fetchCompletedRemitaLoan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchTerminatedOrDeclinedLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTerminatedOrDeclinedLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.declinedOrTerminatedLoans = action.payload;
      })
      .addCase(fetchTerminatedOrDeclinedLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchCustomerLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomerLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCustomerLoan = action.payload;
      })
      .addCase(fetchCustomerLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchRemitaCollections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRemitaCollections.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.remitaCollection = action.payload;
      })
      .addCase(fetchRemitaCollections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchLoanRepaymentSchedule.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoanRepaymentSchedule.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeLoanRepaymentSchedule = action.payload;
      })
      .addCase(fetchLoanRepaymentSchedule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchCustomerLoanRepaymentSchedule.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCustomerLoanRepaymentSchedule.fulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.customerLoanRepaymentSchedule = action.payload;
        }
      )
      .addCase(fetchCustomerLoanRepaymentSchedule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchLoanAccountBal.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoanAccountBal.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loansAccountBalance = action.payload;
      })
      .addCase(fetchLoanAccountBal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchOverdueLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOverdueLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.overdueLoans = action.payload;
      })
      .addCase(fetchOverdueLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateLoanStateValues } = loanSlice.actions;

export default loanSlice.reducer;
