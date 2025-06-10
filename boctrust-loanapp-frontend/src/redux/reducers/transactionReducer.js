import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/axios";

// Thunk to fetch account from the API
export const fetchUserTransactions = createAsyncThunk(
  "transaction/fetchUserTransactions",
  async ({ accountNumber, fromDate, toDate }) => {
    let pathUrl = `/bankone/getUserTransactions/${accountNumber}`;

    if (fromDate) {
      pathUrl = pathUrl + `?fromDate=${fromDate}`;
      if (toDate) {
        pathUrl = pathUrl + `&toDate=${toDate}`;
      }
    }
    if (!fromDate && toDate) {
      pathUrl = pathUrl + `?toDate=${toDate}`;
    }

    const { data: transactionsData } = await apiClient.get(pathUrl);
    console.log(transactionsData, "transactionsData")
    console.log(pathUrl, "pathUrl")
    const transactionWithStatus = await Promise.all(
      transactionsData.Message.map(async (transaction) => {
        let statusData = null;
        if (transaction.InstrumentNo) {
          const { data } = await apiClient.post(
            `/bankone/transactionStatusQuery`,
            {
              ref: transaction.InstrumentNo,
              date: transaction.CurrentDate,
              amount: transaction.Amount,
            }
          );
          statusData = data;
        } else {
          statusData = {
            IsSuccessful: true,
            ResponseMessage: "Successful",
            ResponseCode: "00",
            Reference: null,
            Status: "Successful",
          };
        }

        return { ...transaction, status: statusData.ResponseMessage };
      })
    );

    return transactionWithStatus;
  }
);

// customer slice
const transactionsSlice = createSlice({
  name: "customers",
  initialState: {
    userTransactions: null,
    status: "idle",
    error: null,
  },
  reducers: {
    updateTransactionState: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchUserTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userTransactions = action.payload;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateTransactionState } = transactionsSlice.actions;

export default transactionsSlice.reducer;
