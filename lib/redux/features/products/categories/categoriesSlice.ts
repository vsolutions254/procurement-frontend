import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import clientaxiosinstance from "@/lib/services/clientaxiosinstance";
import { CategoriesState } from "@/lib/redux/types/product-categories-state";

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

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (page: number = 1) => {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.get(
      `/product-categories?page=${page}`,
    );
    return response.data;
  },
);

export const searchCategories = createAsyncThunk(
  "products/searchCategories",
  async (searchTerm: string = "") => {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const response = await clientaxiosinstance.get(
      `/product-categories/search?searchTerm=${searchTerm}`,
    );
    return response.data;
  },
);

interface CreateCategoryPayload {
  name: string;
  description: string;
  image: File | null;
}

export const createCategory = createAsyncThunk(
  "products/createCategory",
  async (categoryData: CreateCategoryPayload) => {
    await clientaxiosinstance.get("/sanctum/csrf-cookie");
    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("description", categoryData.description);
    if (categoryData.image) {
      formData.append("image", categoryData.image);
    }
    const response = await clientaxiosinstance.post(
      `/product-categories`,
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

export const productCategoriesSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.data;
        state.pagination = {
          currentPage: action.payload.current_page,
          lastPage: action.payload.last_page,
          total: action.payload.total,
        };
        state.categoriesError = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.error.message ?? "An error occurred";
      })
      .addCase(createCategory.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories.push(action.payload);
        state.categoriesError = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.error.message ?? "An error occurred";
      })
      .addCase(searchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.data;
        state.pagination = {
          currentPage: action.payload.current_page,
          lastPage: action.payload.last_page,
          total: action.payload.total,
        };
        state.categoriesError = null;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.error.message ?? "An error occurred";
      });
  },
});

export default productCategoriesSlice.reducer;
