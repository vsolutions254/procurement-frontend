import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import clientaxiosinstance from "@/lib/services/clientaxiosinstance";
import axios from "axios";

const initialState: ProductsState = {
  products: [],
  productsLoading: false,
  productsError: null,
  product: {} as Product,
  productLoading: false,
  productError: null,
  pagination: {
    currentPage: 1,
    total: 0,
    last_page: 0,
  },
};

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product: FormData, { rejectWithValue }) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      const response = await clientaxiosinstance.post("/products", product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data[0] as Product;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async (params: EditProductArgs, { rejectWithValue }) => {
    try {
      const {
        product_id,
        product_name,
        category_id,
        suppliers,
        description,
        price,
        specifications,
      } = params;
      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      const response = await clientaxiosinstance.put(
        `/products/${product_id}`,
        {
          product_name,
          category_id,
          suppliers,
          description,
          price,
          specifications,
        },
        { headers: { "Content-Type": "application/json" } },
      );
      return response.data[0] as Product;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data ?? { message: error.message },
        );
      }
      return rejectWithValue({ message: "An unexpected error occurred" });
    }
  },
);

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (
    { page = 1, category_id, search_term, sort_by }: GetProductsArgs,
    { rejectWithValue },
  ) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");

      const response = await clientaxiosinstance.get("/products", {
        params: {
          page,
          category_id,
          search_term,
          sort_by,
        },
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const getProduct = createAsyncThunk(
  "products/getProduct",
  async (item_id: number, { rejectWithValue }) => {
    console.log("FIRED", item_id);
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");

      const response = await clientaxiosinstance.get(`/products/${item_id}`);

      return response.data as Product;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (product_id: string | number, { rejectWithValue }) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      await clientaxiosinstance.delete(`/products/${product_id}`);
      return product_id;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addProduct.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.productLoading = false;
        state.product = action.payload;
        // Reset products to empty array so the list re-fetches cleanly on redirect
        state.products = [];
        state.productError = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productError =
          (action.payload as { message?: string })?.message ??
          action.error.message ??
          "An error occurred";
      })
      .addCase(editProduct.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.productLoading = false;
        state.product = action.payload;
        state.productError = null;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productError =
          (action.payload as { message?: string })?.message ??
          action.error.message ??
          "An error occurred";
      })
      .addCase(getProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        const data = action.payload?.data ?? action.payload;
        state.products = Array.isArray(data) ? data : [];
        state.pagination = {
          currentPage: action.payload?.current_page ?? 1,
          total: action.payload?.total ?? 0,
          last_page: action.payload?.last_page ?? 0,
        };
        state.productsError = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.products = [];
        state.productsError =
          (action.payload as { message?: string })?.message ??
          action.error.message ??
          "An error occurred";
      })
      .addCase(getProduct.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.productLoading = false;
        state.product = action.payload;
        state.productError = null;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productError =
          (action.payload as { message?: string })?.message ??
          action.error.message ??
          "An error occurred";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.productLoading = false;
        state.products = state.products.filter(
          (p: Product) => String(p.id) !== String(action.payload),
        );
        state.productError = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productError =
          (action.payload as { message?: string })?.message ??
          action.error.message ??
          "An error occurred";
      });
  },
});

export default productsSlice.reducer;
