import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createQuery, fetchAllQueries } from './queryAPI';
import { toast } from 'react-toastify';

const initialState = {
  value: 0,
  status: 'idle',
  queries: []
};

export const createQueryAsync = createAsyncThunk(
  'query/createQuery',
  async (queryObject) => {
    const response = await createQuery(queryObject);
    toast.success('Query sent successfully!', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored"
    });
    return response.data;
  }
);

export const fetchAllQueriesAsync = createAsyncThunk(
  'query/fetchAllQueries',
  async () => {
    const response = await fetchAllQueries();
    return response.data;
  }
);

export const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createQueryAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createQueryAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.queries.push(action.payload);
      })
      .addCase(fetchAllQueriesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllQueriesAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.queries = action.payload;
      });
  },
});

export const { increment } = querySlice.actions;

export const selectAllQueries = (state) => state.query.queries;
export const selectTotalQueries = (state) => state.query.queries.length;

export default querySlice.reducer;