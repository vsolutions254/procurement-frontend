import clientaxiosinstance from "@/lib/services/clientaxiosinstance";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { LoginPayload } from "./types/login-user-payload";
import { RegisterPayload } from "./types/register-user-payload";
import { DocumentsUpload } from "./types/documents-upload-payload";

function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ??
      error.message ??
      "An unexpected error occurred"
    );
  }
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "An unknown error occurred";
}

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      const response = await clientaxiosinstance.get("/api/user");
      return response.data as User;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const editUserReq = createAsyncThunk<User, User>(
  "auth/editUserReq",
  async (user, { rejectWithValue }) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      const response = await clientaxiosinstance.post("/api/user/edit", user);
      return response.data as User;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const uploadProfilePic = createAsyncThunk<User, { avatar: File }>(
  "auth/uploadProfilePic",
  async ({ avatar }, { rejectWithValue }) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");

      const formData = new FormData();
      formData.append("file", avatar);

      const response = await clientaxiosinstance.post(
        "/api/user/edit",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data as User;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const login = createAsyncThunk<User, LoginPayload>(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      const response = await clientaxiosinstance.post("/login", {
        email,
        password,
      });
      return response.data as User;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const register = createAsyncThunk<User, RegisterPayload>(
  "auth/register",
  async (
    {
      role,
      companyInfo,
      warehouseDetails,
      financials,
      documents,
      accountDetails,
    },
    { rejectWithValue },
  ) => {
    try {
      const common = { role, companyInfo, accountDetails };
      const registrationData =
        role === "merchant"
          ? { ...common, warehouseDetails }
          : { ...common, financials, documents };

      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      const response = await clientaxiosinstance.post(
        "/register",
        registrationData,
      );
      return response.data as User;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      const response = await clientaxiosinstance.post("/logout");
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const logoutAll = createAsyncThunk(
  "auth/logoutAll",
  async (_, { rejectWithValue }) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      const response = await clientaxiosinstance.post("/logout-all");
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const uploadDocuments = createAsyncThunk<User, DocumentsUpload>(
  "auth/uploadDocuments",
  async (documents, { rejectWithValue }) => {
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");

      const formData = new FormData();
      Object.entries(documents).forEach(([key, file]) => {
        if (file instanceof File) {
          formData.append(key, file);
        }
      });

      const response = await clientaxiosinstance.post(
        "/upload-documents",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data as User;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "An error occurred";
      });

    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "An error occurred";
      });

    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "An error occurred";
      });

    builder
      .addCase(editUserReq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUserReq.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(editUserReq.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "An error occurred";
      });

    builder
      .addCase(uploadProfilePic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfilePic.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(uploadProfilePic.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "An error occurred";
      });

    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "An error occurred";
      });

    builder
      .addCase(logoutAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAll.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutAll.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "An error occurred";
      });

    builder
      .addCase(uploadDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(uploadDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "An error occurred";
      });
  },
});

export default authSlice.reducer;
