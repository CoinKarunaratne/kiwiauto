import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  businessID: "bOrNKUaTVF7dc01hh29m",
};

export const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setBusiness: (state, action) => {
      state.businessID = action.payload.businessID;
    },
  },
});

export const { setBusiness } = businessSlice.actions;
export default businessSlice.reducer;
