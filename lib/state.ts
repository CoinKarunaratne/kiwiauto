import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  businessID: "bOrNKUaTVF7dc01hh29m",
  businessName: "Car Grooming",
};

export const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setBusiness: (state, action) => {
      state.businessID = action.payload.businessID;
      state.businessName = action.payload.businessName;
    },
  },
});

export const { setBusiness } = businessSlice.actions;
export default businessSlice.reducer;
