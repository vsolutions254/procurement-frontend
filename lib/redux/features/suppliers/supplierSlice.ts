import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import clientaxiosinstance from "@/lib/services/clientaxiosinstance";

import { SuppliersState } from "../../types/suppliers-state";

const initialState: SuppliersState = {
  suppliers: [],
  suppliersLoading: false,
  suppliersError: null,
  supplier: {} as User,
  supplierLoading: false,
  supplierError: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
  },
};

export const fetchSuppliers = createAsyncThunk(
  "products/fetchSuppliers",
  async (page: number = 1) => {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.get(`/suppliers?page=${page}`);
    return response.data;
  },
);

export const searchSuppliers = createAsyncThunk(
  "products/searchSuppliers",
  async (searchTerm: string = "") => {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.get(
      `/suppliers/search?searchTerm=${searchTerm}`,
    );
    return response.data;
  },
);

export const suppliersSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.suppliersLoading = true;
        state.suppliersError = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.suppliersLoading = false;
        state.suppliers = action.payload.data;
        state.pagination = {
          currentPage: action.payload.current_page,
          lastPage: action.payload.last_page,
          total: action.payload.total,
        };
        state.suppliersError = null;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.suppliersLoading = false;
        state.suppliersError = action.error.message ?? "An error occurred";
      })
      .addCase(searchSuppliers.pending, (state) => {
        state.suppliersLoading = true;
        state.suppliersError = null;
      })
      .addCase(searchSuppliers.fulfilled, (state, action) => {
        state.suppliersLoading = false;
        state.suppliers = action.payload.data;
        state.pagination = {
          currentPage: action.payload.current_page,
          lastPage: action.payload.last_page,
          total: action.payload.total,
        };
        state.suppliersError = null;
      })
      .addCase(searchSuppliers.rejected, (state, action) => {
        state.suppliersLoading = false;
        state.suppliersError = action.error.message ?? "An error occurred";
      });
  },
});

export default suppliersSlice.reducer;
