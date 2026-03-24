import {
  configureStore,
  type ThunkDispatch,
  type UnknownAction,
} from "@reduxjs/toolkit";
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
import requisitionsReducer from "./features/requisitions/requisitionsSlice";
import productCategoriesReducer from "./features/products/categories/categoriesSlice";
import serviceCategoriesReducer from "./features/services/categories/serviceCategoriesSlice";
import recommendedItemsReducer from "./features/recommended-items/recommendedItemsSlice";
import suppliersReducer from "./features/suppliers/supplierSlice";
import projectsReducer from "./features/projects/projectsSlice";
import costCentersSlice from "./features/cost-centers/costCentersSlice";
import locationsReducer from "./features/locations/locationsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      merchants: merchantsReducer,
      products: productsReducer,
      products_cart: productsCartReducer,
      services_cart: servicesCartReducer,
      services: servicesReducer,
      projects: projectsReducer,
      cost_centers: costCentersSlice,
      locations: locationsReducer,
      product_categories: productCategoriesReducer,
      service_categories: serviceCategoriesReducer,
      requisitions: requisitionsReducer,
      suppliers: suppliersReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = ThunkDispatch<RootState, undefined, UnknownAction>;
