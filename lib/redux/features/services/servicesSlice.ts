import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import clientaxiosinstance from "@/lib/services/clientaxiosinstance";
import axios from "axios";
import { ServicesState } from "../../types/services-state";

const initialState: ServicesState = {
  services: [],
  servicesLoading: false,
  servicesError: null,
  service: null,
  serviceLoading: false,
  serviceError: null,
  pagination: {
    currentPage: 1,
    total: 0,
    last_page: 0,
  },
};

export const addService = createAsyncThunk(
  "services/addService",
  async (service: FormData, { rejectWithValue }) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      const response = await clientaxiosinstance.post("/services", service, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data[0] as Service;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const editService = createAsyncThunk(
  "services/editService",
  async (params: EditServiceArgs, { rejectWithValue }) => {
    try {
      const {
        service_id,
        service_name,
        category_id,
        suppliers,
        description,
        price,
        specifications,
      } = params;
      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      const response = await clientaxiosinstance.put(
        `/services/${service_id}`,
        {
          service_name,
          category_id,
          suppliers,
          description,
          price,
          specifications,
        },
        { headers: { "Content-Type": "application/json" } },
      );
      return response.data[0] as Service;
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

export const getServices = createAsyncThunk(
  "services/getServices",
  async (
    { page = 1, category_id, search_term, sort_by }: GetServicesArgs,
    { rejectWithValue },
  ) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");

      const response = await clientaxiosinstance.get("/services", {
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

export const getService = createAsyncThunk(
  "services/getService",
  async (item_id: number, { rejectWithValue }) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");

      const response = await clientaxiosinstance.get(`/services/${item_id}`);

      console.log("SAVIS TATA", response.data);

      return response.data;
    } catch (error: unknown) {
      console.log("SAVIS ERAA", error);

      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (service_id: string | number, { rejectWithValue }) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      await clientaxiosinstance.delete(`/services/${service_id}`);
      return service_id;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addService.pending, (state) => {
        state.serviceLoading = true;
        state.serviceError = null;
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.serviceLoading = false;
        state.service = action.payload;
        // Reset services to empty array so the list re-fetches cleanly on redirect
        state.services = [];
        state.serviceError = null;
      })
      .addCase(addService.rejected, (state, action) => {
        state.serviceLoading = false;
        state.serviceError =
          (action.payload as { message?: string })?.message ??
          action.error.message ??
          "An error occurred";
      })
      .addCase(editService.pending, (state) => {
        state.serviceLoading = true;
        state.serviceError = null;
      })
      .addCase(editService.fulfilled, (state, action) => {
        state.serviceLoading = false;
        state.service = action.payload;
        state.serviceError = null;
      })
      .addCase(editService.rejected, (state, action) => {
        state.serviceLoading = false;
        state.serviceError =
          (action.payload as { message?: string })?.message ??
          action.error.message ??
          "An error occurred";
      })
      .addCase(getServices.pending, (state) => {
        state.servicesLoading = true;
        state.servicesError = null;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        console.log("getServices payload:", action.payload);
        state.servicesLoading = false;
        const data = action.payload?.data ?? action.payload;
        state.services = Array.isArray(data) ? data : [];
        state.pagination = {
          currentPage: action.payload?.current_page ?? 1,
          total: action.payload?.total ?? 0,
          last_page: action.payload?.last_page ?? 0,
        };
        state.servicesError = null;
      })
      .addCase(getServices.rejected, (state, action) => {
        state.servicesLoading = false;
        state.services = [];
        state.servicesError =
          (action.payload as { message?: string })?.message ??
          action.error.message ??
          "An error occurred";
      })
      .addCase(getService.pending, (state) => {
        state.serviceLoading = true;
        state.serviceError = null;
      })
      .addCase(getService.fulfilled, (state, action) => {
        state.serviceLoading = false;
        state.service = action.payload;
        state.serviceError = null;
      })
      .addCase(getService.rejected, (state, action) => {
        state.serviceLoading = false;
        state.serviceError =
          (action.payload as { message?: string })?.message ??
          action.error.message ??
          "An error occurred";
      })
      .addCase(deleteService.pending, (state) => {
        state.serviceLoading = true;
        state.serviceError = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.serviceLoading = false;
        state.services = state.services.filter(
          (p) => String(p.id) !== String(action.payload),
        );
        state.serviceError = null;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.serviceLoading = false;
        state.serviceError =
          (action.payload as { message?: string })?.message ??
          action.error.message ??
          "An error occurred";
      });
  },
});

export default servicesSlice.reducer;
