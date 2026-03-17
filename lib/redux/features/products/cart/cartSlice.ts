import clientaxiosinstance from "@/lib/services/clientaxiosinstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: ProductCartState = {
  products: [],
  productsLoading: false,
  productsError: null,
  productDetails: {},
  productDetailsLoading: {},
};

export const getCartProducts = createAsyncThunk<
  CartProduct[],
  void,
  { rejectValue: string }
>("productsCart/getCartProducts", async (_, { rejectWithValue }) => {
  try {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.get("/cart/products");
    return response.data as CartProduct[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const getCartProduct = createAsyncThunk<
  { product_id: number; product: Product },
  number,
  { rejectValue: string }
>("productsCart/getCartProduct", async (product_id, { rejectWithValue }) => {
  try {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.get(`/products/${product_id}`);
    return { product_id, product: response.data as Product };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const addProductToCart = createAsyncThunk<
  CartProduct[],
  CartProduct,
  { rejectValue: string }
>("productsCart/addProductToCart", async (cartProduct: CartProduct, { rejectWithValue }) => {
  try {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.post("/cart/products/add", cartProduct, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data as CartProduct[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const updateCartProductQuantity = createAsyncThunk<
  CartProduct[],
  CartProduct,
  { rejectValue: string }
>("productsCart/updateCartProductQuantity", async (cartProduct, { rejectWithValue }) => {
  try {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.put("/cart/products/update-quantity", cartProduct);
    return response.data as CartProduct[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const removeCartProduct = createAsyncThunk<
  CartProduct[],
  number,
  { rejectValue: string }
>("productsCart/removeCartProduct", async (product_id, { rejectWithValue }) => {
  try {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.delete("/cart/products/remove", {
      data: { product_id },
    });
    return response.data as CartProduct[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const clearCart = createAsyncThunk<void, void, { rejectValue: string }>(
  "productsCart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      await clientaxiosinstance.delete("/cart/clear");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  },
);

const productsCartSlice = createSlice({
  name: "productsCart",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCartProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(getCartProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = action.payload;
      })
      .addCase(getCartProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload ?? "Failed to fetch cart products";
      })
      .addCase(getCartProduct.pending, (state, action) => {
        state.productDetailsLoading[action.meta.arg] = true;
      })
      .addCase(getCartProduct.fulfilled, (state, action) => {
        const { product_id, product } = action.payload;
        state.productDetailsLoading[product_id] = false;
        state.productDetails[product_id] = product;
      })
      .addCase(getCartProduct.rejected, (state, action) => {
        state.productDetailsLoading[action.meta.arg] = false;
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(updateCartProductQuantity.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(removeCartProduct.fulfilled, (state, action) => {
        state.products = action.payload;
        // Clean up cached product detail for removed item
        const removedId = action.meta.arg;
        delete state.productDetails[removedId];
        delete state.productDetailsLoading[removedId];
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.products = [];
        state.productDetails = {};
        state.productDetailsLoading = {};
      });
  },
});

export default productsCartSlice.reducer;
