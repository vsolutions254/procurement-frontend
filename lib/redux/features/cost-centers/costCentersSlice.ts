import { createSlice } from "@reduxjs/toolkit";

const initialState: CostCentersState = {
  cost_centers: [],
  cost_centersLoading: false,
  cost_centersError: null,
  cost_center: null,
  cost_centerLoading: false,
  cost_centerError: null,
};

const costCentersSlice = createSlice({
  name: "costCenters",
  initialState,
  reducers: {},
  extraReducers: () => {},
});

export default costCentersSlice.reducer;
