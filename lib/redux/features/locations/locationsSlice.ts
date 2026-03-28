import { createSlice } from "@reduxjs/toolkit";

const initialState: LocationState = {
  locations: [],
  locationsLoading: false,
  locationsError: null,
  location: null,
  locationLoading: false,
  locationError: null,
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {},
  extraReducers: () => {},
});

export default locationsSlice.reducer;
