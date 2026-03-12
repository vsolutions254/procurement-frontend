import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import merchantsReducer from "./features/merchants/merchantSlice";
import productsReducer from "./features/products/productsSlice";
import servicesReducer from "./features/services/servicesSlice";
import productCategoriesReducer from "./features/products/categories/categoriesSlice";
import serviceCategoriesReducer from "./features/services/categories/serviceCategoriesSlice";
import suppliersReducer from "./features/suppliers/supplierSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      merchants: merchantsReducer,
      products: productsReducer,
      services: servicesReducer,
      product_categories: productCategoriesReducer,
      service_categories: serviceCategoriesReducer,
      suppliers: suppliersReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
