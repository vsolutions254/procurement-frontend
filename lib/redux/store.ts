import {
  configureStore,
  type ThunkDispatch,
  type UnknownAction,
} from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import merchantsReducer from "./features/merchants/merchantSlice";
import productsReducer from "./features/products/productsSlice";
import productsCartReducer from "./features/products/cart/cartSlice";
import servicesCartReducer from "./features/services/cart/cartSlice";
import servicesReducer from "./features/services/servicesSlice";
import productCategoriesReducer from "./features/products/categories/categoriesSlice";
import serviceCategoriesReducer from "./features/services/categories/serviceCategoriesSlice";
import recommendedItemsReducer from "./features/recommended-items/recommendedItemsSlice";
import suppliersReducer from "./features/suppliers/supplierSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      merchants: merchantsReducer,
      products: productsReducer,
      products_cart: productsCartReducer,
      services_cart: servicesCartReducer,
      services: servicesReducer,
      product_categories: productCategoriesReducer,
      service_categories: serviceCategoriesReducer,
      recommended_items: recommendedItemsReducer,
      suppliers: suppliersReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = ThunkDispatch<RootState, undefined, UnknownAction>;
