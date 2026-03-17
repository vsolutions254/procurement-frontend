import clientaxiosinstance from "@/lib/services/clientaxiosinstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clearCart } from "@/lib/redux/features/products/cart/cartSlice";
import axios from "axios";

const initialState: ServiceCartState = {
  services: [],
  servicesLoading: false,
  servicesError: null,
  serviceDetails: {},
  serviceDetailsLoading: {},
};

export const getCartServices = createAsyncThunk<
  RawCartService[],
  void,
  { rejectValue: string }
>("servicesCart/getCartServices", async (_, { rejectWithValue }) => {
  try {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.get("/cart/services");
    return response.data as RawCartService[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const getCartService = createAsyncThunk<
  { service_id: number; service: service_fields },
  number,
  { rejectValue: string }
>("servicesCart/getCartService", async (service_id, { rejectWithValue }) => {
  try {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.get(`/services/${service_id}`);
    return { service_id, service: response.data as service_fields };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const addServiceToCart = createAsyncThunk<
  RawCartService[],
  { service_id: number; quantity: number; custom_values: CustomFieldValue[] },
  { rejectValue: string }
>("servicesCart/addServiceToCart", async (payload, { rejectWithValue }) => {
  try {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.post("/cart/services/add", payload);
    return response.data as RawCartService[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const updateCartService = createAsyncThunk<
  RawCartService[],
  { service_id: number; quantity: number; custom_values: CustomFieldValue[] },
  { rejectValue: string }
>("servicesCart/updateCartService", async (payload, { rejectWithValue }) => {
  try {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.put("/cart/services/update", payload);
    return response.data as RawCartService[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const updateCartServiceQuantity = createAsyncThunk<
  RawCartService[],
  { service_id: number; quantity: number },
  { rejectValue: string }
>("servicesCart/updateCartServiceQuantity", async (payload, { rejectWithValue }) => {
  try {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.put("/cart/services/update-quantity", payload);
    return response.data as RawCartService[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const removeCartService = createAsyncThunk<
  RawCartService[],
  number,
  { rejectValue: string }
>("servicesCart/removeCartService", async (service_id, { rejectWithValue }) => {
  try {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.delete("/cart/services/remove", {
      data: { service_id },
    });
    return response.data as RawCartService[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

const servicesCartSlice = createSlice({
  name: "servicesCart",
  initialState,
  reducers: {
    resetServicesCart: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getCartServices.pending, (state) => {
        state.servicesLoading = true;
        state.servicesError = null;
      })
      .addCase(getCartServices.fulfilled, (state, action) => {
        state.servicesLoading = false;
        state.services = action.payload;
      })
      .addCase(getCartServices.rejected, (state, action) => {
        state.servicesLoading = false;
        state.servicesError = action.payload ?? "Failed to fetch cart services";
      })
      .addCase(getCartService.pending, (state, action) => {
        state.serviceDetailsLoading[action.meta.arg] = true;
      })
      .addCase(getCartService.fulfilled, (state, action) => {
        const { service_id, service } = action.payload;
        state.serviceDetailsLoading[service_id] = false;
        state.serviceDetails[service_id] = service;
      })
      .addCase(getCartService.rejected, (state, action) => {
        state.serviceDetailsLoading[action.meta.arg] = false;
      })
      .addCase(addServiceToCart.fulfilled, (state, action) => {
        state.services = action.payload;
      })
      .addCase(updateCartService.fulfilled, (state, action) => {
        state.services = action.payload;
      })
      .addCase(updateCartServiceQuantity.fulfilled, (state, action) => {
        state.services = action.payload;
      })
      .addCase(removeCartService.fulfilled, (state, action) => {
        const removedId = action.meta.arg;
        state.services = action.payload;
        delete state.serviceDetails[removedId];
        delete state.serviceDetailsLoading[removedId];
      })
      .addCase(clearCart.fulfilled, () => initialState);
  },
});

export const { resetServicesCart } = servicesCartSlice.actions;
export default servicesCartSlice.reducer;
