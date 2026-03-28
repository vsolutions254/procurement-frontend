import { createSlice } from "@reduxjs/toolkit";

const initialState: ProjectsState = {
  projects: [],
  projectsLoading: false,
  projectsError: null,
  project: null,
  projectLoading: false,
  projectError: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: () => {},
});

export default projectsSlice.reducer;
