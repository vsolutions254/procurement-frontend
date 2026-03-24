import { createSlice } from "@reduxjs/toolkit";

const initialState: RecommendedItemsState = {
  recommended_items: [],
  recommended_items_loading: false,
  recommended_items_error: null,
  recommended_item: null,
  recommended_item_loading: false,
  recommended_item_error: null,
};

const recommendedItemsSlice = createSlice({
  name: "recommendedItems",
  initialState,
  reducers: {},
  extraReducers() {},
});

export default recommendedItemsSlice.reducer;
