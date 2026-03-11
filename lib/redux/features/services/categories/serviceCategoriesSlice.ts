import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import clientaxiosinstance from "@/lib/services/clientaxiosinstance";
import { CategoriesState } from "@/lib/redux/types/product-categories-state";
import { Category } from "@/types/category";

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
}

export const createServiceCategory = createAsyncThunk(
  "services/createServiceCategory",
  async (categoryData: CreateCategoryPayload) => {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("description", categoryData.description);
    if (categoryData.image) {
      formData.append("image", categoryData.image);
    }
    const response = await clientaxiosinstance.post(
      `/service-categories`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
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
