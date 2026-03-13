import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import clientaxiosinstance from "@/lib/services/clientaxiosinstance";
import { CategoriesState } from "@/lib/redux/types/product-categories-state";

import axios from "axios";

const initialState: CategoriesState = {
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  category: {} as Category,
  categoryLoading: false,
  categoryError: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
  },
};

export const fetchServiceCategories = createAsyncThunk(
  "services/fetchServiceCategories",
  async (page: number = 1) => {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.get(
      `/service-categories?page=${page}`,
    );
    return response.data;
  },
);

export const searchServiceCategories = createAsyncThunk(
  "services/searchServiceCategories",
  async (searchTerm: string = "") => {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.get(
      `/service-categories/search?searchTerm=${searchTerm}`,
    );
    return response.data;
  },
);

interface CreateCategoryPayload {
  name: string;
  description: string;
  image: File | null;
  custom_fields?: CustomField[];
}

export const createServiceCategory = createAsyncThunk(
  "services/createServiceCategory",
  async (categoryData: CreateCategoryPayload, { rejectWithValue }) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");

      const formData = new FormData();

      formData.append("name", categoryData.name);
      formData.append("description", categoryData.description);

      if (categoryData.image) {
        formData.append("image", categoryData.image);
      }

      // Manually serialize custom_fields so Laravel receives the correct
      // dot-notation keys with plain scalar values — avoids objectToFormData
      // sending options as "[object Object]" or JSON blobs.
      if (categoryData.custom_fields?.length) {
        categoryData.custom_fields.forEach((field, index) => {
          const prefix = `custom_fields[${index}]`;

          formData.append(`${prefix}[id]`, field.id);
          formData.append(`${prefix}[label]`, field.label);
          formData.append(`${prefix}[type]`, field.type);
          formData.append(`${prefix}[required]`, field.required ? "1" : "0");

          if (field.placeholder != null) {
            formData.append(`${prefix}[placeholder]`, field.placeholder);
          }

          if (field.help_text != null) {
            formData.append(`${prefix}[help_text]`, field.help_text);
          }

          if (field.min != null) {
            formData.append(`${prefix}[min]`, String(field.min));
          }

          if (field.max != null) {
            formData.append(`${prefix}[max]`, String(field.max));
          }

          if (field.prefix != null) {
            formData.append(`${prefix}[prefix]`, field.prefix);
          }

          // Each option must be appended as a plain string individually.
          if (field.options?.length) {
            field.options.forEach((option, optIndex) => {
              formData.append(
                `${prefix}[options][${optIndex}]`,
                String(option),
              );
            });
          }
        });
      }

      const response = await clientaxiosinstance.post(
        "/service-categories",
        formData,
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data;
        const message =
          data?.message ||
          Object.values(data?.errors ?? {})
            .flat()
            .join(", ") ||
          "Failed to create service category.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Failed to create service category.");
    }
  },
);

export const serviceCategoriesSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchServiceCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchServiceCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.data;
        state.pagination = {
          currentPage: action.payload.current_page,
          lastPage: action.payload.last_page,
          total: action.payload.total,
        };
        state.categoriesError = null;
      })
      .addCase(fetchServiceCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.error.message ?? "An error occurred";
      })
      .addCase(createServiceCategory.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(createServiceCategory.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories.push(action.payload);
        state.categoriesError = null;
      })
      .addCase(createServiceCategory.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.error.message ?? "An error occurred";
      })
      .addCase(searchServiceCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(searchServiceCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.data;
        state.pagination = {
          currentPage: action.payload.current_page,
          lastPage: action.payload.last_page,
          total: action.payload.total,
        };
        state.categoriesError = null;
      })
      .addCase(searchServiceCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.error.message ?? "An error occurred";
      });
  },
});

export default serviceCategoriesSlice.reducer;
